---
title: "Comparing Reasoning models: DeepSeek vs Gemini vs OAI"
description: "Comparing reasoning models: DeepSeek vs Gemini vs OAI - through real coding challenges. Discover which model excels in problem-solving, optimization, and code efficiency in C++. Find out the ultimate results."
date: "2025-01-29"
updated: "2025-11-24"
author: "Praharshita Kulkarni"
slug: "comparing-reasoning-models-deepseek-vs-gemini-vs-oai"
tags:
  - "LLM Engineering"
heroImage: "/blog/comparing-reasoning-models-deepseek-vs-gemini-vs-oai/e72193_0c663993683547578d03d4f5b09886d6_mv2.png"
comments: true
---
DeepSeek R1 has made a powerful impact in the AI world, proving that LLMs are no longer just text generators—they can now tackle complex problems, including coding and reasoning challenges. This blog talks about comparing reasoning models; how five prominent LLMs—DeepSeek R1, o1, o1-mini, Gemini 1.5 Pro, and Gemini 2.0 Flash—perform when tasked with solving three coding problems of varying difficulty. The problems range from easy to hard, and the models are evaluated based on their ability to start with a brute force approach, optimize the solution step-by-step, and deliver clean, efficient, and correct code in C++. The results were surprising!

## The Coding Problems and the Performance of the Models

> The three coding problems were picked specifically to assess the models' ability for algorithmic thinking, reasoning, and coding expertise.

Here is a quick overview of every problem:

### **Easy Problem: Search Insert Position**

Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. 

Start from the brute force approach and move on to the optimized solution.

**Preferred Language:** C++.

**Example:**

Input: nums = \[1,3,5,6\], target = 5

Output: 2

**Performance:**

1.  **Output from DeepSeek R1**

The model correctly implemented a binary search but took longer to explain the transition from brute force to the optimized solution.

2.  **Output from Gemini 2.0 Flash Thinking Experimental**

The model explains the decrease in time complexity from O(n) to O(log n) by first optimizing a linear search strategy (brute force) to a binary search. The C++ code was clear and effective.

3.  **Output from Gemini 1.5 Pro**

Although the model used a binary search, it did not provide a clear explanation of how it changed from brute force.

4.  **Output from o1**

The model provided a working solution but missed some opportunities to explain the optimization process clearly.

5.  **Output from o1-mini**

The model implemented a linear search and optimized it to binary search, but did not provide a clear explanation.

> Verdict 1: Gemini 2.0 Flash Thinking Experimental > DeepSeek R1 > o1-mini > o1 > Gemini 1.5 Pro

![Easy Problem: Search Insert Position](/blog/comparing-reasoning-models-deepseek-vs-gemini-vs-oai/e72193_598fc4fd5efa42618d0ac2a76a279bc5_mv2.png)

Top 3 LLM Reasoning Models

### **Intermediate Problem: Koko Eating Bananas**

Koko loves to eat bananas. There are n piles of bananas; the ith pile has piles\[i\] bananas. The guards have gone and will come back in ‘h’ hours. Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour. Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return. Return the minimum integer k such that she can eat all the bananas within h hours. 

Start from the brute force approach and move on to the optimized solution.

**Preferred Language:** C++.

**Example:**

Input: piles = \[3,6,7,11\], h = 8

Output: 4

**Performance:**

1.  **Output from DeepSeek R1**

In comparison to Gemini 2.0 Flash, it had a little trouble with the optimization process and produced a less effective result.

2.  **Output from Gemini 2.0 Flash Thinking Experimental**

It started with a brute force approach that examined every potential eating speed before optimizing it via binary search throughout the range of potential speeds. The code was well-commented, and the explanation was clear.

3.  **Output from Gemini 1.5 Pro**

The explanation was difficult to understand, and Gemini 1.5 Pro's solution was hard to follow.

4.  **Output from o1**

Although o1's solution was accurate, it was less effective, and the explanation was a little convoluted.

5.  **Output from o1-mini**

o1-mini's solution provided an explanation but it lacked structure.

> Verdict 2: Gemini 2.0 Flash Thinking Experimental > DeepSeek R1 > o1-mini > o1 > Gemini 1.5 Pro

![Intermediate Problem: Koko Eating Bananas](/blog/comparing-reasoning-models-deepseek-vs-gemini-vs-oai/e72193_4a974988174f4586a81eb93fe5426060_mv2.png)

Top 3 LLM Reasoning Models

### **Hard Problem: Median of Two Sorted Arrays**

Given two sorted arrays nums1 and nums2 of sizes m and n, respectively, return the median of the two sorted arrays.

Start from the brute force approach and move on to the optimized solution.

**Preferred Language:** C++.

**Example:**

Input: nums1 = \[1,3\], nums2 = \[2\]

Output: 2.00000

Explanation: merged array = \[1,2,3\] and the median is 2.

**Performance:**

1.  **Output from DeepSeek R1**

The model delivered a correct solution but lacked the detailed walkthrough and clarity of Gemini 2.0 Flash.

2.  **Output from Gemini 2.0 Flash Thinking Experimental**

After thoroughly explaining the merge-and-sort (brute force) method, the model used a binary search-based optimization technique to reach O(log(min(n, m))) time complexity. The code was effective and accurate.

3.  **Output from Gemini 1.5 Pro**

The model delivered the right solution, but it was not as clear or efficient as Gemini 2.0 Flash.

4.  **Output from o1**

Although the model was able to provide a brute-force solution and optimize it, the reasoning was not structured enough.

5.  **Output from o1-mini**

The model provided a brute force method and an optimized solution, but it lacked clear explanation.

> Verdict 3: Gemini 2.0 Flash Thinking Experimental > DeepSeek R1 > o1-mini > o1 > Gemini 1.5 Pro

![Hard Problem: Median of Two Sorted Arrays](/blog/comparing-reasoning-models-deepseek-vs-gemini-vs-oai/e72193_194e116c7c724dbb91cb1d869e895378_mv2.png)

Top 3 LLM Reasoning Models

## Comparing Reasoning Models: Evaluation Criteria

The models were evaluated based on three key criteria:

### Brute Force Approach

The ability to start with a straightforward, unoptimized solution. This tests the model’s understanding of the problem and its ability to generate a working solution, even if it’s not efficient.

### Step-by-Step Optimization

The ability to improve the efficiency of the brute force solution. This entails locating bottlenecks, implementing algorithmic enhancements, and providing an explanation for each optimization.

### Clean, Efficient, and Correct Code

The finished product should be error-free, easy to read, and well-structured. The code should also be efficient in terms of time and space complexity.

## Key Takeaways

The assessment emphasizes several key points:

1.  **Clarity and Explanation Matter:**The Gemini 2.0 Flash stood out by providing thorough and understandable explanations in addition to accurate and effective solutions. This makes it an efficient teaching and learning tool.

2.  **Optimization is Crucial:**One important differential is the flexibility to switch from a brute-force solution to an optimized one. Gemini 2.0 Flash and DeepSeek R1, two models that excelled in this area, showed better problem-solving abilities.

3.  **Consistency is Key:**Certain models, like o1 and o1-mini, performed inconsistently, solving some problems well while having trouble with others.

4.  **Efficiency in Code:**Correct, effective, and clean code is crucial. Gemini 2.0 Flash and other models that prioritized this got better reviews.

## Wrapping it Up

This evaluation offers valuable insights into how well large language models can solve coding challenges.

> Although all five models showed some degree of competence, Gemini 2.0 Flash was the obvious winner because of its clear code, effective solutions, and well-organized explanations. DeepSeek R1 did well and placed second, followed by Gemini 1.5 Pro, o1, and o1-mini.

As LLMs evolve, their ability to solve complex problems and explain their reasoning will become increasingly important. Models such as DeepSeek R1 and Gemini 2.0 Flash provide developers and educators with effective learning, teaching, and problem-solving tools. However, the choice of model ultimately depends on the specific use case.

***Note:*** *This evaluation is based on a limited set of coding challenges and standards. While it provides insights into the models' problem-solving abilities, it is not a comprehensive assessment of their overall effectiveness. Instead, it highlights their strengths in algorithmic problem-solving and code efficiency.*
