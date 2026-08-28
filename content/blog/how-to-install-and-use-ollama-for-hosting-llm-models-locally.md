---
title: "Host LLMs Locally: Ollama Installation & Setup Guide"
description: "Step-by-step Ollama install to host large-language models on your machine. Get up and running in minutes with examples."
date: "2025-05-22"
updated: "2025-11-28"
author: "Shikhar Jha"
slug: "how-to-install-and-use-ollama-for-hosting-llm-models-locally"
tags:
  - "LLM Engineering"
  - "Tutorials"
heroImage: "/blog/how-to-install-and-use-ollama-for-hosting-llm-models-locally/7c7d23_de91fc0e3fd242fc8309486acdf78b7e_mv2.png"
comments: true
---
Open source Large Language models are increasingly becoming viable alternatives to the closed source models that are available today. The first step towards understanding whether a model is a fit for your use case is to quickly get it up and running on your laptop or your machine. This article goes into a 5 minute setup guide for Ollama.

Ollama has made it easiest by far by providing a simple lightweight, extensible framework for building and running language models on the local machine. It provides a simple API for creating, running, and managing models, as well as a library of pre-built models that can be easily used in a variety of applications.

With ollama you can run Llama 3.3, DeepSeek-R1, Qwen 3, Mistral, Gemma 3, and other models, locally.

1.  Steps to install ollama in your machine:

Whether you are using mac , linux or windows operating system ollama supports all .

> The below steps shown are done in macOS , but similar approach can be used in other operating system.

Visit [https://ollama.com/](https://ollama.com/).

![ollama website ](/blog/how-to-install-and-use-ollama-for-hosting-llm-models-locally/7c7d23_545c0132da724676b22990b0200e5d71_mv2.png)

*   Click on the download button a zip file ollama-darwin.zip will be download shortly.

*   Go to the downloads folder (or where the zip file is saved) , unzip the file you will see the ollama application extracted.

*   Go ahead and move it to Applications

After successfully moving the ollama application to Application click on ollama. You will be prompted to install ollama.

![After download is complete!](/blog/how-to-install-and-use-ollama-for-hosting-llm-models-locally/7c7d23_d013d255e06f4c3fa9cd4f0253e1c586_mv2.png)

*   Make sure you have admin rights to you system as you will be prompted to validation that you are admin .

After the above steps are successful, you can now run any open source model in your machine.

![How to run a model !](/blog/how-to-install-and-use-ollama-for-hosting-llm-models-locally/7c7d23_b34d498d66cf4c3a9126a0d9891a395d_mv2.png)

**Lets try it out!!**

*   Open a terminal and type.

```
ollama run <model name>
```

After successful run (might defer based on model):

![Downloading Qwen3!!](/blog/how-to-install-and-use-ollama-for-hosting-llm-models-locally/7c7d23_3a4b3ab3046042d7b653af235682950e_mv2.png)

Congratulations !! you have an AI running in your machine!

Example:

![Running Qwen3!](/blog/how-to-install-and-use-ollama-for-hosting-llm-models-locally/7c7d23_cb7574bd50bd4c5cbe3246b84d83186e_mv2.png)

> Tip !

```
\# use below command to exit
/bye
```

References:

Github : [https://github.com/ollama/ollama](https://github.com/ollama/ollama)

Ollama : [https://ollama.com/](https://ollama.com/)
