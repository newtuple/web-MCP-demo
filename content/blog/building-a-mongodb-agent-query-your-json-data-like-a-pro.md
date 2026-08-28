---
title: "Building a MongoDB Agent - Query Your JSON Data Like a Pro"
description: "Unleash the power of MongoDB Agent JSON to effortlessly query complex data. From schema auto-discovery to powerful summaries, it's a game-changer!"
date: "2024-05-19"
updated: "2024-05-19"
author: "Aniket Kulkarni"
slug: "building-a-mongodb-agent-query-your-json-data-like-a-pro"
tags:
  - "AI Agents"
  - "Tutorials"
heroImage: "/blog/building-a-mongodb-agent-query-your-json-data-like-a-pro/140e3d_e057bc7e9b9747c9a3721df1655c09c1_mv2.jpeg"
comments: true
---
Working with unstructured or nested JSON data can be a headache. You often end up flattening it into tables, losing valuable relationships, or wrestling with complex preprocessing just to get it into a format your analysis tools can handle. Enter the **MongoDB agent**, your new best friend for querying JSON directly in its native habitat.

#### What is a MongoDB Agent?

At its core, a MongoDB agent is a system that understands your natural language questions and translates them into the powerful MongoDB Aggregation Pipeline language. This pipeline is then executed directly against your MongoDB collection, extracting precisely the information you need. The agent then summarizes the results, presenting them in an easy-to-digest format.

Think of it like this:

*   **You:** Ask a question about your data in plain English.

*   **MongoDB Agent:** "Aha, I know just the aggregation steps to get that!"

*   **MongoDB:** Processes the query, returning the relevant data.

*   **MongoDB Agent:** "Here's a summary of what I found."

#### Why MongoDB Agents?

1.  **Preserve Structure:** You don't need to flatten your JSON data, keeping nested relationships intact for richer analysis.

2.  **Query Flexibility:** The aggregation pipeline is incredibly versatile, capable of filtering, grouping, sorting, and transforming your data in countless ways.

3.  **No Preprocessing:** Ask your questions directly; the agent handles the query generation.

4.  **Powerful Summaries:** GPT-4 based summaries provide clear, concise answers to your questions.

#### Building Your Own Agent

Let's dive into the code and see how to set up a MongoDB agent that can handle user queries.

##### Data at hand

For this example, I have used the quotes dataset available in [Kaggle](https://www.kaggle.com/datasets/akmittal/quotes-dataset). Here are some sample data available:

```
{
  "Quote": "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
  "Author": "Albert Einstein",
  "Tags": \[
    "attributed-no-source",
    "human-nature",
    "humor",
    "infinity",
    "philosophy",
    "science",
    "stupidity",
    "universe "
  \],
  "Popularity": 0.10312710312710313,
  "Category": "humor"
}
```

This data looks simple enough to process and even flatten it and build agents using structured data. But often the API responses can be way more complex. Consider the following example (data obtained from [Synthea Dataset](https://www.kaggle.com/datasets/krsna540/synthea-dataset-jsons-ehr))

```
{
  "fullUrl": "urn:uuid:a05ac013-76fa-4038-a6de-a7dd6977d7f1",
  "resource": {
    "id": "a05ac013-76fa-4038-a6de-a7dd6977d7f1",
    "status": "final",
    "code": {
      "coding": \[
        {
          "system": "http://loinc.org",
          "code": "69409-1",
          "display": "U.S. standard certificate of death - 2003 revision"
        }
      \]
    },
    "subject": {
      "reference": "urn:uuid:0579fe6e-db6f-4198-a706-19daacdfbc26"
    },
    "encounter": {
      "reference": "urn:uuid:7d93a934-13d1-4413-ac70-1246820e428e"
    },
    "effectiveDateTime": "2008-05-14T12:58:05+00:00",
    "issued": "2008-05-14T12:58:05+00:00",
    "performer": \[
      {
        "display": "Hospital Lab"
      }
    \],
    "result": \[
      {
        "reference": "urn:uuid:74829320-9c25-446a-af29-4f74420b93bc",
        "display": "Cause of Death \[US Standard Certificate of Death\]"
      }
    \],
    "resourceType": "DiagnosticReport"
  }
}
```

Imagine flattening this and building a consistent data model. It would be a nightmare, especially given the fact that the schema is flexible, which results in a sparse dataframe.

###### Prerequisites

Before we start, make sure you have the following installed:

*   Python

*   MongoDB

*   OpenAI API Key

###### Code Overview

###### Environment Setup

First, load your environment variables and initialize the OpenAI client:

```
import openai
import json
import pandas as pd
from dotenv import load\_dotenv
from pymongo import MongoClient
# Load environment variables
load\_dotenv('./.env')
# Initialize OpenAI client
client = openai.Client()
```

###### Handling User Queries

Handling user messages and generating aggregation pipelines:

```
def get\_aggregated\_results(message):
    """
    Retrieves aggregated results from MongoDB based on the user's query.
    """
    # Use OpenAI to generate the aggregation pipeline
    completion = client.chat.completions.create(
        model="MODEL\_NAME",
        messages=\[
            {"role": "system", "content": "SYSTEM MESSAGE"},
            {"role": "user", "content": "USER QUESTION"}
        \],
        temperature=0,
        response\_format={ "type": "json\_object" }
    )

    response = completion.choices\[0\].message.content
    # Perform aggregation on MongoDB
    response\_cursor = perform\_aggregation(mongodb\_client, response)
    # Collect the results
    filtered\_response = \[doc for doc in response\_cursor\]
    return filtered\_response
def main():
    msg = get\_aggregated\_results(message.content)
    return summary
```

###### Prompts

Prompts for GPT-4 to generate aggregation pipelines and summarize results:

```
system\_message = """Assume that you are a helpful assistant who is an expert in writing mongodb aggregation queries and return them in JSON format"""
user\_message = """I have the following quotes data stored in mongodb in a collection. The schema of the data is given below.
... (full schema here) ...
User's query: {query}"""
```

##### Example Usage

Considering the quotes dataset, you can ask your agent questions like:

*   "Who are the top 5 most popular authors?"

*   "Show me all quotes tagged with 'happiness' and 'inspiration'."

*   "What's the average popularity of quotes in the 'love' category?"

The agent will formulate the appropriate aggregation pipelines, execute them on your MongoDB data, and present you with the answers.

If you are an NLP enthusiast, you can even go one step further and ask questions like:

*   "Order the quotes by least popularity (avoid non zero) and summarize the high frequency unique lowercase words (avoid stop words and their variations like, you your yours you're etc.) appearing in these quotes. Pick only top 10 words"

*   You will get words like **“cosmic”, “life” and “death”** appearing in there

*   "Order the quotes by highest popularity (avoid non zero) and summarize the high frequency unique lowercase words (avoid stop words and their variations like, you, your, yours, you're etc.) appearing in these quotes. Pick only top 10 words"

*   You will get words like **“love”, “life” and “hope”** appearing in there

You do not need to have any ML/DS background in order to come up with analytics. The barrier to entry for a domain expert has gotten all the narrower with AI.

##### Future enhancements could include:

*   **Schema Auto-Discovery:** The agent could infer the schema directly from your MongoDB data.

*   **Visualizations:** Integrating a visualization library could make the results even more intuitive.

*   **Learning:** The agent could learn from your interactions, improving its ability to understand your questions over time.

#### Conclusion

*   MongoDB agents offer a compelling solution for those working with complex JSON data. By leveraging the flexibility of MongoDB's aggregation framework and the natural language understanding of GPT-4, you can unlock new levels of insight without the hassle of data preprocessing or complex query writing

*   Whether you're a data analyst, researcher, or developer, consider building your own MongoDB agent to streamline your workflow and effortlessly query your JSON data. It's a powerful tool that can transform the way you interact with your data, saving you time and effort while empowering you to ask more insightful questions

*You can read this in my substack* [*here*](https://anikulkar.substack.com/) *as well!*

I am open to discussions on the topic. So, keep the conversation going!
