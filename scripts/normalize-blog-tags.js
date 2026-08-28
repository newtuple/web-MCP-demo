const fs = require("node:fs");
const path = require("node:path");

const blogDir = path.join(process.cwd(), "content", "blog");

// Keep this list small and stable. Each post gets one primary topic and, when
// useful, one secondary format or topic.
const tagsBySlug = {
  "5-learnings-from-developing-ai-agents-in-production": ["AI Agents", "Applied AI"],
  "a-comparison-of-llm-model-latencies": ["LLM Engineering"],
  "ai-agents-hype-vs-reality-ai-agents-ai-agentschallenges-dialogtuple-pactical-ai": ["AI Agents"],
  "ai-meets-sales-analyzing-b2b-sales-calls-with-ai": ["Applied AI"],
  "amazon-q-trying-out-the-latest-genai-offering-from-aws": ["LLM Engineering"],
  "aws-expands-its-ai-frontier-introducing-amazon-nova-and-enhanced-bedrock-guardrails": ["LLM Engineering"],
  "beyond-plain-text-mastering-openai-llm-output-for-specific-needs": ["LLM Engineering"],
  "bridging-the-gap-how-hybrid-chatbots-are-redefining-intelligent-conversations": ["AI Agents"],
  "building-a-mongodb-agent-query-your-json-data-like-a-pro": ["AI Agents", "Tutorials"],
  "building-ai-agents-frameworks-vs-raw-apis": ["AI Agents"],
  "comparing-reasoning-models-deepseek-vs-gemini-vs-oai": ["LLM Engineering"],
  "deploying-containerized-applications-quickly-with-azure-container-apps-and-acr": ["Data Engineering", "Tutorials"],
  "finance-friendly-ocr-how-docling-dolphin-others-tackle-wall-street-pdfs": ["Document AI"],
  "from-prototype-to-production-best-practices-for-building-production-ready-ai-systems": ["Applied AI"],
  "google-analytics-ua-vs-ga4-data-model-changes": ["Data Engineering"],
  "google-vs-openai-initial-impressions": ["LLM Engineering"],
  "how-ai-driven-software-development-is-transforming-the-coding-and-it-industries": ["Applied AI"],
  "how-to-build-efficient-ai-agentic-frameworks": ["AI Agents"],
  "how-to-install-and-use-ollama-for-hosting-llm-models-locally": ["LLM Engineering", "Tutorials"],
  "how-to-tackle-model-interoperability": ["LLM Engineering"],
  "improving-data-quality-with-dbt-tests": ["Data Engineering", "Tutorials"],
  "introducing-our-generative-ai-accelerators": ["Applied AI"],
  "is-ai-going-to-replace-software-engineers": ["Applied AI"],
  "key-takeaways-for-ai-developers-from-openai-devday": ["LLM Engineering"],
  "lessons-from-building-AI-agents-context-management": ["AI Agents"],
  "llms-vs-cloud-ocr-a-new-chapter-in-text-recognition": ["Document AI"],
  "lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms": ["Document AI"],
  "master-the-art-of-data-streamlining-with-innovative-pub-sub-pipelines": ["Data Engineering"],
  "modern-data-stack-on-your-laptop": ["Data Engineering", "Tutorials"],
  "native-ai-apps-inside-chatgpt-and-claude": ["Applied AI"],
  "newtuple-openai-select-partner": ["Applied AI"],
  "ocr-benchmark-paddleocr-docling-llamaparse-surya": ["Document AI"],
  "openai-structured-outputs": ["LLM Engineering"],
  "rethinking-ai-agents-how-openai-agents-sdk-and-google-adk-outshines-langgraph": ["AI Agents"],
  "run-deepseek-r1-on-your-laptop-in-5-minutes-or-less": ["LLM Engineering", "Tutorials"],
  "setup-dagster-on-your-machine-in-5-minutes-or-less": ["Data Engineering", "Tutorials"],
  "setup-dbt-core-on-your-machine-in-5-minutes-or-less": ["Data Engineering", "Tutorials"],
  "speed-and-scalability-in-vector-search": ["Data Engineering"],
  "temporal-accuracy-and-llms": ["LLM Engineering"],
  "the-hidden-cost-of-bad-prompts-why-typos-and-sloppy-formatting-sabotage-your-business-ai": ["LLM Engineering"],
  "the-ultimate-pricing-cheat-sheet-for-large-language-models": ["LLM Engineering"],
  "unleashing-efficiency-batch-processing-with-large-language-models": ["LLM Engineering"],
  "which-vector-search-should-i-use-a-practical-guide": ["Data Engineering"],
  "will-ai-replace-your-data-team": ["Applied AI"],
};

const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md") && file !== "README.md");
const slugs = files.map((file) => path.basename(file, ".md"));
const missing = slugs.filter((slug) => !tagsBySlug[slug]);
const stale = Object.keys(tagsBySlug).filter((slug) => !slugs.includes(slug));

if (missing.length || stale.length) {
  throw new Error(`Tag map mismatch. Missing: ${missing.join(", ") || "none"}. Stale: ${stale.join(", ") || "none"}.`);
}

for (const slug of slugs) {
  const file = path.join(blogDir, `${slug}.md`);
  const source = fs.readFileSync(file, "utf8");
  const tagBlock = `tags:\n${tagsBySlug[slug].map((tag) => `  - "${tag}"`).join("\n")}`;
  const next = /^tags:/m.test(source)
    ? source.replace(/^tags:\n(?:  - .+\n?)+/m, `${tagBlock}\n`)
    : source.replace(/^(heroImage:|comments:)/m, `${tagBlock}\n$1`);

  if (!next.includes(`${tagBlock}\n`)) throw new Error(`Could not update tags in ${file}`);

  fs.writeFileSync(file, next);
}

console.log(`Normalized tags for ${slugs.length} blog posts.`);
