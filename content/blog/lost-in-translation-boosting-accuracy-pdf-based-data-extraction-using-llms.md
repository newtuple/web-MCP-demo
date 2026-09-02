---
title: "Lost in Translation? Boosting Accuracy in PDF-based data extraction using LLMs"
description: "Discover how structured PDF-to-Markdown conversion boosts PDF-based data extraction using LLMs, enhancing accuracy and efficiency in processing complex documents."
date: "2025-03-11"
updated: "2025-11-24"
author: "Aniket Kulkarni"
slug: "lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms"
tags:
  - "Document AI"
heroImage: "/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_809be24a8c364c0d8c71be59a56c1df3_mv2.webp"
comments: true
---
## Introduction

Consider the financial document depicted below. At a glance, you and I immediately understand its structure: it contains two distinct columns, multiple tables (some with merged cells), and several empty cells. If asked about a specific detail, such as the Net Current Assets under the F&U Mandate column, you'd readily notice it's blank.

![An example of the document that is being translated.](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_265cb4de27a24174b09de1a2784b35ad_mv2.png)

However, interpreting such documents becomes challenging when it comes to Large Language Models (LLMs). [Parsing a PDF](https://medium.com/@AIBites/pdf-parsing-for-llms-and-rag-pipelines-a-complete-guide-fe0c4b499240#:~:text=It%20involves%20analyzing%20the%20structure,as%20HTML%2C%20Markdown%2C%20etc.) and sending it directly to an LLM typically results in a loss of spatial accuracy and reading order, leading to unintended inaccuracies in data extraction or summarization tasks. The LLM struggles to correctly interpret the document's layout without clear spatial cues, particularly in complex tables.

At [Newtuple](https://www.newtuple.com/), our mission is to harness the power of LLMs to streamline the tedious task of extracting structured information from PDFs. Imagine the transformative potential: converting chaotic, unstructured document content into clean, structured database entries. Our work spans diverse document types, from intricate financial statements and detailed invoices to nuanced inventory reports and dense legal texts. LLMs hold immense promise because of their capability to digest vast amounts of unstructured data and turn them into meaningful, structured information.

Yet, our initial experiments with feeding raw PDFs directly to these models highlighted a critical limitation: contextual comprehension, especially [spatial awareness](https://towardsdatascience.com/language-models-and-spatial-reasoning-whats-good-what-is-still-terrible-and-what-is-improving-175d2099eb4c/). For instance, invoice tables with visually distinct column headers and corresponding values pose significant challenges. While humans effortlessly interpret these visual cues, LLMs often overlook them when parsing raw PDF data. This oversight results in inaccuracies and reduces the reliability of extracted information.

Recognizing this bottleneck, we explored ways to improve the accuracy of PDF-based data extraction using LLMs. The solution we found effective involves preprocessing documents into semi-structured formats like Markdown. With its structured syntax, Markdown greatly enhances an LLM’s ability to preserve spatial context and accurately interpret tabular layouts.

In this blog, we share our journey and insights into using essential preprocessing tools. We'll compare popular document parsing libraries that excel at converting PDFs into Markdown, focusing on their capacity to handle diverse document types and maintain tabular data integrity.

## Preprocessors at a glance

Parsing documents into Markdown format has become an essential step in preparing content for Large Language Models (LLMs). Markdown’s simplicity and structured syntax make it an ideal choice for ensuring the content is clean, consistent, and ready for processing. In this blog, we explore four popular document parsing libraries-[**Docling**](https://ds4sd.github.io/docling/)**,** [**MegaParse**](https://www.megaparse.com/)**, Tabled, and** [**MarkItDown**](https://github.com/microsoft/markitdown). These tools are evaluated based on their ability to handle diverse document types, maintain formatting integrity, and streamline the conversion process. If you're looking to optimize your workflow for feeding data into LLMs, this guide will help you choose the best library for your needs. You can refer to the links mentioned in this paragraph for installation and setup of the libraries.

To provide a clear and objective evaluation, we employed a specific methodology. Our primary focus was on **Markdown Generation**: analyzing the output formats, particularly for tabular data extracted from PDFs, alongside the generation of Markdown content itself.

## Example documents

The following images were used for this study. All these images are available on the open internet. These were chosen since they contain data in complex structures like scientific notations, complex tables, empty cells, etc.

1.  ### Physical Specifications of a product

    ![Physical Specifications of a Product](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_dbd948febfc04f0290b0f03f84989da2_mv2.png)

2.  ### A/D Converter specifications

    ![A/D Converter Specifications](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_e5c0385b0da04b729bfd290ce5023f50_mv2.png)

3.  ### Financial Statement

    ![Financial Statement](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_d318a45ec91b4cb6bd6ff18a487e7fae_mv2.png)

## Results for the PDF-Based Data Extraction Using LLMs

*   ### Physical Specifications of a product

    *   #### Docling

        ![Docling_physical specifications of a product](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_910ac5dbf93641b4a156337efc75dfc4_mv2.png)

    *   #### Tabled

        ![tabled_physical specifications of a product](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_cfb175e40fdb487cbdce87ebd5ef34bb_mv2.png)

    *   #### MegaParse

```
# Table 1
# Physical Specifications
# Type
# Specification
# Comments
# Weight
7 kg (15.4 lbs)
# Dimensions (width × depth × height)
345 × 435 × 80 mm (13.5 × 17 × 3.1 inches)
# Line Voltage
100 - 120 or 220 - 240 VAC, ± 10 %
# Wide-ranging capability
# Line Frequency
50 or 60 Hz, ± 5 %
# Power consumption
30 W
# Maximum
# Ambient Operating Temperature
0 - 55 °C (32 - 131 °F)
see CAUTION on page 11
# Ambient Non-operating Temperature
- 40 - 70 °C (-4 - 158 °F)
# Humidity
< 95 %, at 25 - 40 °C (77 - 104 °F)
# Non-condensing
# Operating Altitude
Up to 2000 m (6500 ft)
# Non-operating Altitude
Up to 4600 m (14950 ft)
For storing the instrument
# Safety Standards: IEC, CSA, UL
# Installation Category II, Pollution Degree 2
```

[View the original GitHub Gist](https://gist.github.com/Praharshita12/ef0007a89bdeec973ffc1de7b0c23de8)

*   #### MarkItDown

```
Table 1
Type
Weight
Physical Specifications
Specification
7 kg (15.4 lbs)
Comments
Dimensions (width × depth × height)
345 × 435 × 80 mm (13.5 × 17 × 3.1 inches)
Line Voltage
Line Frequency
100 - 120 or 220 -  240 VAC, ± 10 %
Wide-ranging capability
50 or 60 Hz, ± 5 %
Power consumption
30 W
Maximum
Ambient Operating Temperature
0 - 55 °C (32 - 131 °F)
see CAUTION on page 11
Ambient Non-operating Temperature
-40 - 70 °C (-4 - 158 °F)
Humidity
Operating Altitude
Non-operating Altitude
< 95 %, at 25 - 40 °C (77 - 104 °F)
Non-condensing
Up to 2000 m (6500 ft)
Up to 4600 m (14950 ft)
For storing the instrument
Safety Standards: IEC, CSA, UL
Installation Category II, Pollution Degree 2
```

[View the original GitHub Gist](https://gist.github.com/Praharshita12/881a3072c2c21991e1b226f43c2d7db9)

*   ### A/D Converter Specifications

    *   #### Docling

        ![docling_a/d converter specifications](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_fa9fc18843e34ee09d9f5f1c38f26619_mv2.png)

    *   #### Tabled

        ![tabled_a/d converter specifications](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_4ef7c84a59404b39a77ca45ae6e6a79c_mv2.png)

    *   #### MegaParse

```
# Agilent 1100 to HP 1050, HP 1046A or 35900 A/D Converters
# Connector 5061-3378
Pin 3394
# Pin Agilent 1100 Signal Name Active (TTL)
# 1 - White
# 1 - White
# Digital ground
# 2 - Brown
# 2 - Brown
# Prepare Run
# Low
# 3 - Gray
# 3 - Gray
# Start
# Low
# 4 - Blue
# 4 - Blue
# Shut Down
# Low
# 5 - Pink
# 5 - Pink
not connected
# 6 - Yellow
# 6 - Yellow
# Power On
# High
# 7 - Red
# 7 - Red
# Ready
# High
# 8 - Green
# 8 - Green
# Stop
# Low
# 9 - Black
# 9 - Black
# Start request
# Low
```

[View the original GitHub Gist](https://gist.github.com/Praharshita12/2e6e16838633d87f4b6b3e9f993d8b25)

*   #### MarkItDown

```
Agilent 1100 to HP 1050, HP 1046A or 35900 A/D Converters
Connector 5061-3378
Pin 3394
Pin Agilent 1100 Signal Name Active (TTL)
1 - White
1 - White
Digital ground
2 - Brown
2 - Brown
Prepare Run
3 - Gray
4 - Blue
5 - Pink
3 - Gray
4 - Blue
5 - Pink
Start
Shut Down
not connected
6 - Yellow
6 - Yellow
Power On
7 - Red
7 - Red
8 - Green
8 - Green
Ready
Stop
Low
Low
Low
High
High
Low
9 - Black
9 - Black
Start request
Low
```

[View the original GitHub Gist](https://gist.github.com/Praharshita12/9b68a95c4e719dabacb413be8fadd21f)

*   ### Financial Statement

    *   #### Docling

        ![docling_financial statement](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_b5c73b53e86b4835a92362644578993c_mv2.png)

    *   #### Tabled

        ![tabled_financial statement](/blog/lost-in-translation-boosting-accuracy-pdf-based-data-extraction-using-llms/e72193_a7f41c6fe44a4167b609bd0c7b6eff5c_mv2.png)

    *   #### MegaParse

```
# ABRIDGED BALANCE SHEET AS AT MARCH 31, 2024
## As at March 31, 2024
## LIABILITIES
## 1 Unit Capital
12,848.85
## 2 Reserves & Surplus
## 2.1 Unit Premium Reserves 2.2 Unrealised Appreciation Reserve 2.3 Other Reserves
- 44.97 1,294.11
## 3 Loans & Borrowings
-
## 4 Current Liabilities & Provisions
## 4.1 Provision for doubtful Income/Deposits 4.2 Other Current Liabilities & Provisions
- 1.50
## TOTAL
14,189.42
## ASSETS
## 1 Investments Gold Silver 1.1 Listed Securities
- -
1.1.1 Equity Shares 1.1.2 Preference Shares 1.1.3 Other Debentures & Bonds 1.1.4 Securitised Debt securities 1.1.5 Units of REITs/InvITs 1.1.6 Equity Linked Debentures 1.1.7 Alternative Investement Fund
- - - - - - -
1.2 Awaited Listing Securities 1.2.1 Equity Shares 1.2.2 Preference Shares 1.2.3 Other Debentures & Bonds 1.2.4 Securitised Debt securities 1.2.5 Units of REITs/InvITs 1.2.6 Equity Linked Debentures 1.2.7 Alternative Investement Fund
- - - - - - -
1.3 Unlisted Securities 1.3.1 Equity Shares 1.3.2 Preference Shares 1.3.3 Other Debentures & Bonds 1.3.4 Securitised Debt securities 1.3.5 Units of REITs/InvITs 1.3.6 Equity Linked Debentures 1.3.7 Alternative Investement Fund
1.4 Government Securities 1.5 Treasury Bills 1.6 Commercial Paper 1.7 Certificate of Deposits 1.8 Units of Domestic Mutual Fund 1.9 Bill Rediscounting 1.10 Foreign Securities
- - - - - - - 14,035.89 - - - - - -
## Total Investments
14,035.89
## 2 Deposits
-
## 3 Other Current Assets
## 3.1 Cash & Bank Balance 3.2 TREPS/Reverse Repo Lending 3.3 Others
4 Deferred Revenue Expenditure (to the extent not written off)
0.45 118.36 34.72 -
#### TOTAL
#### 14,189.42
# ` in Lakhs
# As at March 31, 2023
12,848.85
- 133.52 113.36
-
- 1.60
13,097.33
```

[View the original GitHub Gist](https://gist.github.com/Praharshita12/d0d3a2cff7aa29ff5ad71eb5b18f6bc8)

*   #### MarkItDown

```
# ABRIDGED BALANCE SHEET AS AT MARCH 31, 2024
## As at March 31, 2024
## LIABILITIES
## 1 Unit Capital
12,848.85
## 2 Reserves & Surplus
## 2.1 Unit Premium Reserves 2.2 Unrealised Appreciation Reserve 2.3 Other Reserves
- 44.97 1,294.11
## 3 Loans & Borrowings
-
## 4 Current Liabilities & Provisions
## 4.1 Provision for doubtful Income/Deposits 4.2 Other Current Liabilities & Provisions
- 1.50
## TOTAL
14,189.42
## ASSETS
## 1 Investments Gold Silver 1.1 Listed Securities
- -
1.1.1 Equity Shares 1.1.2 Preference Shares 1.1.3 Other Debentures & Bonds 1.1.4 Securitised Debt securities 1.1.5 Units of REITs/InvITs 1.1.6 Equity Linked Debentures 1.1.7 Alternative Investement Fund
- - - - - - -
1.2 Awaited Listing Securities 1.2.1 Equity Shares 1.2.2 Preference Shares 1.2.3 Other Debentures & Bonds 1.2.4 Securitised Debt securities 1.2.5 Units of REITs/InvITs 1.2.6 Equity Linked Debentures 1.2.7 Alternative Investement Fund
- - - - - - -
1.3 Unlisted Securities 1.3.1 Equity Shares 1.3.2 Preference Shares 1.3.3 Other Debentures & Bonds 1.3.4 Securitised Debt securities 1.3.5 Units of REITs/InvITs 1.3.6 Equity Linked Debentures 1.3.7 Alternative Investement Fund
1.4 Government Securities 1.5 Treasury Bills 1.6 Commercial Paper 1.7 Certificate of Deposits 1.8 Units of Domestic Mutual Fund 1.9 Bill Rediscounting 1.10 Foreign Securities
- - - - - - - 14,035.89 - - - - - -
## Total Investments
14,035.89
## 2 Deposits
-
## 3 Other Current Assets
## 3.1 Cash & Bank Balance 3.2 TREPS/Reverse Repo Lending 3.3 Others
4 Deferred Revenue Expenditure (to the extent not written off)
0.45 118.36 34.72 -
#### TOTAL
#### 14,189.42
# ` in Lakhs
# As at March 31, 2023
12,848.85
- 133.52 113.36
-
- 1.60
13,097.33
```

[View the original GitHub Gist](https://gist.github.com/Praharshita12/d0d3a2cff7aa29ff5ad71eb5b18f6bc8)

## Conclusion

In conclusion, our exploration into PDF preprocessing clearly illustrates the immense impact that structured preparation can have on the effectiveness of Large Language Models (LLMs) in extracting accurate, structured information from PDFs. By shifting from raw PDF inputs to structured Markdown using specialized tools like Docling, we significantly enhanced LLM accuracy by preserving vital spatial context and tabular integrity. Among the evaluated tools-Docling, MegaParse, Tabled, and MarkItDown-we observed very clear differences in the output, particularly when handling complex, tabular data. Docling seems to come on top of all the tools evaluated.

Ultimately, our work at Newtuple underscores a crucial insight: preprocessing PDFs into semi-structured formats such as Markdown is essential. This preprocessing step unlocks the true potential of LLMs, ensuring the extraction of reliable, accurate, and actionable structured data. As we continue refining these techniques, we're excited about the possibilities they will open for businesses seeking to transform unstructured PDF data into valuable operational intelligence.
