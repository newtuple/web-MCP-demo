# Cloudflare Secrets Runbook (SES + Lead Endpoints)

This project needs server-side secrets for SMTP (AWS SES) and lead routing email addresses.

## Required secret keys

- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_MAIL_FROM`
- `SMTP_TLS_PORT`
- `SMTP_SSL_PORT`
- `SMTP_USE_SSL`
- `CONTACT_LEADS_EMAIL`
- `CAREERS_LEADS_EMAIL`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`

## Cloudflare Pages (Functions) setup

1. Open Cloudflare dashboard.
2. Go to **Workers & Pages**.
3. Open your Pages project.
4. Go to **Settings > Variables and Secrets**.
5. Add each key in both:
- **Production** environment values.
- **Preview** environment values (if preview deploys are used).
6. Redeploy the project so new secrets are available to Functions.
7. Ensure the repo contains Pages Functions files under `functions/_api_serverless/...` so POST endpoints are mapped.
8. In **Settings > Functions**, enable Node.js compatibility (`nodejs_compat`) for SMTP dependencies.

## Cloudflare Workers setup (Wrangler CLI)

Run these commands in your worker project (one per secret):

```bash
wrangler secret put SMTP_HOST
wrangler secret put SMTP_USER
wrangler secret put SMTP_PASSWORD
wrangler secret put SMTP_MAIL_FROM
wrangler secret put CONTACT_LEADS_EMAIL
wrangler secret put CAREERS_LEADS_EMAIL
```

For non-sensitive values, use environment variables in `wrangler.toml` (for example rate-limits and ports).

## Rotation policy

1. Rotate AWS SES credentials in AWS IAM.
2. Update Cloudflare secrets immediately after rotation.
3. Redeploy.
4. Verify contact and careers test submissions.

## Verification checklist

1. Submit `/contactus` form and confirm lead email is received.
2. Submit `/careers` form and confirm careers email is received.
3. Confirm no secrets are present in client-side bundles or logs.
4. Confirm rate limiting still returns `429` with `Retry-After` when exceeded.
5. Confirm deployment details show listed functions for:
- `/_api_serverless/contact/submit`
- `/_api_serverless/careers/submit`
