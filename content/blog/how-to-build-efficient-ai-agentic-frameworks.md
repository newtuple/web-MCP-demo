---
title: "How to Build Efficient AI Agentic Frameworks"
description: "Discover how Newtuple Technologies is revolutionizing the use of AI agents with targeted, enterprise applications. Learn about our design principles that harness the power of large language models to perform complex tasks with high accuracy, scalability, and cost-effectiveness"
date: "2024-04-28"
updated: "2024-04-28"
author: "Aniket Kulkarni"
slug: "how-to-build-efficient-ai-agentic-frameworks"
tags:
  - "AI Agents"
heroImage: "/blog/how-to-build-efficient-ai-agentic-frameworks/140e3d_bd6541cc18bc4a24983f5af93809409a_mv2.jpeg"
comments: true
---
This article talks about tactical advice into building AI agents that solve real world use cases

**AI Agents**

*This post is about creating efficient agentic workflow that can solve real world problems and deliver value to the user. If you are new to the topic of AI agents, I would suggest to get acquainted with the topic, and maybe try some of the existing agents hands-on first. If you are an AI enthusiast with some experience to agents, read on…*

AI has evolved far beyond its initial role as a mere question-answering resource. AI agents (or simply agents), powered by large language models (LLMs), have made significant stride in general task mining, elaborate planning and execution (read more about it [here](https://www.cognition-labs.com/introducing-devin) and [here](https://arxiv.org/abs/2305.16291)).

![An example agent in action. Image from AutoGen (https://microsoft.github.io/autogen)](/blog/how-to-build-efficient-ai-agentic-frameworks/140e3d_d87e49fc5995456fb41e01ffa89497cb_mv2.png)

An example agent in action. Image from AutoGen (https://microsoft.github.io/autogen)

Why are agents so useful? Short answer:

> We elevate LLMs by empowering them to DO, not just THINK and churn tokens.

Having said that, they have some fundamental issues. There is enough chatter on internet about how agents get stuck in a loop while executing a task or how their behaviour changes significantly with slight changes in inputs etc.

**We, at** [**Newtuple**](https://www.newtuple.com/) **Technologies have developed and deployed agents for a bunch of different applications. For instance, take our chatbot - it helps tackle the data consumption problem for an enterprise. This is where our agent shines, as it takes user question in plain English, seamlessly link multiple API calls and a data analysis workflow to deliver the answer. At its heart, it calls multiple APIs, write aggregation and transformation queries, generates persona based insights, summarise results and even generate plots.** 

What worked for us so far is the following:

1.  **Begin with a Focused Scope**: Defining Initial Tasks for Agents and Gradually Expanding Capabilities

2.  **Choosing the right LLM** - Choose the right LLM for the right task

3.  **Modular Agent Workflow** - Make the sub-agents to exchange structured data

4.  **Constrain the agents** - Constrain agents enough so that they have a set execution plan at every step

5.  **Evaluate sub-agents** - Use benchmarking tools to evaluate each part of the agents framework

Let us spend some time and delve in detail into each of these points.

### Begin with a Focused Scope

There are a lot of general-purpose agents out there like AutoGPT and AutoGen that can handle a wide range of tasks but only with mediocre accuracy. A better approach would be to create an agent that excels in tasks within a specific domain, achieving human-like accuracy more quickly. For instance, imagine an agent tailored just for the financial sector. It wouldn't be suitable for content writing or software development, but it could expertly handle finance-related queries. This agent would be able to develop step-by-step plans for typical questions, search through existing databases, call designated APIs, manage data aggregation and transformation, and deliver responses in a technical language that fits a financial persona. However, its skills would be limited to finance-related information.

Such a specialised agent would be more effective and useful than a general-purpose one.

### Choosing the right LLM

There are many leaderboards and metrics out there to compare different LLMs. Which one should you use for agentic workflows?

Imagine an agentic workflow as being made up of several smaller modular agents, which I'll explain more about later. Depending on the task, you need to pick the right AI model.

For instance, you might use a costly and slow model for planning tasks, but opt for several smaller, more affordable LLMs for generating code. These can correct errors from earlier outputs in subsequent iterations.

On a related note, it's generally better to let subagents refine their thinking over multiple steps rather than settling for a single, initial output (zero-shot prompting). Andrew Ng uses a great example to explain this when he [talks](https://www.youtube.com/watch?v=sal78ACtGTc) about writing an essay. You wouldn't write the perfect final draft in one go. Instead, you'd start with a basic outline, noting down the main ideas you want to talk about. Each time you revisit your draft, you add a little more detail, maybe do some online research, or read up on the topic to make your points stronger. This incremental improvement is what subagents aim to achieve by utilizing smaller, cost-effective LLMs multiple times, refining their work progressively, much like refining an essay draft until it's just right.

### Modular AI Agent Workflow

> TL;DR: It's essential to design your agentic workflow so that the sub-agents can share data in a structured format like JSON, which naturally makes the workflow modular.

A key aspect of a robust agent workflow is its modularity. A well-designed agent allows for customization by swapping out one or more of its modules, enhancing its accuracy and usefulness. Take, for example, a hypothetical scenario of a book recommender: an agent that sifts through natural language content (like questions or articles) to recommend books and add them to your Google Books library. If a human were to perform this, they'd typically follow these steps: decipher the main theme, search on Goodreads for suitable books, read reviews to narrow down the selection to five books, and then add these chosen books to a Google Books shelf.

Similarly, an agent would also need to create a plan which contains tasks or steps. To create this plan, it would rely on LLM. For the above use case, a sample plan can be:

1.  Analyse content and extract search keywords/phrases

2.  API call to Goodreads against these keywords

3.  Aggregate results based on ratings and reviews

4.  Summarisation and filtering top 5 books

5.  API call to google books to add these books to shelf

You can build tools or subagents for tasks like API execution, data aggregation and summarisation. These individual subagents must be built modular so that, you can swap them in and out based on their performance, accuracy and speed.

The most crucial design principle in building this type of agentic workflow is to ensure the subagents exchange data in a structured formats like JSON.

This approach allows you to:

1.  Execute on the plan asynchronously, which reduces latency in output

2.  Evaluate the subagents individually on various tasks. By evaluating them separately, you can tune them better, thereby increasing the overall accuracy of the agent

### Constrain the agents

In the last section, I covered the overall structure of agents. Now, let's dive into the individual subagents.

Each subagent should be designed with an abstraction that allows it to be reused across various tasks, and its structure should be versatile enough to be applied in different domains by just tweaking a few parameters (like prompts, API specs etc.).

For instance, take the API executor. It should be constructed to handle the OpenAPI specifications for any new endpoint and be capable of calling endpoints from those specifications.

### Evaluate sub-agents

Generally developing an AI system requires an elaborate process of optimization in order to get it to a necessary level of usability. This is because the AI systems are inherently non-deterministic and their behaviour would be unpredictable with out-of-distribution data. This optimization process is an iterative process, starting with a thorough evaluation of the agent.

If your system is complex, it might be more effective to evaluate each component of the workflow separately rather than the whole system at once. If you have followed step 3 and made sub-agents modular, evaluation of individual sub-agents is easy for two reasons: first, the modular design helps with separation of concerns; second, if the sub-agents are designed to produce structured outputs, evaluation becomes simpler.

The evaluation process begins by collecting carefully created prompt-response (input-output) pairs that meet the functional requirements of the system. It's usually best to collect as many examples as possible to cover all potential uses. A good rule of thumb is to create at least 20-50 of these pairs. You should also design specific responses for each sub-agent of the process, which aids in assessing each one on its own.

## TL;DR

When we think about AI agents and how they're built, a couple of things stand out.

1.  The hype around AI agents is real. While the current agentic workflows work fine for small example usecases, they fall short while solving the complex, real-world use cases in the industry

2.  However, there are ways to get around the issues and deliver real value to the users. The value (which is for any AI system IMHO) is that agents can do about 80-90% of what humans can do at a fraction of cost (both time and money). **We, at Newtuple have delivered on this promise!**

3.  To achieve this, you need to design the agents grounds-up, sticking to key principles like modular design, continuous evaluation and iterative optimization

You can read this in my substack [here](https://anikulkar.substack.com/) too!
