---
title: "Exploring LLM Latencies while building your AI app"
description: "Compare the latency for different LLM models before building your AI application"
date: "2023-12-11"
updated: "2025-11-24"
author: "Dhiraj Nambiar"
slug: "a-comparison-of-llm-model-latencies"
tags:
  - "LLM Engineering"
heroImage: "/blog/a-comparison-of-llm-model-latencies/031d94_700953a1b7154c4f8c80a08af7787f66_mv2.png"
comments: true
---
While building AI applications, we've seen a lot of teams default to *only* making use of one model for all their use cases - while this strategy is great if you're prototyping an application, it's not optimal when you're considering deploying to production. Should you really take a "one model fits all" approach? We think that there are a few things to consider:

Your use case What is your use case? If you're considering complex reasoning tasks, you would want to go with a top of the line model like GPT-4, but if its text completion and even a lot of code generation tasks, you can go with the lighter, faster, cheaper models with minimum loss of quality.

How much will it cost? How expensive is it to develop your application? If you use the best available LLM model for all of your requirements, you might end up making a hole in your pocket! We've created [an article](https://www.newtuple.com/post/the-ultimate-pricing-cheat-sheet-for-large-language-models) to help you understand the costs you will incur in developing your AI app with the different models available today.

How time sensitive is your application? AI apps are bound by the same UX considerations of all other apps. Some applications are most definitely going to be more time sensitive than others.

In this article we delve a bit deeper into the specific topic of model latencies in LLMs, and some advice on when it's time to consider a faster model

## Why is Model Latency Important?

Let's consider two different use cases to illustrate this point better:

![Racing against the clock - how quick is your AI application?](/blog/a-comparison-of-llm-model-latencies/11062b_d206213126364197820ea9e4e2a0e894_mv2.jpg)

> Use case 1: You're building an AI application that needs to create dynamic plans and conduct complex data analysis in response to a user's question.

> Use case 2: You're building a customer facing chatbot to triage, report and if possible solve customer complaints

For use case 1, (with exceptions), your user is likely to have a bit of tolerance for latency. In an AI app like this, it's possible to explain to your user base that some of these requests do take time. Additionally, the reasoning, code generation and data analysis capabilities are probably better solved by a larger, more complex model.

For use case 2, however, model latencies can make or break your user experience, and eventually lead to churned customers. With all other factors considered, a *faster* chatbot will likely be better than a *slower* one. In addition, the "text completion" capabilities for a chatbot are quite well served with smaller, lighter models.

## LLM Latencies:

With all of this being said - let's get to the core part of this article. Here's a comparison of different models and their latencies:

| Model Name | Model | Provider | Latency in seconds |
| --- | --- | --- | --- |
| gpt-4-1106-preview | GPT 4 Turbo | OpenAI | 26.51 |
| gpt-3.5-turbo | GPT 3.5 Turbo | OpenAI | 8.07 |
| text-bison@001 | Google Vertex text bison | Google Vertex AI | 5.35 |
| meta.llama2-13b-chat-v1 | llama-13B | AWS Bedrock | 3.48 |
| meta.llama2-70b-chat-v1 | llama-70B | AWS Bedrock | 7.82 |
| ai21.j2-mid-v1 | Jurassic-2 | AWS Bedrock | 2.04 |
| cohere.command-text-v14 | Cohere-command | AWS Bedrock | 10.49 |

We observe these numbers consistently across different times of day. The general observations are:

1.  The gpt-4-turbo model often takes ~30 seconds or more for a response, gpt 3.5 shows reasonably faster latencies.

2.  Google's Vertex models are extremely fast and show great response times at almost any time of the day. If Google is able to replicate this performance on Gemini, it will be a positive differntiator vs gpt-4 for sure.

3.  All of the models we tested that are hosted by AWS Bedrock show a consistent response range of 3-11 seconds.

Prompt: We provided a single prompt of approximately 400 tokens to all models for this test, and asked the models to summarize it with some custom instructions. The models behave differently for larger prompts and typically will take slightly longer as the prompt size increases.

We've been building quite a few LLM based AI apps for different kinds of use cases, and benchmarking different models in terms of output quality, latencies and costs are all factors we actively consider with our clients. [Click here](https://www.newtuple.com/contactus) if you're building something cool and need our help, we'd love to have a chat!

What has your experience been with LLM latencies? Write in the comments below and let us know!
