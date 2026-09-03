type LeadEmailInput = {
  to: string
  subject: string
  text: string
  replyTo?: string
}

type RuntimeEnv = Record<string, string | undefined>
type SendLeadEmailOptions = {
  env?: RuntimeEnv
}

// Delivery order: SMTP first (SMTP_HOST + SMTP_USER + SMTP_PASSWORD set),
// falling back to the AWS SES HTTP API only when SMTP is not configured.
// SMTP runs through nodemailer, imported dynamically so the Workers bundle
// (Cloudflare Pages Functions) never loads Node-only modules unless the
// SMTP branch is actually taken - on Workers, configure SES instead.

function getRequiredEnv(name: string, env?: RuntimeEnv): string {
  const value = (env?.[name] ?? process.env[name])?.trim()
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getEnv(name: string, env?: RuntimeEnv): string {
  return (env?.[name] ?? process.env[name])?.trim() ?? ''
}

async function hmacSha256(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data))
}

async function sha256(data: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data))
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function getSignatureKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string,
): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(new TextEncoder().encode('AWS4' + secretKey), dateStamp)
  const kRegion = await hmacSha256(kDate, region)
  const kService = await hmacSha256(kRegion, service)
  return hmacSha256(kService, 'aws4_request')
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function signRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
  accessKeyId: string,
  secretAccessKey: string,
  region: string,
  service: string,
): Promise<Record<string, string>> {
  const parsedUrl = new URL(url)
  const now = new Date()
  const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const dateStamp = amzDate.slice(0, 8)

  const allHeaders: Record<string, string> = {
    ...headers,
    host: parsedUrl.host,
    'x-amz-date': amzDate,
  }

  const sortedHeaderKeys = Object.keys(allHeaders).sort()
  const canonicalHeaders = sortedHeaderKeys.map((k) => `${k}:${allHeaders[k]}\n`).join('')
  const signedHeaders = sortedHeaderKeys.join(';')

  const payloadHash = await sha256(body)

  const canonicalRequest = [
    method,
    parsedUrl.pathname,
    parsedUrl.search.slice(1),
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256(canonicalRequest),
  ].join('\n')

  const signingKey = await getSignatureKey(secretAccessKey, dateStamp, region, service)
  const signature = toHex(await hmacSha256(signingKey, stringToSign))

  const authorizationHeader =
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    ...allHeaders,
    authorization: authorizationHeader,
  }
}

function smtpConfigured(env?: RuntimeEnv): boolean {
  return Boolean(getEnv('SMTP_HOST', env) && getEnv('SMTP_USER', env) && getEnv('SMTP_PASSWORD', env))
}

async function sendViaSmtp(
  { to, subject, text, replyTo }: LeadEmailInput,
  env?: RuntimeEnv,
): Promise<void> {
  const host = getRequiredEnv('SMTP_HOST', env)
  const user = getRequiredEnv('SMTP_USER', env)
  const pass = getRequiredEnv('SMTP_PASSWORD', env)
  const from = getEnv('SMTP_MAIL_FROM', env) || getEnv('SES_FROM_EMAIL', env) || user
  // STARTTLS on 587 by default; SMTP_SSL_PORT switches to implicit TLS (465).
  const sslPort = Number(getEnv('SMTP_SSL_PORT', env))
  const tlsPort = Number(getEnv('SMTP_TLS_PORT', env))
  const useSsl = Number.isFinite(sslPort) && sslPort > 0 && !(Number.isFinite(tlsPort) && tlsPort > 0)
  const port = useSsl ? sslPort : Number.isFinite(tlsPort) && tlsPort > 0 ? tlsPort : 587

  const { default: nodemailer } = await import('nodemailer')
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: useSsl,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    ...(replyTo ? { replyTo } : {}),
  })
}

export async function sendLeadEmail(
  input: LeadEmailInput,
  options: SendLeadEmailOptions = {},
): Promise<void> {
  if (smtpConfigured(options.env)) {
    await sendViaSmtp(input, options.env)
    return
  }
  await sendViaSes(input, options)
}

async function sendViaSes(
  { to, subject, text, replyTo }: LeadEmailInput,
  options: SendLeadEmailOptions = {},
): Promise<void> {
  const accessKeyId = getRequiredEnv('AWS_ACCESS_KEY_ID', options.env)
  const secretAccessKey = getRequiredEnv('AWS_SECRET_ACCESS_KEY', options.env)
  const region = getEnv('AWS_REGION', options.env) || 'ap-south-1'
  const from = getRequiredEnv('SES_FROM_EMAIL', options.env)

  const endpoint = `https://email.${region}.amazonaws.com/`

  const params = new URLSearchParams({
    Action: 'SendEmail',
    Version: '2010-12-01',
    'Source': from,
    'Destination.ToAddresses.member.1': to,
    'Message.Subject.Data': subject,
    'Message.Subject.Charset': 'UTF-8',
    'Message.Body.Text.Data': text,
    'Message.Body.Text.Charset': 'UTF-8',
  })

  if (replyTo) {
    params.set('ReplyToAddresses.member.1', replyTo)
  }

  const body = params.toString()

  const signedHeaders = await signRequest(
    'POST',
    endpoint,
    { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    accessKeyId,
    secretAccessKey,
    region,
    'ses',
  )

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: signedHeaders,
    body,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`SES API error (${response.status}): ${errorText}`)
  }
}
