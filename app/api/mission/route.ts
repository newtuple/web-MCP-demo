import { NextResponse } from 'next/server'
import { inferVisitorContext, normalizeVisitorContext } from '@/lib/adaptiveSite'

const contextSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    intent: { type: 'string', enum: ['general', 'services', 'products', 'careers'] },
    industry: { type: 'string' },
    role: { type: 'string', enum: ['CIO', 'CTO', 'Data Leader', 'Operations Leader', 'Founder', 'Candidate', 'Unknown'] },
    systems: { type: 'array', items: { type: 'string' } },
    goal: { type: 'string' },
    technical_depth: { type: 'string', enum: ['low', 'medium', 'high'] },
    buying_stage: { type: 'string', enum: ['exploring', 'evaluating', 'ready', 'implementation'] },
  },
  required: ['intent', 'industry', 'role', 'systems', 'goal', 'technical_depth', 'buying_stage'],
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const statement = typeof body.statement === 'string' ? body.statement.trim().slice(0, 1200) : ''
  const fallback = inferVisitorContext(statement)
  const apiKey = process.env.OPENAI_API_KEY

  if (!statement || !apiKey) {
    return NextResponse.json({ context: fallback, source: 'fallback' })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.5',
        store: false,
        input: [
          { role: 'system', content: 'You classify Newtuple website visitors. Extract only facts supported by the statement. Use Unknown/general defaults where uncertain. Return the exact requested schema.' },
          { role: 'user', content: statement },
        ],
        text: { format: { type: 'json_schema', name: 'visitor_context', strict: true, schema: contextSchema } },
      }),
    })
    if (!response.ok) throw new Error(`OpenAI returned ${response.status}`)
    const payload = await response.json()
    const raw = payload.output_text ? JSON.parse(payload.output_text) : null
    return NextResponse.json({ context: normalizeVisitorContext(raw ?? fallback), source: 'openai' })
  } catch {
    return NextResponse.json({ context: fallback, source: 'fallback' })
  }
}
