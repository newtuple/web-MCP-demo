const fs = require('fs')
const path = require('path')

const articlePath = path.join(
  process.cwd(),
  'content/blog/the-ultimate-pricing-cheat-sheet-for-large-language-models.md',
)

let article = fs.readFileSync(articlePath, 'utf8')

article = article
  .replace(/^date: "\d{4}-\d{2}-\d{2}"/m, 'date: "2026-08-18"')
  .replace(/updated: "\d{4}-\d{2}-\d{2}"/, 'updated: "2026-08-20"')
  .replace(/Last update - \d{1,2} [A-Za-z]+ \d{4}/, 'Last update - 20 August 2026')
  .replace(
    'Latest updates: Most comprehensive update on LLM pricing',
    'Latest updates: Current flagship, value, embedding, and fine-tuning prices from official provider pages',
  )
  .replace(
    /The big challenge in comparing pricing across providers is the usage of different terms for pricing[\s\S]*?Nevertheless, it's a good start for you to start estimating costs\./,
    'The main challenge in comparing providers is that the headline token rate is no longer the full price. Providers can charge different rates for input, cached input, output, long context, tools, search, regions, data residency, and service tiers. The tables below normalize text prices to US dollars per million tokens where possible, and call out important extra charges.',
  )
  .replace(
    'Most of you have already tried ChatGPT / Bard, and the next value unlock will be to customize the powerful capabilities of an LLM towards your specific use case and application.',
    'Most teams have already tried general-purpose AI assistants, and the next value unlock is to apply a model to a specific use case and application.',
  )

const chatTable = `| Provider | Model | Context | Price / 1M input tokens | Cached input | Price / 1M output tokens | Notes |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| OpenAI | GPT-5.6 Sol | 1.05M | $5.00 | $0.50 | $30.00 | Standard API rate |
| OpenAI | GPT-5.6 Terra | 1.05M | $2.00 | $0.20 | $12.00 | Standard API rate |
| OpenAI | GPT-5.6 Luna | 1.05M | $0.20 | $0.02 | $1.20 | Standard API rate |
| OpenAI | GPT-5.5 | 1.05M | $5.00 | $0.50 | $30.00 | Requests above 272k input tokens use higher long-context rates |
| OpenAI | GPT-5.5 Pro | 1.05M | $30.00 | — | $180.00 | Pro model |
| OpenAI | GPT-5.4 | 1.05M | $2.50 | $0.25 | $15.00 | Requests above 272k input tokens use higher long-context rates |
| OpenAI | GPT-5.4 mini | 400k | $0.75 | $0.075 | $4.50 | Standard API rate |
| OpenAI | GPT-5.4 nano | 400k | $0.20 | $0.02 | $1.25 | Standard API rate |
| OpenAI | GPT-5.3 Codex | 400k | $1.75 | $0.175 | $14.00 | Specialized coding model |
| OpenAI | GPT-5.2 | 400k | $1.75 | $0.175 | $14.00 | Previous model |
| OpenAI | GPT-5.2 Pro | 400k | $21.00 | — | $168.00 | Previous Pro model |
| OpenAI | GPT-5 | 400k | $1.25 | $0.125 | $10.00 | Previous model |
| OpenAI | GPT-5 mini | 400k | $0.25 | $0.025 | $2.00 | Previous mini model |
| OpenAI | GPT-5 nano | 400k | $0.05 | $0.005 | $0.40 | Previous nano model |
| OpenAI | GPT-5 Pro | 400k | $15.00 | — | $120.00 | Previous Pro model |
| OpenAI | o3 | 200k | $2.00 | $0.50 | $8.00 | Reasoning model |
| OpenAI | o3-pro | 200k | $20.00 | — | $80.00 | Pro reasoning model |
| OpenAI | GPT-4.1 | 1.05M | $2.00 | $0.50 | $8.00 | Previous non-reasoning model |
| OpenAI | GPT-4.1 mini | 1.05M | $0.40 | $0.10 | $1.60 | Previous non-reasoning model |
| OpenAI | GPT-4.1 nano | 1.05M | $0.10 | $0.025 | $0.40 | Previous non-reasoning model |
| OpenAI | GPT-4o | 128k | $2.50 | $1.25 | $10.00 | Previous multimodal model |
| OpenAI | GPT-4o mini | 128k | $0.15 | $0.075 | $0.60 | Previous multimodal model |
| Anthropic | Claude Fable 5 | 1M | $10.00 | $1.00 | $50.00 | Standard Claude API rate |
| Anthropic | Claude Mythos 5 | 1M | $10.00 | $1.00 | $50.00 | Limited availability |
| Anthropic | Claude Opus 5 | 1M | $5.00 | $0.50 | $25.00 | Standard mode; fast mode is $10 / $50 |
| Anthropic | Claude Opus 4.8 | 1M | $5.00 | $0.50 | $25.00 | Standard Claude API rate |
| Anthropic | Claude Opus 4.7 | 1M | $5.00 | $0.50 | $25.00 | Standard Claude API rate |
| Anthropic | Claude Opus 4.6 | See model card | $5.00 | $0.50 | $25.00 | Standard Claude API rate |
| Anthropic | Claude Opus 4.5 | See model card | $5.00 | $0.50 | $25.00 | Standard Claude API rate |
| Anthropic | Claude Opus 4.1 | See model card | $15.00 | $1.50 | $75.00 | Deprecated |
| Anthropic | Claude Opus 4 | See model card | $15.00 | $1.50 | $75.00 | Retired except on Google Cloud |
| Anthropic | Claude Sonnet 5 | 1M | $2.00 | $0.20 | $10.00 | Promotional rate through 31 August 2026; then $3 / $15 |
| Anthropic | Claude Sonnet 4.6 | See model card | $3.00 | $0.30 | $15.00 | Standard Claude API rate |
| Anthropic | Claude Sonnet 4.5 | See model card | $3.00 | $0.30 | $15.00 | Standard Claude API rate |
| Anthropic | Claude Sonnet 4 | See model card | $3.00 | $0.30 | $15.00 | Retired except on Bedrock and Google Cloud |
| Anthropic | Claude Haiku 4.5 | 200k | $1.00 | $0.10 | $5.00 | Standard Claude API rate |
| Anthropic | Claude Haiku 3.5 | See model card | $0.80 | $0.08 | $4.00 | Retired except on Bedrock and Google Cloud |
| Google Vertex AI | Gemini 3.1 Pro Preview | Tiered | $2.00 | $0.20 | $12.00 | Global rate for requests up to 200k input tokens; long-context input/output is $4 / $18 |
| Google Vertex AI | Gemini 3.7 Flash | Tiered | $0.75 | $0.075 | $3.75 | Introductory global rate through 31 December 2026 |
| Google Vertex AI | Gemini 3.6 Flash | Tiered | $0.75 | $0.075 | $3.75 | Introductory global rate through 31 December 2026 |
| Google Vertex AI | Gemini 3.5 Flash | Tiered | $1.50 | $0.15 | $9.00 | Global standard rate |
| Google Vertex AI | Gemini 3.5 Flash-Lite | Tiered | $0.30 | $0.03 | $2.50 | Global standard rate |
| Google Vertex AI | Gemini 3 Flash Preview | Tiered | $0.50 | $0.05 | $3.00 | Text, image, and video input rate shown |
| Google Vertex AI | Gemini 3.1 Flash-Lite | Tiered | $0.25 | $0.025 | $1.50 | Text, image, and video input rate shown |
| Google Vertex AI | Gemini Omni Flash | Tiered | $1.50 | $0.15 | $9.00 | Multimodal global rate |
| Google Vertex AI | Gemma 4 26B | See model card | $0.15 | $0.015 | $0.60 | Open-model endpoint on Vertex AI |
| xAI | Grok 4.5 | 500k | $2.00 | $0.30 | $6.00 | Long-context rates from 200k tokens are $4 / $0.60 / $12 |
| xAI | Grok 4.3 | 1M | $1.25 | $0.20 | $2.50 | Long-context rates from 200k tokens are $2.50 / $0.40 / $5 |
| xAI | Grok 4.20 Reasoning | 1M | $1.25 | $0.20 | $2.50 | Model ID grok-4.20-0309-reasoning; long-context rates are 2× |
| xAI | Grok 4.20 Non-Reasoning | 1M | $1.25 | $0.20 | $2.50 | Model ID grok-4.20-0309-non-reasoning; long-context rates are 2× |
| xAI | Grok 4.20 Multi-Agent | 1M | $1.25 | $0.20 | $2.50 | Beta multi-agent model; long-context rates are 2× |
| xAI | Grok Build 0.1 | 256k | $1.00 | $0.20 | $2.00 | Early-access coding model; long-context rates from 200k tokens are 2× |
| Mistral | Mistral Medium 3.5 | See model card | $1.50 | $0.15 | $7.50 | Direct Mistral API; cached input uses the stated 90% discount |
| Mistral | Mistral Small 4 | See model card | $0.15 | $0.015 | $0.60 | Direct Mistral API |
| Mistral | Mistral Large 3 | See model card | $0.50 | $0.05 | $1.50 | Direct Mistral API |
| Mistral | Ministral 3 14B | See model card | $0.20 | $0.02 | $0.20 | Direct Mistral API |
| Mistral | Ministral 3 8B | See model card | $0.15 | $0.015 | $0.15 | Direct Mistral API |
| Mistral | Ministral 3 3B | See model card | $0.10 | $0.01 | $0.10 | Direct Mistral API |
| Mistral | Devstral 2 | See model card | $0.40 | — | $2.00 | Coding model |
| Mistral | Devstral Small 2 | See model card | $0.10 | — | $0.30 | Labs coding model |
| Mistral | Codestral | See model card | $0.30 | $0.03 | $0.90 | Direct Mistral API |
| Mistral | Magistral Medium | See model card | $2.00 | — | $5.00 | Reasoning model |
| Mistral | Magistral Small | See model card | $0.50 | — | $1.50 | Reasoning model |
| Mistral | Voxtral Small | See model card | $0.10 | — | $0.40 | Text-token rate; audio input is $0.004 per minute |
| Mistral | Leanstral 1.5 | See model card | Free | Free | Free | Experimental model; limited-period free endpoint |
| Cohere | Command A | 256k | $2.50 | — | $10.00 | Current Command A model family |
| Cohere | Command R+ | 128k | $2.50 | — | $10.00 | Model ID command-r-plus-08-2024 |
| Cohere | Command R | 128k | $0.15 | — | $0.60 | Model ID command-r-08-2024 |
| Cohere | Aya Expanse 32B | 128k | $0.50 | — | $1.50 | Research model API rate |
| Cohere | Aya Expanse 8B | 128k | $0.50 | — | $1.50 | Research model API rate |
| Cohere | Command R+ 04-2024 | 128k | $3.00 | — | $15.00 | Legacy model |
| Cohere | Command R 03-2024 | 128k | $0.50 | — | $1.50 | Legacy model |
| Cohere | Command | See model card | $1.00 | — | $2.00 | Legacy model for existing customers |
| Cohere | Command-light | See model card | $0.30 | — | $0.60 | Legacy model for existing customers |
| Perplexity | Sonar | 128k | $1.00 | — | $1.00 | A separate $5–$12 per 1,000 requests fee applies |
| Perplexity | Sonar Pro | 200k | $3.00 | — | $15.00 | A separate $6–$14 per 1,000 requests fee applies |
| Perplexity | Sonar Reasoning Pro | 128k | $2.00 | — | $8.00 | A separate $6–$14 per 1,000 requests fee applies |
| Perplexity | Sonar Deep Research | 128k | $2.00 | — | $8.00 | Citation, reasoning-token, and search-query fees also apply |
| Groq | Llama 3.1 8B Instant | 131k | $0.05 | — | $0.08 | Production model |
| Groq | Llama 3.3 70B Versatile | 131k | $0.59 | — | $0.79 | Production model |
| Groq | GPT OSS 120B | 131k | $0.15 | — | $0.60 | Production model |
| Groq | GPT OSS 20B | 131k | $0.075 | — | $0.30 | Production model |
| Groq | Qwen 3.6 27B | 131k | $0.60 | — | $3.00 | Preview model |
| Groq | Safety GPT OSS 20B | 131k | $0.075 | — | $0.30 | Preview safeguard model |
| Groq | Llama Prompt Guard 2 22M | 512 | $0.03 | — | $0.03 | Preview safeguard model |
| Groq | Llama Prompt Guard 2 86M | 512 | $0.04 | — | $0.04 | Preview safeguard model |
| DeepSeek | DeepSeek V4 Flash | 1M | $0.14 | $0.0028 | $0.28 | Cache-miss input rate shown |
| DeepSeek | DeepSeek V4 Pro | 1M | $0.435 | $0.003625 | $0.87 | Cache-miss input rate shown |

Prices are in USD and were verified on 20 August 2026. The table now contains 88 priced model rows. Rates are standard direct-API or named global rates unless a note says otherwise. Batch, flex, priority, data-residency, regional, long-context, tool-call, search, and image/audio token charges can change the total. AWS Bedrock and Azure prices can also differ by region and endpoint, so check their calculators before you commit to a budget.

Perplexity currently publishes four first-party Sonar models. DeepSeek currently publishes two direct API models. Cohere also lists Command A+ and Command R7B, but it does not publish a comparable self-serve token rate for them, so they are not shown as priced rows.

Official sources: [OpenAI pricing and model catalog](https://developers.openai.com/api/docs/pricing), [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing), [Google Vertex AI pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing), [xAI pricing](https://docs.x.ai/developers/pricing), [Mistral API pricing](https://mistral.ai/pricing/api/), [Cohere pricing](https://cohere.com/pricing), [Perplexity pricing](https://docs.perplexity.ai/docs/getting-started/pricing), [Groq models](https://console.groq.com/docs/models), [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing/), and [AWS Bedrock pricing](https://aws.amazon.com/bedrock/pricing/).

1. For a mixed chat workload, calculate input and output separately. The earlier 25% input / 75% output session split remains a useful rough estimate.

2. A session of 125 tokens is only a planning unit. System prompts, retrieved context, reasoning tokens, cached prompts, and tool results can make real requests much larger.`

article = article.replace(
  /\| Provider \| Model \| Context \|(?: Type \|)? Price \/ 1M[^\n]*\n[\s\S]*?(?=\n### B\. Embedding Costs)/,
  `${chatTable}\n`,
)

const embeddingTable = `| Provider | Model | Price per 1M input tokens | 10,000 pages | 100,000 pages | 1,000,000 pages |
| --- | --- | ---: | ---: | ---: | ---: |
| OpenAI | text-embedding-3-small | $0.02 | $0.13 | $1.25 | $12.50 |
| OpenAI | text-embedding-3-large | $0.13 | $0.81 | $8.13 | $81.25 |
| Google Vertex AI | Gemini Embedding | $0.15 | $0.94 | $9.38 | $93.75 |
| Google Vertex AI | Gemini Embedding 2, text input | $0.20 | $1.25 | $12.50 | $125.00 |
| Mistral | Mistral Embed | $0.10 | $0.63 | $6.25 | $62.50 |
| Mistral | Codestral Embed | $0.15 | $0.94 | $9.38 | $93.75 |
| Perplexity | pplx-embed-v1-0.6b | $0.004 | $0.03 | $0.25 | $2.50 |
| Perplexity | pplx-embed-v1-4b | $0.03 | $0.19 | $1.88 | $18.75 |
| Perplexity | pplx-embed-context-v1-0.6b | $0.008 | $0.05 | $0.50 | $5.00 |
| Perplexity | pplx-embed-context-v1-4b | $0.05 | $0.31 | $3.13 | $31.25 |

1. This estimate uses 625 tokens per page, as defined above. It covers embedding API use only.

2. Vector database, storage, retrieval, reranking, network, and re-embedding costs are not included.

3. Google lists separate prices for image, video, and audio inputs to its multimodal embedding model.`

article = article.replace(
  /\| Provider \| Model \| Price per 1M Tokens \(Input\) \| 10,000 pages \| 100,000 pages \| 1,00,000 pages \|[\s\S]*?3\\\. Costs for hosting \/ licensing of vector databases are not included/,
  embeddingTable,
)

const fineTuningTable = `| Provider | Model or service | Training price | Inference price | Current status / note |
| --- | --- | ---: | ---: | --- |
| OpenAI | o4-mini-2025-04-16 reinforcement fine-tuning | $100 per training hour | $4 input / $16 output per 1M tokens | OpenAI is winding down its fine-tuning platform; it is closed to new users |
| Google Vertex AI | Gemini 3.5 Flash supervised or reinforcement tuning | $10 per 1M training tokens | $2.25 input / $13.50 output per 1M tokens | Tuned inference is 1.5× the $1.50 / $9 base price |
| Google Vertex AI | Gemini 3.1 Flash-Lite supervised tuning | $3 per 1M training tokens | $0.375 input / $2.25 output per 1M tokens | Tuned inference is 1.5× the $0.25 / $1.50 base price |
| Mistral | Classifier API model 3B | $1 per 1M training tokens; $4 minimum | $0.10 input / $0.10 output per 1M tokens | $2 monthly storage per model also applies |
| Anthropic | Custom models | Contact sales | Contact sales | No public self-serve fine-tuning rate |
| Cohere | Custom models | Contact sales | Contact sales | Enterprise customization uses custom pricing |

Training cost is not the full cost of a tuned model. Add dataset preparation, evaluation, repeated experiments, model storage, and production inference. Check the provider page again before you start a training job.`

article = article.replace(
  /\| Provider \| Model \| Type \| Price per 1M Tokens \(Input\) \| Price per 1M Tokens \(Usage\) \| Fine-tuning on 100,000 tokens \(~5000 prompt-completion pairs\) \| 10,000 sessions \/month \| 1,00,000 sessions \/ month \|[\s\S]*?\| Google Vertex AI \| Gemini 1\.5 Pro \| Fine-tuning \| Opaque \| Opaque \| Opaque \| Opaque \| Opaque \|/,
  fineTuningTable,
)

article = article.replace(
  /How much would it cost us to fine-tune a model and then use this fine-tuned model within our app\?[\s\S]*?makes a clear comparison impossible\./,
  'Fine-tuning prices are now harder to compare directly. Some providers use training-token prices, some use training hours, and others provide custom enterprise quotes. OpenAI is also winding down access to its fine-tuning platform. Use the table below as a planning reference, not as a complete project quote.',
)

const scenario = `### Pricing scenario: a current monthly chat estimate

For a simple comparison, assume 100,000 sessions per month and 125 tokens per session. With the earlier 25% input / 75% output split, that is 3.125 million input tokens and 9.375 million output tokens per month.

| Model | Approximate monthly model cost |
| --- | ---: |
| OpenAI GPT-5.6 Luna | $11.88 |
| Google Gemini 3.7 Flash, introductory rate | $37.50 |
| Anthropic Claude Sonnet 5, August 2026 promotional rate | $100.00 |

These figures do not include system prompts, retrieved documents, reasoning tokens, tool calls, search fees, caching, or application infrastructure. In a retrieval-augmented generation system, embedding 100,000 pages once would add about $1.25 with OpenAI text-embedding-3-small or $9.38 with Google Gemini Embedding, before vector database costs.

Fine-tuning and retrieval are not interchangeable. Retrieval is usually the better fit when facts change often or citations matter. Fine-tuning is usually a better fit when you need repeatable behavior, style, or task-specific patterns. Many production systems use both.`

article = article.replace(
  /### Pricing scenario:[\s\S]*?(?=\n###\s*\n|\nDid you enjoy this article\?)/,
  `${scenario}\n`,
)

fs.writeFileSync(articlePath, article)
console.log(`Updated ${path.relative(process.cwd(), articlePath)}`)
