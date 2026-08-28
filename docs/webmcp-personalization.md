# WebMCP Homepage Personalization

The Newtuple homepage supports a controlled, session-based experience for buyer agents. The implementation uses the draft `document.modelContext.registerTool()` WebMCP interface.

## Tools

- `get_personalization_capabilities`: Lists supported buyer context values.
- `preview_personalized_experience`: Creates an experience manifest without changing the page.
- `apply_personalized_experience`: Applies a previously previewed manifest.
- `get_current_experience`: Returns the active manifest.
- `reset_personalized_experience`: Restores the standard homepage.
- `submit_experience_feedback`: Emits feedback for the active experience.

## Recommended Agent Flow

1. Call `get_personalization_capabilities`.
2. Ask for missing buyer context when it materially changes the result.
3. Call `preview_personalized_experience`.
4. Review the manifest with the visitor.
5. Call `apply_personalized_experience` after the visitor agrees.
6. Use `reset_personalized_experience` when the visitor wants the standard site.

## Buyer Context Example

```json
{
  "industry": "retail",
  "role": "cio",
  "goals": ["customer_support", "workflow_automation"],
  "stage": "evaluation",
  "priorities": ["security", "integration"],
  "companySize": "enterprise",
  "desiredAction": "review_architecture"
}
```

## Content Controls

The buyer agent supplies context only. It cannot supply website copy, HTML, scripts, links, case-study identifiers, or section positions. The personalization engine selects approved content from `lib/personalization/catalog.ts`.

Supported domains include retail, financial services, healthcare, aviation, technology/SaaS, and a general cross-industry fallback. The manifest can change the approved homepage narrative, section language, case studies, demos, architecture examples, CTA, secondary action, service-path order, testimonial priority, and section order.

The version 2 experience manifest always keeps the hero first and the final call to action last. The homepage remains fully functional when WebMCP is not available.

## Session Data

The browser stores previews and the active experience in `sessionStorage`. It does not send buyer context to a server. The active experience can be reset from the homepage or through WebMCP.

The feedback tool emits a `newtuple:experience-feedback` browser event. An analytics integration can listen for this event without changing the personalization engine.
