---
title: "Improving Data Quality with dbt tests"
description: "This is a quick introduction into using dbt for improving data quality by means of dbt tests."
date: "2023-10-20"
updated: "2023-10-23"
author: "Amrutha BH"
slug: "improving-data-quality-with-dbt-tests"
tags:
  - "Data Engineering"
  - "Tutorials"
heroImage: "/blog/improving-data-quality-with-dbt-tests/875d5a_546d31a8bb9e412f9e92ec5057a5ab55_mv2.png"
comments: true
---
​

![](/blog/improving-data-quality-with-dbt-tests/875d5a_546d31a8bb9e412f9e92ec5057a5ab55_mv2.png)

**Data testing is a critical step in the data engineers’ journey toward reliable and high quality data. And one of the easy and popular approaches available is making use of tests in dbt. dbt (data build tool) is a SQL-based command-line tool that offers** [**native testing features**](https://docs.getdbt.com/docs/build/tests)**.**

**There’s a lot to understand in order to both create the most value from the dbt tests and avoid leaning too heavily on a time-intensive process. So in this article, we’ll dive into the nitty-gritty of dbt tests: what they are, how they work and how to run them.**

### The need-to-know basics of dbt

**Data engineers use dbt to facilitate analytics workflows. More specifically, teams use dbt to write transformations as SQL queries, version control the code, and deploy transformations incrementally.**

**dbt also happens to be an incredibly handy tool for running many data quality tests. You can use dbt to validate the accuracy, freshness, and reliability of your data and data models, ideally identifying any issues before they cause downstream impacts on analytics and decision-making. And since source data changes often - sometimes multiple times per day - most teams use dbt testing continually as part of their production pipelines.**

**If you've not installed dbt already, you can refer to this article and** [**setup dbt-core on your machine in 5 minutes or less!**](https://www.newtuple.com/post/setup-dbt-core-on-your-machine-in-5-minutes-or-less)

### Defining dbt tests

**There are two primary ways to define dbt tests: generic and singular. Generic, predefined tests are out-of-the-box tests that you can apply across multiple data models. Singular tests are customized tests you develop for a specific data model.**

**These two types of tests often work together within dbt. You can easily apply generic tests across all your models for general data quality checks, and then develop singular tests to ensure specific business rules are being followed for specific models or fields.**

## Generic Tests

**Generic tests are predefined tests that can be easily applied to columns in our models by adding a few lines of YAML in your dbt project. Since these tests are used to validate the correctness of our data models’ schema, they’re also called schema tests**

**Some of the readily available schema tests are:**

*   **unique : Ensures that all values in a column are distinct, highlighting any duplicates that might exist.**

*   **not\_null : Checks that every value in a column is not NULL, ensuring that mandatory fields are filled.**

*   **accepted\_values : Validates that all entries in a column match a predefined set of acceptable values, maintaining data integrity.**

*   **relationships : Asserts the referential integrity between two tables, confirming that a foreign key in one table correctly relates to a primary key in another.**

**Let’s get specific about these so-called generic tests. Here are step-by-step instructions to run generic tests in dbt.**

### 1\. Define your dbt model

**First, you need to have a defined dbt model which can be described as a select statement. This model will be saved as a '.sql' file within the \`models\` directory of your dbt project.**

![](/blog/improving-data-quality-with-dbt-tests/875d5a_a70f91ece2ea420984b69bcd845b9b73_mv2.png)

### 2\. Create the schema.yml file

**In the same directory as your model, create or update the \`schema.yml\` file. We’ll use this file to define tests for your model.**

**In the ‘schema.yml’ file, define the tests associated with the appropriate column of the model. For example, here’s how to declare schema tests for ‘unique\_combination\_of\_columns’’ to the ‘id’, ‘subaccount’, ‘name’ & ‘sync\_time’ column in the \`dbt\_final\_users\` model:**

![](/blog/improving-data-quality-with-dbt-tests/875d5a_b8c43166c04e4c11b3b028981fd0476d_mv2.png)

### 3\. Run your tests

**After we define dbt tests, we can run them using the following command in the terminal:**

```
$ dbt test
```

**When we run this command, dbt compiles the test definitions into SQL queries, executes these queries, and displays the test result. With dbt testing, test passes when there are no rows returned, which indicates our data meets our defined conditions. If any rows are returned in the test, the test has failed. Time to investigate.**

**Note that, if you elect to store test failures:**

*   **By default, test result tables are generated in a schema named or suffixed with 'dbt\_test\_\_audit.' However, you can customize this by applying a schema configuration as shown in the above image.**

*   **It's important to note that the results of a specific test will always overwrite the previous failures from the same test.**

## Singular Tests

**Singular tests in dbt are user-defined SQL tests for validating more complex relationships or conditions in data. Let’s get specific about singular tests. Here are step-by-step instructions to run singular tests in dbt.**

### 1\. Create a data test file

**We’ll need to create a new SQL file within the ‘tests’ directory in your dbt project. Give the file a meaningful name that reflects the purpose of the test, and follow the naming convention of ending with ‘\_test’.**

![](/blog/improving-data-quality-with-dbt-tests/875d5a_8563ecb4fef8481187727812810c7833_mv2.png)

### 2\. Write the data test

**In the data test file, write a SQL query that checks for the specific data quality rule we want to enforce. Use SQL functions, operators, and clauses to define the conditions and criteria for the test.**

![](/blog/improving-data-quality-with-dbt-tests/875d5a_a0501dc535fe498681313be1827f03e9_mv2.png)

**Note : Singular tests don’t require additional configuration in a ‘schema.yml’ file. By placing the SQL file in the ‘tests’ directory and naming it appropriately, dbt knows to run this file as a test.**

### 3.Run the data test:

**Finally, save the data test file and run the dbt test command. Just like with schema tests, you run singular data tests using the following command in your terminal:**

```
$ dbt test
```

**This will direct dbt to run all of the tests - both generic inside schema file and singular tests - and return results.**

**Note that, if you elect to store test failures:**

*   **By default, test result tables are generated in a schema named or suffixed with 'dbt\_test\_\_audit.' However, you can customize this by applying a schema configuration as shown in the above image.**

*   **I**t's important to note that the results of a specific test will always overwrite the previous failures from the same test.

## Conclusion

Ensuring the quality and reliability of data is paramount in today's data-driven landscape, and tools like dbt offer a streamlined approach to achieving this. Through both predefined and customizable tests, dbt empowers data professionals to validate and uphold the integrity of their data assets. As the data world continues to evolve, it's essential to keep abreast of the best practices and tools that can aid in our data endeavors. If you found this deep dive into dbt testing insightful, consider subscribing to our newsletter for more in-depth articles and updates in the data & AI domain.

Stay informed and stay ahead!
