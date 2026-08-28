---
title: "Beyond Plain Text: Mastering OpenAI LLM Output for Specific Needs"
description: "Controlling OpenAI LLMs output to get desired results"
date: "2024-03-08"
updated: "2025-11-24"
author: "Aniket Kulkarni"
slug: "beyond-plain-text-mastering-openai-llm-output-for-specific-needs"
tags:
  - "LLM Engineering"
heroImage: "/blog/beyond-plain-text-mastering-openai-llm-output-for-specific-needs/140e3d_69954cea22f24512a4a4fe686c28bae4_mv2.webp"
comments: true
---
### A guide to enforcing or excluding words for better control for OpenAI LLMs output

Large Language Models (LLMs) are remarkably adept at generating human-quality text, but there are times when you need more nuanced control over their output. This could be ensuring technical accuracy, adhering to brand guidelines, or filtering out undesirable content. OpenAI's API offers a powerful tool to fine-tune OpenAI LLMs' vocabulary: the logit\_bias argument (read more about it [here](https://platform.openai.com/docs/api-reference/chat/create#chat-create-logit_bias)).

**The Vocabulary of LLMs: Logits**

Before diving into logit\_bias, let's understand how LLMs make word choices. During text generation, the model assigns unnormalized scores called logits to each potential word. These logits reflect the model's internal assessment of a word's suitability within the given context. Words with higher logits are more likely to be selected.

**How logit\_bias Manipulates Word Selection**

The logit\_bias argument accepts a dictionary as its input. The keys of this dictionary are token IDs, the unique identifiers your LLM assigns to each word or word fragment. The values within the dictionary are numerical adjustments – the biases – applied to the corresponding token's logit.

*   **Positive Bias:** A positive bias value increases the logit of a word, making the LLM more likely to include it in the generated text.

*   **Negative Bias:** A negative bias decreases a word's logit, reducing its chance of being selected.

**Practical Applications of logit\_bias**

Let's look at some use cases where this technique proves invaluable:

*   **Domain-Specific Language:** For technical writing (e.g., medical documentation or legal summaries), you can positively bias industry jargon to ensure your LLM uses the correct terminology.

*   **Content Filtering:** If you wish to prevent profanity or other undesirable words, assign strong negative biases to discourage the LLM from including them in the output.

*   **Stylistic Control:** Guide your LLM towards formal or informal language by biasing words and phrases that fall into the desired style and tone.

**Putting logit\_bias into Practice: A Step-by-Step Guide**

*   **Obtain Token IDs:** Before applying logit\_bias, you'll need the token IDs of the words you want to influence. OpenAI's tokenizer tool can help:

    *   **Option 1 - OpenAI Tokenizer website :** Visit: [https://beta.openai.com/tokenizer](https://beta.openai.com/tokenizer) and paste the words or phrases of interest. The tokenizer will output corresponding token IDs

    *   **Option 2 - in python script :** Use the following function to get the token IDs (use pip install tiktoken to install)

```python
import tiktoken

encoding = tiktoken.get_encoding("cl100k_base")

# To get the tokeniser corresponding to a specific model in the OpenAI API:
enc = tiktoken.encoding_for_model("gpt-4")

def get_token_ids(input_string: str) -> list[int]:
    """
    Encodes a given word into token IDs
    """
    ids = enc.encode(input_string)
    return ids
```

[View the original GitHub Gist](https://gist.github.com/ani-kulkar/60116a02a1a0e71e4dbc188739be72e5)

*   **Construct Your logit\_bias Dictionary**: Create a Python dictionary where keys are token IDs and values are your desired biases. For example:

```
logit_bias={
    12345: 5.0, # Increase the likelihood of generating tokens related to 'technology'
    54321: -1.0 # Decrease the likelihood of generating tokens related to 'movies'
}
```

[View the original GitHub Gist](https://gist.github.com/ani-kulkar/6a95a7cb4c4c9b4238cda66de054e3ad)

*   **Integrate logit_bias** in Your Completion API Call: Here's a basic example using the OpenAI Python library:

```python
import openai
client = OpenAI(api_key="YOUR_OPENAI_API_KEY")
completion = client.chat.completions.create(
    model="gpt-4-turbo-preview",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Tell me something interesting about the future of tech."},
    ],
    logit_bias=logit_bias
    )

print(completion.choices[0].message.content)
```

[View the original GitHub Gist](https://gist.github.com/ani-kulkar/2f8372fb57998dfcbec6ef285b325ae3)

Important Notes:

*   **API Key:** Replace "YOUR\_OPENAI\_API\_KEY" with your actual OpenAI API key.

*   **Model Choice:** The model parameter specifies the LLM you want to use.

*   **Bias Values:** Experiment with different values to fine-tune the effect on your output.

**Considerations and Best Practices**

*   **Context is Key:** logit\_bias influences the LLM's word choice but does not override it completely. The overall context of your prompt still plays a significant role.

*   **Finding Token IDs:** Tools like OpenAI's tokenizer ([https://beta.openai.com/tokenizer](https://beta.openai.com/tokenizer)) can help you easily find the token IDs you need.

*   **Experimentation:** Start with small bias values and gradually adjust them. Observe how your LLM's output changes as you experiment.

The logit\_bias argument, combined with the ability to easily determine token IDs, unlocks a new level of control over your LLM-generated text. Whether it's ensuring technical accuracy, adhering to specific guidelines, or simply refining the style, OpenAI provides the tools to shape your language model's output to meet your exact needs.
Want to stay updated on Generative AI? Subscribe to my Substack [newsletter](https://anikulkar.substack.com/) for insights and updates.
