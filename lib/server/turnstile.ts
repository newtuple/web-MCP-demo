const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

type TurnstileResult = {
  success: boolean
  'error-codes'?: string[]
}

export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  ip?: string,
): Promise<{ success: boolean }> {
  try {
    const body: Record<string, string> = {
      secret: secretKey,
      response: token,
    }
    if (ip) body.remoteip = ip

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) return { success: false }

    const data = (await res.json()) as TurnstileResult
    return { success: data.success === true }
  } catch {
    return { success: false }
  }
}
