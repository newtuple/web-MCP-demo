---
title: "Modern Data Stack on your laptop! "
description: "A quick guide to setting up your own, local version of a modern data stack, built completely on open source! "
date: "2023-05-19"
updated: "2023-05-19"
author: "Dhiraj Nambiar"
slug: "modern-data-stack-on-your-laptop"
tags:
  - "Data Engineering"
  - "Tutorials"
heroImage: "/blog/modern-data-stack-on-your-laptop/031d94_22f5bf2e62bc4ad29a9db0f81a895183_mv2.jpg"
comments: true
---
**We often find ourselves grappling with the challenge of building a modern data stack that is both efficient and scalable. The sheer number of options and vendors can lead to analysis paralysis, causing teams to get stuck with suboptimal data practices and incomplete tooling. Does it really have to be this complicated? Maybe it's worth cutting down on the complexity of our data pipelines and building something that is easy to setup, and easy to understand, and** [**not heavy on the wallet**](https://www.newtuple.com/post/budget-friendly-data-how-to-optimize-your-data-team-s-performance-without-breaking-the-bank)**! How about we start by building a modern data stack that actually works on your laptop?**

![](/blog/modern-data-stack-on-your-laptop/031d94_22f5bf2e62bc4ad29a9db0f81a895183_mv2.jpg)

## But what’s the point?

**I get it - you’ve been exploring those highly scalable, cloud-first, ultra-reliable solutions for the organization, and this feels like a step down. But do you really need this infrastructure overhead when the data & analytics you’re running on them can be run on a laptop? I’m not suggesting that we run your organization's data and analytics stack from your laptop, but there is real value in trying to simplify your deployments in such a way that your environments can be replicated locally, at least to a large extent. Software engineers have been doing this for decades - building, testing and deploying their code locally, on a scaled down replica of their production environment. Why doesn’t the data team in the organization do the same?**

**Anyway, I digress. If you’re read this far already, you’re looking for some guidelines and some solutions for deploying on your laptop already - here we go:**

## The Lightweight Modern Data Stack, on your laptop: Key Components

**Building a modern data stack on your laptop doesn't mean compromising on functionality. With the right selection of tools and technologies, you can create a powerful data processing and analysis environment that closely mirrors your production setup. Here are the essential components of a lightweight modern data stack for your laptop:**

**1/ Data Ingestion: Use lightweight, open-source tools like** [**meltano**](https://www.meltano.com)**,** [**steampipe**](https://steampipe.io/)**,** [**Airbyte**](https://airbyte.com/) **etc to ingest data from various sources into your local environment. These tools are flexible, easy to set up, and can handle a wide range of data formats and sources.**

**2/ Data Storage: Opt for a local database like SQLite,** [**duckdb**](https://duckdb.org/) **(my current personal favorite) or PostgreSQL for storing your data. These databases are lightweight, easy to set up, and can efficiently manage small to medium-sized datasets on your local machine.**

**3/ Data Processing & Transformation: Leverage dbt-core to process, clean, and transform your data. dbt is powerful, scalable, and can be easily integrated into your local data stack.**

**4/ Data Visualization: Use open-source visualization tools like** [**Apache Superset**](https://superset.apache.org/) **or Metabase to create interactive dashboards and reports. These tools are user-friendly, easy to set up, and can be used on your local machine without much hassle. You could run a version of Superset on docker that you can install in your laptop**

**5/ Vector databases: If you're looking to add LLM capabilities to your data stack, you will likely need a vector database for semantic search & retrieval as well. There are open-source vector DBs available today such as** [**ChromaDB**](https://www.trychroma.com/) **and others that can help you get started with a straightforward implementation as well**

**If you’re itching to go deploy this right now, go ahead and look up these quick “5 minute set up” articles: You can get your modern data stack on your laptop, up and running in the next 15 minutes!**

**Data ingestion:** [**Airbyte**](https://www.newtuple.com/post/setup-airbyte-on-your-machine-in-5-minutes-or-less)

**Data transformation:** [**dbt Core**](https://www.newtuple.com/post/setup-dbt-core-on-your-machine-in-5-minutes-or-less)

**Database:** [**duckdb**](https://www.newtuple.com/post/duckdbin5)

**Data visualization:** [**Superset**](https://www.newtuple.com/post/setup-apache-superset-on-your-machine-in-5-minutes-or-less)

**Vector database:** [**trychroma**](https://docs.trychroma.com/getting-started)

## That’s it! You’re good to go - now go build your data & analytics app!

**With your lightweight modern data stack set up on your laptop, it's time to create your first data pipeline. I personally like running my “local” modern data stack on easily accessible data sources such as Google Analytics and other digital sources, just to get a good feel for the operations of this solution.**

**Have fun!**
