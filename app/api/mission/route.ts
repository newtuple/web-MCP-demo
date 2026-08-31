import { NextResponse } from 'next/server'
import {
  createFallbackMissionExperience,
  missionExperienceSchema,
  normalizeMissionExperience,
} from '@/lib/missionExperience'

const systemPrompt = `You are the experience compiler for Newtuple, an AI engineering company.
Turn one visitor mission into a complete, sharply personalized website experience blueprint.

Your output controls real React UI primitives: layout, hero, navigation, build animation labels, journey, metrics, three content sections, and calls to action.

Rules:
- Make the result materially specific to the visitor's wording, industry, systems, role, technical depth, and buying stage.
- Choose a layout that fits the task: command-center for operational action, blueprint for technical architecture, constellation for product comparison, storyboard for careers or narrative discovery.
- Write concise, confident content. Avoid generic phrases such as "unlock potential", "digital transformation", or "cutting-edge solutions".
- Never invent Newtuple client names, percentages, savings, timelines, certifications, or project outcomes.
- The proof section should describe what evidence to inspect and may use proof keywords, but must not fabricate facts.
- Keep human approval explicit before consultations, applications, or lead actions.
- Use only href values allowed by the schema.
- Return exactly the requested JSON schema.`

const extractOutputText = (payload: any) => {
  if (typeof payload?.output_text === 'string') return payload.output_text
  if (!Array.isArray(payload?.output)) return ''
  for (const item of payload.output) {
    if (!Array.isArray(item?.content)) continue
    for (const content of item.content) {
      if (content?.type === 'output_text' && typeof content.text === 'string') return content.text
    }
  }
  return ''
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const statement = typeof body.statement === 'string' ? body.statement.trim().slice(0, 1200) : ''
  const generation = Number.isFinite(Number(body.generation)) ? Math.max(1, Math.floor(Number(body.generation))) : 1
  const fallback = createFallbackMissionExperience(statement)
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-5.5'

  if (!statement) {
    return NextResponse.json({ context: fallback.context, experience: fallback, source: 'fallback', model: null, fallbackReason: 'missing_statement' })
  }

  if (!apiKey) {
    return NextResponse.json({ context: fallback.context, experience: fallback, source: 'fallback', model: null, fallbackReason: 'missing_api_key' })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        store: false,
        max_output_tokens: 3200,
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Visitor mission:\n${statement}\n\nComposition variation: ${generation}. Choose the best layout for this mission, and avoid repeating a generic homepage composition.` },
        ],
        text: {
          verbosity: 'medium',
          format: {
            type: 'json_schema',
            name: 'newtuple_experience_blueprint',
            strict: true,
            schema: missionExperienceSchema,
          },
        },
      }),
    })

    if (!response.ok) throw new Error(`openai_http_${response.status}`)
    const payload = await response.json()
    const outputText = extractOutputText(payload)
    if (!outputText) throw new Error('openai_empty_output')
    const experience = normalizeMissionExperience(JSON.parse(outputText), fallback)

    return NextResponse.json({
      context: experience.context,
      experience,
      source: 'openai',
      model: payload.model ?? model,
      responseId: payload.id ?? null,
    })
  } catch (error) {
    const fallbackReason = error instanceof Error && error.message.startsWith('openai_') ? error.message : 'openai_request_failed'
    console.error('Mission experience generation failed', fallbackReason)
    return NextResponse.json({ context: fallback.context, experience: fallback, source: 'fallback', model: null, fallbackReason })
  }
}
