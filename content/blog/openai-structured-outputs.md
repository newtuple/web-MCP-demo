---
title: "How OpenAI implements Structured Outputs"
description: "Read this article to understand the technical details around structured outputs from OpenAI"
date: "2024-08-12"
updated: "2025-11-24"
author: "Sameer Kankute"
slug: "openai-structured-outputs"
tags:
  - "LLM Engineering"
heroImage: "/blog/openai-structured-outputs/70591a_f4ab85934fa74050b8885c01e3f4c747_mv2.png"
comments: true
---
​

![Structured Output](/blog/openai-structured-outputs/70591a_3863ca3dc27642a4b361d1ea0576ecad_mv2.png)

Structured Output

OpenAI has introduced a new feature in their API that allows developers to enforce specific JSON schemas for model responses.This includes a 'strict' mode for function calling and a new 'response\_format' parameter.

Generating structured data from unstructured input is one of the a key use of AI in today's application. Developers often use the OpenAI API to build powerful tools that can fetch data, answer questions through function calls, organize data for entry, and build complex multi-step agentic workflows that allow LLMs to take actions. Previously, developers faced challenges due to the basic limitations of language models. They would use various open source tools, craft careful prompts, and frequently resend requests to make sure the outputs from the models matched the needed formats for their systems to work well together. Structured Outputs tackles these issues by forcing OpenAI models to stick to the formats developers provide and by training our models to better understand and handle complex formats.

The way they have achieved this is very interesting, read on for the implementation and in-depth explanation of their approach.

## Implementation

Developers can now easily integrate schemas by using Pydantic or Zod objects. These SDKs automatically convert the specified data types into compatible JSON schemas, deserialize JSON responses into structured data formats, and handle any refusals seamlessly.

```python
from pydantic import BaseModel

from openai import OpenAI

class Step(BaseModel):
    explanation: str
    output: str

class MathResponse(BaseModel):
    steps: list[Step]
    final_answer: str

client = OpenAI()

completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "system", "content": "You are a helpful math tutor."},
        {"role": "user", "content": "solve 8x + 31 = 2"},
    ],
    response_format=MathResponse,
)

message = completion.choices[0].message
if message.parsed:
    print(message.parsed.steps)
    print(message.parsed.final_answer)
else:
    print(message.refusal)
```

[View the original GitHub Gist](https://gist.github.com/sameer20002/ff79e620a2aa38a8e573bdb38f89a380)

This is the response:

```python
[Step(explanation='Start with the original equation: \\(8x + 31 = 2\\). The goal is to solve for \\(x\\).', output='8x + 31 = 2'), Step(explanation='First, subtract 31 from both sides of the equation to isolate the term with \\(x\\) on one side. This gives us \\(8x = 2 - 31\\).', output='8x = 2 - 31'), Step(explanation='Calculate \\(2 - 31\\) to simplify the right side of the equation. This results in \\(8x = -29\\).', output='8x = -29'), Step(explanation='Now, divide both sides of the equation by 8 to solve for \\(x\\). This gives \\(x = \\frac{-29}{8}\\).', output='x = \\frac{-29}{8}')]
x = \frac{-29}{8}
```

[View the original GitHub Gist](https://gist.github.com/sameer20002/50cbc9ee3b05d2bc51cd5f54b885cc4f)

## How does this work?

OpenAI used a two part approach for this. They initially trained their latest model, gpt-4o-2024-08-06, to accurately understand and generate outputs based on complex schemas. Despite reaching a 93% benchmark score, the model wasn’t reliable enough for robust applications. Thus, they adopted a deterministic engineering approach called **Constraint Decoding** to tighten output restrictions, achieving 100% reliability.

#### Constraint Decoding

Building on the approach of structured outputs, OpenAI has developed a technique known as constrained decoding to further enhance the reliability and accuracy of AI-generated content. This method ensures that the outputs from their models are not only structured but also conform precisely to the provided JSON schemas. Typically, when models generate text, they have the freedom to choose any token from their vocabulary, which can lead to errors, such as producing invalid JSON formats. Constrained decoding restricts the model’s choices to only those tokens that fit within the specified schema.

Implementing this constraint involves dynamically updating the permissible tokens as the model generates each piece of the output. For example, with a JSON schema that begins with an object, permissible tokens might start with '{'. Once the model begins forming a property like "value":, the next valid token cannot be another '{'. This selective token generation process requires converting the JSON schema into a context-free grammar (CFG).

A Context-Free Grammar (CFG) is a type of grammar that is used to define the rules of a language in a structured way. It consists of a set of production rules that describe how symbols of the language can be combined to form valid strings. In the context of JSON Schema, CFG is utilized to specify and enforce the syntactic rules that the JSON data must follow to be considered valid. This is similar to how grammatical rules in a language determine the proper structure of sentences. For instance, just as a sentence in English typically requires a verb to be complete, a JSON object must follow specific syntax rules, such as not ending with a trailing comma, to be syntactically correct according to the defined CFG rules.

Each JSON schema is pre-processed into a CFG before any requests are processed, which initially incurs a latency penalty. However, this preparation allows the model to efficiently and accurately produce valid outputs by consulting the pre-processed rules, significantly reducing the chance of errors. This approach ensures that every token generated aligns perfectly with the structured requirements, providing developers with highly reliable and schema-consistent outputs from the model.

Because of this new approach, the initial API response involving a new schema may experience added latency. However, subsequent responses will be quick with no latency penalty, as they cache the processed schema after the first request for quicker access in future interactions. Typically, processing a standard schema takes less than 10 seconds on its first run, while more intricate schemas could require up to a minute.

Structured Outputs with response formats is available on gpt-4o-mini and gpt-4o-2024-08-06 and any fine tunes based on these models. But Structured Outputs with function calling is available on all models that support function calling in the API.

## Conclusion

The introduction of Structured Outputs in OpenAI’s API marks a significant step forward in the use of AI to generate reliable and schema-compliant data. By integrating strict JSON schema enforcement through both function calling and new response formats, developers are equipped to create more robust and error-resistant applications. This enhancement addresses long-standing challenges associated with language model outputs, allowing for a more seamless and efficient development process.

References:
[https://openai.com/index/introducing-structured-outputs-in-the-api/](https://openai.com/index/introducing-structured-outputs-in-the-api/?utm_source=ainews&amp;utm_medium=email&amp;utm_campaign=ainews-not-much-happened-today-4029)
