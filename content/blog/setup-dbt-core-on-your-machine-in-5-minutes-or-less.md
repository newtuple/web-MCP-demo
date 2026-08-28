---
title: "Setup dbt Core on your machine in 5 minutes or less!"
description: "dbt is a data transformation tool that enables data teams to implement robust analytics engineering practices to improve the quality of their data. dbt has been a pioneer in a number of areas around data transformation, and as such is widely adopted by the industry today. You can collaborate on data models, version them, and test and document your queries before safely deploying them to production. dbt comes with 2 versions - one is a cloud version, and the other is dbt-core, an open source vers"
date: "2023-05-19"
updated: "2023-06-15"
author: "Vedant Koshatwar"
slug: "setup-dbt-core-on-your-machine-in-5-minutes-or-less"
tags:
  - "Data Engineering"
  - "Tutorials"
heroImage: "/blog/setup-dbt-core-on-your-machine-in-5-minutes-or-less/031d94_209c6b1eda6e4481b942987ac7bbbf40_mv2.png"
comments: true
---
[**dbt**](https://www.getdbt.com/) **is a data transformation tool that enables data teams to implement robust analytics engineering practices to improve the quality of their data. dbt has been a pioneer in a number of areas around data transformation, and as such is widely adopted by the industry today. You can collaborate on data models, version them, and test and document your queries before safely deploying them to production. dbt comes with 2 versions - one is a cloud version, and the other is dbt-core, an open source version of dbt that everyone can get started with, for free**

**This article will walk you through a quick-start of getting dbt-Core installed and run on your laptop within 5 minutes.**

![](/blog/setup-dbt-core-on-your-machine-in-5-minutes-or-less/45b0e5_f20122dc064e4e09a2d3108ac69fd1fb_mv2.jpg)

## Pre-Requisites

**Install pip in your machine.If you already have pip then check current pip version and update using :**

```
pip --version  # Check Pip version
pip install --upgrade pip  #Upgrade to new version on pip
```

## Install dbt-core on your local machine

**Step #1: Create and Navigate to the directory where you want to setup dbt.**

```
mkdir dbt
```

**Step #2: To install dbt use this command.**

```
pip install dbt-core
```

**To install a specific adapter plugin use**

```
pip install dbt-<adapter>
\# Example -> pip install dbt-postgres (This will install postgres adapter)
```

## Configure your first project

#### Step1: Initialize your project

**Run this command to initialise the dbt project.**

```
dbt init
```

**This will:**

*   **Create a new folder with your project name and sample files, enough to get you started with dbt**

**Create a connection profile on your local machine. The default location is ~/.dbt/profiles.yml.**

**After running the dbt init command, you'll have a new directory with a basic dbt project.**

**One of the files created is dbt\_project.yml, which is where you can configure your project.**

**Open the dbt\_project.yml file in a text editor and modify the name of your project (optional).**

```
name:'my\_new\_dbt\_project'
 version:'1.0.0'
```

#### Step 2: Set up the database connection:

**Next, you'll need to configure your database connection in the profiles.yml file. This file is in your user folder under ~/.dbt/.**

**Here's a simple example of what a Postgres profile might look like:**

```
my\_new\_dbt\_project:
  target: dev
  outputs:
    dev:
      type: postgres
      host: localhost
      user: my\_user
      pass: my\_password
      port: 5432
      dbname: my\_database
      schema: my\_schema
```

**Replace my\_user, my\_password, my\_database, and my\_schema with your actual database credentials.**

#### Step 3: Test Your Setup

**Now that everything is set up, you can test your dbt project. Navigate to your project directory and run:**

```
dbt debug
```

**This command will test your connection to the database and verify that everything is working correctly. If there are any issues, dbt will provide you with information about what's wrong.**

#### Step 4: Run your first dbt commands

**Once everything is set up and tested, you can start using dbt!To compile your project, navigate to your dbt project directory and run:**

```
dbt compile
```

**To run your project, use the command:**

```
dbt run
```

**And that's it! You've now set up dbt Core on your local machine. The process should have taken around 5 minutes, and you're now ready to start developing your data transformation workflows with dbt. Happy data modeling!**
