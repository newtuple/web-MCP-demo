---
title: "Run Deepseek R1 on your laptop in 5 minutes or less"
description: "Learn how to run Deepseek on your laptop in 5 minutes! Discover the power of Deepseek with easy steps and explore limitless possibilities."
date: "2025-05-22"
updated: "2025-11-28"
author: "Rahul Kumar"
slug: "run-deepseek-r1-on-your-laptop-in-5-minutes-or-less"
tags:
  - "LLM Engineering"
  - "Tutorials"
heroImage: "/blog/run-deepseek-r1-on-your-laptop-in-5-minutes-or-less/034285_257e6814713f4285bea9abf540e011af_mv2.jpg"
comments: true
---
Operating and hosting an LLM model like Deepseek locally allows you to explore and generate ideas using your local machine as a powerhouse, enabling tasks such as reasoning and building agents.

The simplest way to begin is [by using Ollama](/post/how-to-install-and-use-ollama-for-hosting-llm-models-locally), which offers direct access to quantized, distilled versions of models such as Deepseek, Qwen, Mistral, and others. Additionally, OpenWebUI provides a user-friendly interface for working with these LLM models locally.

#### Getting started

1.  [Download](https://ollama.com/download) Ollama for your machine

    ![Install ollama](/blog/run-deepseek-r1-on-your-laptop-in-5-minutes-or-less/034285_daa246298ce54cb8a240833065917949_mv2.png)

    Install Ollama

2.  Install Deepseek R1 using Ollama with command

```
ollama run deepseek-r1
```

3.  You can try ask question right away in your terminal

    Loading video...This may take a few seconds.

    Deepseek R1 in CLI with ollama

4.  Now here is the fun part, download OpenWebUI, preferred is using Docker, once the open web ui container starts running visit [http://localhost:3000/](http://localhost:3000/)

    ![Using openwebui](/blog/run-deepseek-r1-on-your-laptop-in-5-minutes-or-less/034285_7804d0b98e8346d78e730c2f4569af1d_mv2.png)

    OpenWebUI

5.  Sign up with your credentials, select the model which you installed in earlier steps and start asking !

    Loading video...This may take a few seconds.

    Deepseek R1 using OpenWebUI

> Please note that the latency of the model responses depends on machine hardware. Additionally GPUs can also be used to accelerate response generations.

##### References :

*   [Ollama](https://ollama.com/) 

*   [GitHub - open-webui/open-webui: User-friendly AI Interface (Supports Ollama, OpenAI API, ...)](https://github.com/open-webui/open-webui) 

*   [deepseek-v3](https://ollama.com/library/deepseek-v3) 

*   [deepseek-r1](https://ollama.com/library/deepseek-r1)
