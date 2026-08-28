import { webSearchTool, Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";
import { z } from "zod";


// Tool definitions
const webSearchPreview = webSearchTool({
  filters: {
    allowed_domains: [
      "www.newtuple.com"
    ]
  },
  searchContextSize: "medium",
  userLocation: {
    type: "approximate"
  }
})
const TriageRequestSchema = z.object({ classification: z.enum(["needs_clarification", "quote_request", "support_issue", "feature_request", "partnership_or_sales", "spam_or_noise", "unknown"]), confidence: z.number(), summary: z.string(), request_type: z.enum(["new_project", "change_request", "bug", "question", "other"]), urgency: z.enum(["low", "medium", "high", "critical"]), impact: z.enum(["revenue", "cost", "team_productivity", "customer_experience", "compliance", "unknown"]), missing_info: z.array(z.string()), assumptions: z.array(z.string()), recommended_next_step: z.string(), routing: z.object({ team: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]), priority: z.enum(["P0", "P1", "P2", "P3"]) }) });
const AskClarifyingQuestionsSchema = z.object({ to_client_message: z.string(), internal_summary: z.string(), internal_tasks: z.array(z.object({ owner: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]), task: z.string(), priority: z.enum(["P0", "P1", "P2", "P3"]) })), next_questions: z.array(z.string()), handoff_team: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]) });
const SupportIntakeSchema = z.object({ to_client_message: z.string(), internal_summary: z.string(), internal_tasks: z.array(z.object({ owner: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]), task: z.string(), priority: z.enum(["P0", "P1", "P2", "P3"]) })), next_questions: z.array(z.string()), handoff_team: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]) });
const DraftQuoteIntakeSchema = z.object({ to_client_message: z.string(), internal_summary: z.string(), internal_tasks: z.array(z.object({ owner: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]), task: z.string(), priority: z.enum(["P0", "P1", "P2", "P3"]) })), next_questions: z.array(z.string()), handoff_team: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]) });
const FallbackHandlerSchema = z.object({ to_client_message: z.string(), internal_summary: z.string(), internal_tasks: z.array(z.object({ owner: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]), task: z.string(), priority: z.enum(["P0", "P1", "P2", "P3"]) })), next_questions: z.array(z.string()), handoff_team: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]) });
const SpamNoiseResponseSchema = z.object({ to_client_message: z.string(), internal_summary: z.string(), internal_tasks: z.array(z.object({ owner: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]), task: z.string(), priority: z.enum(["P0", "P1", "P2", "P3"]) })), next_questions: z.array(z.string()), handoff_team: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]) });
const FeatureIntakeAccpetanceCriteriaSchema = z.object({ to_client_message: z.string(), internal_summary: z.string(), internal_tasks: z.array(z.object({ owner: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]), task: z.string(), priority: z.enum(["P0", "P1", "P2", "P3"]) })), next_questions: z.array(z.string()), handoff_team: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]) });
const PartnershipSalesSchema = z.object({ to_client_message: z.string(), internal_summary: z.string(), internal_tasks: z.array(z.object({ owner: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]), task: z.string(), priority: z.enum(["P0", "P1", "P2", "P3"]) })), next_questions: z.array(z.string()), handoff_team: z.enum(["BA", "Engineering", "Support", "Sales", "Ignore"]) });
const triageRequest = new Agent({
  name: "Triage request",
  instructions: `You are a Client Request Triage Agent for Newtuple Technologies.

Input: a raw client message.

Your job:
1) Understand what the client is asking for.
2) Classify the request into exactly ONE of these values:
- needs_clarification
- quote_request
- support_issue
- feature_request
- partnership_or_sales
- spam_or_noise
- unknown

3) Produce a tight summary in plain English.
4) Identify missing information needed to proceed.
5) Set urgency based on explicit deadlines, outages, money impact, or escalations.
6) Route to a team: BA, Engineering, Support, Sales, or Ignore.

CRITICAL ROUTING RULES (follow strictly):

- If the client is exploring, curious, unsure where to start, or asking for recommendations/options WITHOUT mentioning pricing, timelines, vendor selection, implementation plans, or partnerships, classification MUST be needs_clarification.

- Phrases like “what do you recommend”, “can you share options”, “not sure where to start”, “curious about AI agents”, or “can you help” are NOT sales or partnership signals by themselves.

- partnership_or_sales is ONLY valid if the client explicitly mentions:
  partnership, reseller, referral, revenue share, co-selling, alliance, channel, or being a services/technology partner.

- Do NOT infer partnership or sales intent from discovery-call language alone.

- When in doubt between needs_clarification and partnership_or_sales, ALWAYS choose needs_clarification.

Routing constraint:
If classification == needs_clarification, routing.team MUST be BA.

Rules:
- Do not invent facts. If something is unclear, put it in missing_info or assumptions.
- Be strict: if you cannot proceed without more info, classification must be needs_clarification.
- Return ONLY valid JSON that matches the output format.
- Always use the web search tool call

Urgency values: low, medium, high, critical.
Impact values: revenue, cost, team_productivity, customer_experience, compliance, unknown.
Request_type values: new_project, change_request, bug, question, other.
Routing.priority values: P0, P1, P2, P3.
`,
  model: "gpt-5.1",
  tools: [
    webSearchPreview
  ],
  outputType: TriageRequestSchema,
  modelSettings: {
    reasoning: {
      effort: "low"
    },
    store: true
  }
});

const askClarifyingQuestions = new Agent({
  name: "Ask Clarifying Questions",
  instructions: `You handle requests that are not actionable yet.

Use the triage JSON provided as input.
Write:
1) A short to-client message that asks the minimum questions needed to proceed.
2) An internal summary for the team.
3) A list of internal tasks (owner + task + priority).
4) next_questions must be 47 questions max, crisp and specific.
5) handoff_team should match triage.routing.team if present, else BA.

Return ONLY valid JSON matching action_packet_v1.
Tone: helpful, direct, not salesy.

Do NOT mention partnerships, reselling, or commercial models and long explanations unless the client explicitly asked about them.
`,
  model: "gpt-5",
  outputType: AskClarifyingQuestionsSchema,
  modelSettings: {
    reasoning: {
      effort: "minimal",
      summary: "auto"
    },
    store: true
  }
});

const supportIntake = new Agent({
  name: "Support Intake",
  instructions: `Client reported a support issue.

Produce:
- to_client_message: acknowledge, ask for reproducible details, offer immediate next action.
- next_questions: environment, steps to reproduce, timestamps, screenshots/logs, severity.
- internal_tasks: Support owner primary, Engineering if needed.
- If triage.urgency is critical/high, include a task with priority P0/P1.
- Do not include long explanations

Return ONLY JSON matching action_packet_v1.
handoff_team: Support.
`,
  model: "gpt-5-nano",
  outputType: SupportIntakeSchema,
  modelSettings: {
    reasoning: {
      effort: "minimal",
      summary: "auto"
    },
    store: true
  }
});

const draftQuoteIntake = new Agent({
  name: "Draft Quote Intake",
  instructions: `Client is requesting pricing / quote / proposal.

Goal: qualify and scope just enough to produce an accurate quote or timeline, without drafting a full proposal.

Produce:
- to_client_message:
  - Keep it short (57 sentences max).
  - Ask ONLY for:
    • scope basics (primary use cases + systems to integrate)
    • timeline (target start date and desired go-live)
    • budget range (ballpark is acceptable)
    • decision process (decision-maker + target decision date)
  - Propose ONE clear next step: a short discovery call (3045 min).
  - Do NOT include pilot frameworks, rollout plans, pricing models, or long explanations.

- internal_summary:
  - What the client is asking for.
  - What information is missing to quote.
  - Any obvious risks or assumptions.

- internal_tasks:
  - At least one BA task (scoping / discovery prep).
  - At least one Sales task (pricing / proposal prep).

- next_questions:
  - 56 questions max.
  - Questions must map directly to scope, timeline, budget, and decision process.
  - No “nice to have” or future-state questions.

Return ONLY valid JSON matching action_packet_v1.
handoff_team: Sales.
`,
  model: "gpt-5-nano",
  outputType: DraftQuoteIntakeSchema,
  modelSettings: {
    reasoning: {
      effort: "minimal",
      summary: "auto"
    },
    store: true
  }
});

const fallbackHandler = new Agent({
  name: "Fallback Handler",
  instructions: `Classification was unknown.

Produce:
- to_client_message: ask 35 clarifying questions and request a short call if appropriate.
- internal_summary: what you think it might be + why unclear.
- internal_tasks: BA to review manually.

Return ONLY JSON matching action_packet_v1.
handoff_team: BA.
`,
  model: "gpt-4.1",
  outputType: FallbackHandlerSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const spamNoiseResponse = new Agent({
  name: "Spam/Noise Response",
  instructions: `Message is spam/noise or not worth engaging.

Produce:
- to_client_message: either an empty string OR a minimal polite decline if it seems non-malicious.
- internal_summary: why it was classified as noise.
- internal_tasks: usually none; handoff_team should be Ignore.
- Do not include long explanations

Return ONLY JSON matching action_packet_v1.
handoff_team: Ignore.
`,
  model: "gpt-4.1",
  outputType: SpamNoiseResponseSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const featureIntakeAccpetanceCriteria = new Agent({
  name: "Feature Intake + Accpetance Criteria",
  instructions: `Client asked for a new feature or change.

Produce:
- to_client_message: confirm understanding, ask for goal, users, constraints, priority, examples.
- internal_summary: feature intent + expected impact + unknowns.
- internal_tasks: BA to write brief, Engineering to review feasibility.
- next_questions: include at least 2 questions that clarify success metrics and edge cases.
- Do not include long explanations

Return ONLY JSON matching action_packet_v1.
handoff_team: BA.
`,
  model: "gpt-4.1",
  outputType: FeatureIntakeAccpetanceCriteriaSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const partnershipSales = new Agent({
  name: "Partnership / Sales",
  instructions: `Handle ONLY messages that explicitly indicate partnership, reseller, referral, or alliance intent.

Before drafting the response:
- Verify that the client explicitly mentioned partnership/reselling/co-selling.
- If the message does NOT clearly indicate partnership intent, DO NOT assume it.

Produce:
- to_client_message: acknowledge interest and ask 23 questions to confirm the partnership model being proposed.
- internal_summary: summarize the stated partnership intent and any risks.
- internal_tasks: at least one Sales-owned task.

DO NOT ask about partnership models unless the client explicitly used partnership language.
DO NOT treat exploratory or “not sure where to start” messages as partnership.
Do not include long explanations

Return ONLY JSON matching action_packet_v1.
handoff_team: Sales.
Tone: professional, neutral, non-assumptive.
`,
  model: "gpt-4.1",
  outputType: PartnershipSalesSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const renderEmailReply = new Agent({
  name: "Render Email Reply ",
  instructions: `Write an email reply the client can receive.

Return ONLY the email text (not JSON). Format as:
Subject: <one line>

<body in paragraphs>
`,
  model: "gpt-5-nano",
  modelSettings: {
    reasoning: {
      effort: "low",
      summary: "auto"
    },
    store: true
  }
});

type WorkflowInput = { input_as_text: string };


// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("Client Request Triage Agent", async () => {
    const state = {

    };
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_694a43a4ffdc81908eb915caa97776610a61e14cb84633e7"
      }
    });
    const triageRequestResultTemp = await runner.run(
      triageRequest,
      [
        ...conversationHistory
      ]
    );
    conversationHistory.push(...triageRequestResultTemp.newItems.map((item) => item.rawItem));

    if (!triageRequestResultTemp.finalOutput) {
        throw new Error("Agent result is undefined");
    }

    const triageRequestResult = {
      output_text: JSON.stringify(triageRequestResultTemp.finalOutput),
      output_parsed: triageRequestResultTemp.finalOutput
    };
    if (triageRequestResult.output_parsed.classification == "needs_clarification") {
      const askClarifyingQuestionsResultTemp = await runner.run(
        askClarifyingQuestions,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...askClarifyingQuestionsResultTemp.newItems.map((item) => item.rawItem));

      if (!askClarifyingQuestionsResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const askClarifyingQuestionsResult = {
        output_text: JSON.stringify(askClarifyingQuestionsResultTemp.finalOutput),
        output_parsed: askClarifyingQuestionsResultTemp.finalOutput
      };
      const renderEmailReplyResultTemp = await runner.run(
        renderEmailReply,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...renderEmailReplyResultTemp.newItems.map((item) => item.rawItem));

      if (!renderEmailReplyResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const renderEmailReplyResult = {
        output_text: renderEmailReplyResultTemp.finalOutput ?? ""
      };
      return renderEmailReplyResult;
    } else if (triageRequestResult.output_parsed.classification == "quote_request") {
      const draftQuoteIntakeResultTemp = await runner.run(
        draftQuoteIntake,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...draftQuoteIntakeResultTemp.newItems.map((item) => item.rawItem));

      if (!draftQuoteIntakeResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const draftQuoteIntakeResult = {
        output_text: JSON.stringify(draftQuoteIntakeResultTemp.finalOutput),
        output_parsed: draftQuoteIntakeResultTemp.finalOutput
      };
      const renderEmailReplyResultTemp = await runner.run(
        renderEmailReply,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...renderEmailReplyResultTemp.newItems.map((item) => item.rawItem));

      if (!renderEmailReplyResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const renderEmailReplyResult = {
        output_text: renderEmailReplyResultTemp.finalOutput ?? ""
      };
      return renderEmailReplyResult;
    } else if (triageRequestResult.output_parsed.classification == "support_issue") {
      const supportIntakeResultTemp = await runner.run(
        supportIntake,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...supportIntakeResultTemp.newItems.map((item) => item.rawItem));

      if (!supportIntakeResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const supportIntakeResult = {
        output_text: JSON.stringify(supportIntakeResultTemp.finalOutput),
        output_parsed: supportIntakeResultTemp.finalOutput
      };
      const renderEmailReplyResultTemp = await runner.run(
        renderEmailReply,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...renderEmailReplyResultTemp.newItems.map((item) => item.rawItem));

      if (!renderEmailReplyResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const renderEmailReplyResult = {
        output_text: renderEmailReplyResultTemp.finalOutput ?? ""
      };
      return renderEmailReplyResult;
    } else if (triageRequestResult.output_parsed.classification == "feature_request") {
      const featureIntakeAccpetanceCriteriaResultTemp = await runner.run(
        featureIntakeAccpetanceCriteria,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...featureIntakeAccpetanceCriteriaResultTemp.newItems.map((item) => item.rawItem));

      if (!featureIntakeAccpetanceCriteriaResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const featureIntakeAccpetanceCriteriaResult = {
        output_text: JSON.stringify(featureIntakeAccpetanceCriteriaResultTemp.finalOutput),
        output_parsed: featureIntakeAccpetanceCriteriaResultTemp.finalOutput
      };
      const renderEmailReplyResultTemp = await runner.run(
        renderEmailReply,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...renderEmailReplyResultTemp.newItems.map((item) => item.rawItem));

      if (!renderEmailReplyResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const renderEmailReplyResult = {
        output_text: renderEmailReplyResultTemp.finalOutput ?? ""
      };
      return renderEmailReplyResult;
    } else if (triageRequestResult.output_parsed.classification == "partnership_or_sales") {
      const partnershipSalesResultTemp = await runner.run(
        partnershipSales,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...partnershipSalesResultTemp.newItems.map((item) => item.rawItem));

      if (!partnershipSalesResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const partnershipSalesResult = {
        output_text: JSON.stringify(partnershipSalesResultTemp.finalOutput),
        output_parsed: partnershipSalesResultTemp.finalOutput
      };
      const renderEmailReplyResultTemp = await runner.run(
        renderEmailReply,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...renderEmailReplyResultTemp.newItems.map((item) => item.rawItem));

      if (!renderEmailReplyResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const renderEmailReplyResult = {
        output_text: renderEmailReplyResultTemp.finalOutput ?? ""
      };
      return renderEmailReplyResult;
    } else if (triageRequestResult.output_parsed.classification == "spam_or_noise") {
      const spamNoiseResponseResultTemp = await runner.run(
        spamNoiseResponse,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...spamNoiseResponseResultTemp.newItems.map((item) => item.rawItem));

      if (!spamNoiseResponseResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const spamNoiseResponseResult = {
        output_text: JSON.stringify(spamNoiseResponseResultTemp.finalOutput),
        output_parsed: spamNoiseResponseResultTemp.finalOutput
      };
      const renderEmailReplyResultTemp = await runner.run(
        renderEmailReply,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...renderEmailReplyResultTemp.newItems.map((item) => item.rawItem));

      if (!renderEmailReplyResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const renderEmailReplyResult = {
        output_text: renderEmailReplyResultTemp.finalOutput ?? ""
      };
      return renderEmailReplyResult;
    } else {
      const fallbackHandlerResultTemp = await runner.run(
        fallbackHandler,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...fallbackHandlerResultTemp.newItems.map((item) => item.rawItem));

      if (!fallbackHandlerResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const fallbackHandlerResult = {
        output_text: JSON.stringify(fallbackHandlerResultTemp.finalOutput),
        output_parsed: fallbackHandlerResultTemp.finalOutput
      };
      const renderEmailReplyResultTemp = await runner.run(
        renderEmailReply,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...renderEmailReplyResultTemp.newItems.map((item) => item.rawItem));

      if (!renderEmailReplyResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const renderEmailReplyResult = {
        output_text: renderEmailReplyResultTemp.finalOutput ?? ""
      };
      return renderEmailReplyResult;
    }
  });
}
