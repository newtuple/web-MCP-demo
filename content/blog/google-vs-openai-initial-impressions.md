---
title: "Google vs OpenAI: Initial Impressions"
description: "Google made a bunch of announcements at its recent Google I/O event, including the release of its Vertex AI models for language generation - This is a direct competitor to OpenAI’s API which was released a few months ago, and has already taken the world by storm. I decided to take 2 APIs - OpenAIs “GPT3.5” and Vertex AIs “text-bison@001” for a test drive to compare its results, specifically for a combination of a vector database enabled semantic search + LLM prompt and response. I believe knowle"
date: "2023-05-12"
updated: "2023-11-07"
author: "Dhiraj Nambiar"
slug: "google-vs-openai-initial-impressions"
tags:
  - "LLM Engineering"
heroImage: "/blog/google-vs-openai-initial-impressions/031d94_20927a1e614a4d2dbf55f364fb45118c_mv2.png"
comments: true
---
**Google made a bunch of announcements at its recent** [**Google I/O event**](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-at-io-2023/)**, including the release of its Vertex AI models for language generation - This is a direct competitor to OpenAI’s API which was released a few months ago, and has already taken the world by storm.**

**I decided to take 2 APIs - OpenAIs “GPT3.5” and Vertex AIs “text-bison@001” for a test drive to compare its results, specifically for a combination of a vector database enabled semantic search + LLM prompt and response. I believe knowledge retrieval and summarization is one of the fundamental use cases for large language models, and it will be built on top of a data stack consisting of something like this: Vector Databases + LLM libraries + LLM APIs + Applications**

### **Setup:**

*   **I embedded approximately 1000 pages of documents from the Economic Survey of India 2022-23, the Global Economic Prospects report from the World Bank 2023, and the World Economic Outlook 2022 into a** [**Chroma DB**](https://www.trychroma.com/) **vectorstore.**

*   **Next, I created the backend infrastructure required to call the 2 APIs -** [**langchain**](https://langchain.readthedocs.io/) **for OpenAI, and direct python scripts for Google Vertex AI**

*   **Finally, I created a simple frontend for this application using** [**streamlit**](https://streamlit.io/)**, which compares the query results from the 2 APIs.**

### The results:

**I asked a simple question to my application: What are the economic prospects of different countries of the world?**

![](/blog/google-vs-openai-initial-impressions/031d94_04b037a3a17749c9bfa932623a75119b_mv2.png)

**The vector DB does its job and returns 3 results (as instructed) based on similarity search from the different documents:**

![](/blog/google-vs-openai-initial-impressions/031d94_978a9f0c7e084e83bf1ef017e64ae397_mv2.png)

**OpenAI GPT3.5’s response is quite comprehensive, provides sources and does a great job overall.**

![](/blog/google-vs-openai-initial-impressions/031d94_0184399ebe794dada98c7e49e5d1e9c0_mv2.png)

**Vertex AI’s response is also great, but it's slightly less detailed than the OpenAI response on this one:**

![](/blog/google-vs-openai-initial-impressions/031d94_cd6b6338128a4798bf93d3c3bce06a42_mv2.png)

**The one area where Google is consistently faster (as of now) is its API response time:**

![](/blog/google-vs-openai-initial-impressions/031d94_ba9e1afc327b40bbbd830648c0ef96cb_mv2.png)

**Let’s try again, with a more specific question:**

![](/blog/google-vs-openai-initial-impressions/031d94_110579d7982c435086200742084a2055_mv2.png)

**In this particular question, GPT3.5 really shines - the depth of the response and the detail in its source explanation is great**

![](/blog/google-vs-openai-initial-impressions/031d94_1e11195fc3524da594335d71fe83b2ce_mv2.png)

**On the other hand, Vertex AI tends to quickly summarize the results and doesn't delve into as much detail. The result is still accurate though**

![](/blog/google-vs-openai-initial-impressions/031d94_c6b9b60d077a4ee78ef0f975d3fe6936_mv2.png)

### First conclusions: Advantage OpenAI (but only slightly)

**It looks like text-bison@001 has got off to a great start, but it's slightly behind GPT3.5 in language generation for this particular use case. I can only guess for the moment, but some of the reasons could be:**

*   **It isn’t as comprehensively trained as GPT3.5 - remember, OpenAI has also had 6 months of extensive user data + approximately 1.5 years since the API has been live. That’s quite a bit of a head start**

*   **The Google API also has a smaller token output at the moment (1024 tokens vs 4096 for GPT3.5) which might be causing it to shorten its outputs**

**On the flip side, Google has a distinct edge when it comes to speed of response compared to GPT 3.5 - but how long this will last is anybody’s guess.**

**Finally, it’s worth noting that I’ve not even tested the GPT-4 8k or 32k API against Vertex. We all know that GPT-4 is a full generation ahead of GPT3.5 in terms of capabilities and will provide much superior results compared to GPT3.5. The text-bison@001 isn’t even in the race**

**The next few months will be very interesting to see - especially on how Google tries to play catch up on its models and how this shapes up.**

**Hope you enjoyed this read.**
