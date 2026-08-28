import { NextRequest } from 'next/server'
import { applyRateLimit } from '@/lib/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const buildLiteLLMUrl = (baseUrl: string) => {
  const trimmed = baseUrl.replace(/\/$/, '')
  return `${trimmed}/v1/chat/completions`
}

function getClientIdentifier(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for') ?? ''
  const ip = forwardedFor.split(',')[0]?.trim() || 'unknown'
  return `${ip}:contact-chat`
}

export async function POST(req: NextRequest) {
  const identifier = getClientIdentifier(req)
  const result = applyRateLimit(identifier)

  if (!result.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...(result.retryAfterSeconds ? { 'Retry-After': String(result.retryAfterSeconds) } : {}),
      },
    })
  }

  const { messages } = (await req.json()) as {
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  }

  const baseUrl = process.env.LITELLM_BASE_URL
  const model = process.env.LITELLM_MODEL

  if (!baseUrl || !model) {
    return new Response(JSON.stringify({ error: 'LiteLLM is not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const response = await fetch(buildLiteLLMUrl(baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.LITELLM_API_KEY
        ? { Authorization: `Bearer ${process.env.LITELLM_API_KEY}` }
        : {}),
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  })

  if (!response.ok || !response.body) {
    const errorText = await response.text()
    return new Response(errorText, {
      status: response.status,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const reader = response.body.getReader()

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = ''

      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          let boundary = buffer.indexOf('\n\n')
          while (boundary !== -1) {
            const chunk = buffer.slice(0, boundary)
            buffer = buffer.slice(boundary + 2)

            const lines = chunk.split('\n')
            for (const line of lines) {
              if (!line.startsWith('data:')) continue
              const data = line.replace('data:', '').trim()
              if (!data) continue

              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                controller.close()
                return
              }

              try {
                const parsed = JSON.parse(data)
                const delta = parsed?.choices?.[0]?.delta?.content
                if (delta) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`))
                }
              } catch {
                // ignore parse errors from partial chunks
              }
            }

            boundary = buffer.indexOf('\n\n')
          }
        }
      } catch (error) {
        controller.error(error)
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
