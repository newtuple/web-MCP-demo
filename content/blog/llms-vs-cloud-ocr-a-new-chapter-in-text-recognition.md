---
title: "LLMs vs. Cloud OCR: A New Chapter in Text Recognition"
description: "Compare LLM-powered OCR vs traditional cloud OCR. See accuracy tests, cost analysis & ready-to-use sample code."
date: "2023-12-14"
updated: "2025-05-04"
author: "Arpit Gahlot"
slug: "llms-vs-cloud-ocr-a-new-chapter-in-text-recognition"
tags:
  - "Document AI"
heroImage: "/blog/llms-vs-cloud-ocr-a-new-chapter-in-text-recognition/38c95d_acda56a43b3848c5ba9fad58c53c09f0_mv2.png"
comments: true
---
## **Introduction**

**Optical Character Recognition (OCR) technology has become an indispensable tool for businesses and enterprises seeking efficient and accurate data extraction from documents. From automating data entry processes to extracting valuable insights from unstructured content, OCR plays a pivotal role in streamlining workflows and enhancing productivity. By converting different types of documents into editable and searchable data, OCR has become an indispensable tool for digitizing records, automating data entry, and streamlining business processes.**

**Enterprises, in particular, benefit from OCR when dealing with bulk processing of documents such as invoices, forms, and contracts, which can save time and reduce human error.**

**In the past few months a new way has emerged for potentially conducting OCR - this is via multi-modal large language models like GPT-4V. In this article we will compare the efficiency and potential of multi-modal LLMs vs “traditional” methods for OCR with cloud services**

![OCR vs LLM](/blog/llms-vs-cloud-ocr-a-new-chapter-in-text-recognition/38c95d_acda56a43b3848c5ba9fad58c53c09f0_mv2.png)

## **So what did we compare?**

**We set out to compare the OCR capabilities of OpenAI’s GPT-4V model with AWS Textract, one of the most widely adopted OCR cloud services available today. We compared these approaches along the following lines:**

1.  **Efficacy of OCR on different kinds of documents: multi-lingual text inside images, structured data extraction from images containing tables and different types of handwritten documents**

2.  **Cost comparison between GPT-4V and AWS Textract.**

## **A summary of AWS Textract**

**AWS Textract is a service that goes beyond basic OCR. It offers several specialized modules designed to handle various aspects of document analysis:**

*   **DetectDocumentText: This is the OCR feature that extracts raw text from documents.**

*   **AnalyzeDocument: This suite of features includes the ability to extract tables, forms, and even answer custom queries.**

*   **AnalyzeExpense: Specifically designed for expense documents, this feature extracts relevant key-value pairs.**

**While AWS Textract provides a robust set of tools, it has limitations in language support and requires different modules for different tasks, which can lead to higher costs for users.**

## **OpenAI Vision: A Unified Approach to Document Analysis**

**OpenAI's approach to OCR and document analysis is more streamlined. With a single API, users can perform a wide range of tasks by simply specifying the appropriate prompt. This unified method not only simplifies the process but also supports a broader range of languages, including documents with mixed languages like English and Hindi.**

#### **Multilingual Capabilities and Flexibility**

**OpenAI's OCR capabilities shine when processing documents in multiple languages. For instance, in a document containing transport rules and fines with a mix of English and Hindi, OpenAI can accurately identify text and extract relevant information such as email addresses. AWS Textract, however, struggles with languages it does not explicitly support, such as Hindi.**

#### **Text Extraction Performance**

**In text extraction, OpenAI stands out by efficiently identifying tables and text without the need for dedicated modules. AWS Textract, on the other hand, requires specific tools for table extraction, which may lead to a more complex and resource-intensive setup.**

## **Efficacy comparison of OCR vs Multimodal LLMs**

## **Test # 1: Multi-lingual text**

**Here is an example of an page from a document that was analysed:**

![](/blog/llms-vs-cloud-ocr-a-new-chapter-in-text-recognition/38c95d_05ee10bff4394972a3901959e01523ac_mv2.jpg)

**The output from OpenAI GPT-4V is as follows:**

```
**रजिस्ट्री न. डी.एल.-33004/99 REGD. No. D. L.-33004/99**
**भारत का राजपत्र The Gazette of India**
**सं.प्रा.सं.-ज.-16032022-234254 CG-DL-E-16032022-234254**
**असाधारण EXTRAORDINARY**
**भाग II-खण्ड 3-उपखण्ड (i) PART II-Section 3-Sub-section (i)**
**प्राधिकारी से प्रकाशित PUBLISHED BY AUTHORITY**
**\[सं. 208\] नई दिल्ली, बुधवार, मार्च 16, 2022/फाल्गुन 25, 1943 No. 208\] NEW DELHI, WEDNESDAY, MARCH 16, 2022/PHALGUNA 25, 1943**
**सत्ताक परिवर्तन और राजपत्रीय संवादन**
**अधिसूचना नई दिल्ली, 16 मार्च, 2022**
**सं.एफ.नं. 211(बी).-मोटर यान अधिनियम, 1988 (1988 की 59) की धारा 139 की उपधारा (1) के प्रयोग (क) और (ग) पूर्व उल्लिखित अधिनियम की धारा 230 के प्रावधानों को लागू करने के निमित्तार्थ जारी की गया अधिसूचना संख्या एसओ 212 (ई) दिनांक (1) वर्ष तयारीनामा उसके खांचे तयारीनामा तयारी किसी तयारीनामा की प्रावधानों के लिए अभिस्वीकृत किया जाता था के आदेश तयारीनामा खींचा जाता है कि उस उल्लेख परिपत्रों पर उस आवेदन पर उस आवेदन पर उस आवेदन पर उस आवेदन पर उस अभिस्वीकृति की प्रतिलिपि, भारत से राजपत्र में न्यायवादीरों, उन आदेशों को जनता के संज्ञान में लाने के लिए तीन माह की समयावधि के भीतर विभिन्न प्रिंट जाएगा।**
**(इस आवेदन प्रपत्रों के संदर्भ में आम जन सुझाव, अभि मत नहीं है, संदेह-स्पष्ट (संपादन, परिवर्तन, टिप्पणी, संदेह परिवर्तन और राजपत्रीय संवादन, परिवर्तन संवाद, समर्थ संभव, नई दिल्ली-110001 की ओर उसका अपना comments-month@gov.in; एंटी-वीरिंग लिया जा सकेगा।**
**प्राधिकार नियमन**
**अंतिम नाम और पत्राचार- (1) वास्तव की अंतिमतरीके-परिस्थिति सात दिवस, 2022 सत्ता का प्रशासन है
(2) ये नियम प्रस्तुतता में उन्हें अभिस्वीकृता और तयारीनामा की तारीख से लागू होंगे।**
**स्थानापन्नता- (1) इन नियमों में, जहां कोई संदेह में अन्यथा आवश्यक न हो:-
ह. "अभिवाहन" या आयात संस्था सातर अभिवाहन, 1988 (1988 की 59) है।**
**1842 GI/2022 (1)**
```

**The output from AWS Textract is as follows:**

```
**(\[)
2181
Mr (69 14 8861) 886L Hills 2?(H klolle 140
'up
-10 1 Plathte 1 Hoth of 401 pls 'It (Hrk) HS (L) -Stalleyjh Z
1111 IN/W 1 all Lyo 11614 HPH 40 #: khale HRK (2)
the 1046 110 194 2202 'HRK Hills reflective 14 Hardy HS (L) -tell THE HIL I
Hely halk
110 inter WH-S sh
1601 truth 110 Etc 140 st 'felt 24th Hpt topich 'KWIKH THE
4054 '(w)? WILLPHII) blette to $140 2jr 'bltsk 11c httle #: Beth 4 (Hrt) hulk HS
d tyo
Bypte Hg HILL 14 my WILL sleep Bowhe 140 1045 HILE #: khele of Pelts 'trujk lyo IMPABLE
HS pls 1 algin HE sh Harty hulk 42 yof no 1011 1231 H2JLL 123340 THE the 10110 12401
inter 4 13140111 tyo Hote Pejitek reltt 1213 40 1213 (L) lye 212 1elp lye
48 140 halk payable of Hard rhpj4 ing peep letter 14 124-11 123K 1,13 (LF) THE (B)
sp 4 (L) lye 6EL 1.113 Lye (69 14 8861) 886L with
2202 'pl't 9L 'Honoy it
rwikh WHALE THE 1382/h 4054
EV6L 'st VNO9TVHJ/7707 '9I "AVASANCAIM 'ITT'S MEIN
\[807 'ON
'st '9L fallt 216B6
\[807 H
CEHSITANT
14 2141811K
(I) -E
(1) sop-II lette
10 041
CHICI
140**
```

**As can be seen here, AWS Textract has been unable to recognise the text as part of it was in Hindi.**

**Not only is OpenAI capable of extracting the text, but can also translate it on the fly:**

```
**The Gazette of India**
**REGD. No. D. L.-33004/99**
**Government of India CG-DL-E-16032022-234254**
**EXTRAORDINARY PART II-Section 3-Sub-section (i)**
**Published by Authority**
**No. 208\] NEW DELHI, WEDNESDAY, MARCH 16, 2022/PHALGUNA 25, 1943**
**HEALTH AND FAMILY WELFARE DEPARTMENT**
**Notification**
**New Delhi, 16 March, 2022**
**G.S.R. 211(E).-In exercise of the powers conferred by sub-section (1) of section 139 of the Motor Vehicles Act, 1988 (59 of 1988), read with clause (h) of sub-section (1) and clause (a) of sub-section (2) of the said section and in suppression of the Ministry of Road Transport and Highways Notification No. G.S.R. 212(E) dated the 15th April 1989, except as respects things done or omitted to be done before such supersession, the Central Government hereby specifies biometric identity service for the purposes of sub-section (1) of section 139 of the said Act. An individual shall furnish the biometric identity as may be prescribed for availing any service or meet any requirement under the said Act.**
**The draft of the above rules shall be taken into consideration on or after the expiry of a period of thirty days from the date on which the copies of the Gazette of India, in which this notification is published, are made available to the public.**
**Objections or suggestions, which may be received from any person with respect to the said draft before the expiry of the period specified above, will be considered by the Central Government.**
**Any such objections or suggestions should be addressed to the Secretary to the Government of India, Ministry of Road Transport and Highways, Transport Bhawan, 1, Parliament Street, New Delhi-110001 or emailed at comments-moth@gov.in; and ought to be made in writing.**
**Draft Rules**
**Definition: In these rules, unless the context otherwise requires,**
**(1) “Act” means the Motor Vehicles Act, 1989 (59 of 1988); (2) any reference to any enactment or rule made thereunder shall, in the context of such enactment or rule in force currently, include a reference to the corresponding law or rule in force.**
**Specification: In these rules, for the purposes of subsection (1) of section 139 of the Act, the term “biometric identity” shall mean:**
**Provided that “biometric identity” shall mean a biometric service as may be specified by the Central Government by notification in the Official Gazette under clause (h) of sub-section (1) of section 139 of the said Act.**
**1842 GI/2022 (1)**
```

**In summary:**

*   **AWS Textract efficiently extracts data from multi-lingual text but we would need to use an additional service for translation / summarization.**

*   **With GPT-4V, we can combine the requirements of extraction, translation and summarization (if required) behind one or two API calls.**

### **Test # 1 Verdict: OpenAI GPT4V 1 - 0 AWS Textract**

## **Test # 2: Tables**

**Let us also consider an example of table extraction. We have the following page of a document on traffic offences and corresponding fines:**

![](/blog/llms-vs-cloud-ocr-a-new-chapter-in-text-recognition/38c95d_18fb91d49bb2442d9caf94f20a0b8e5e_mv2.jpg)

**Here is the table extracted by OpenAI:**

```
**Offence Description                            Section/ Rule                 Notified Fine 1st off    2nd off  Offence through CCTV   Remarks
------------------------------------------------------------------------------------------
1 Failure to produce Driving Licence (DL)      s.130(1)            500              1000                               No
  on demand by police officer in uniform       /177
2 Driving-W/o DL/ DL expired/ DL not           s.3/181             5000             5000                               No
  specific
3 Under age driver w/o DL                      s.4/181             Non. Comp.        Non. Comp.                         No                     Non. Comp.
4A Offence Committed by Juvenile               99A                 s. 199A          Non. Comp.        Non. Comp.        No                     Non. Comp.
4 Allowing unauthorized person to drive        s.5/180             5000             5000                               No
5 Holding more than one DL                     s.6/177             500              1000                               No
6 Learner driving w/o instructor with DL       r.3(1)(B)/          500              1000                               No
                                                  s.177
7 Learner driving w/o displaying L Plates      r. 3(1)(C)/         500              1000                               No
                                                  s.177
8 W/o/Expired Registration Certificate         s.39/192            3000             5000                               No                     Compounding
  (Two Wheeler)                                                                                                                        fees as per
                                                                                                                                       class of Vehicle.
8A W/o/Expired Registration Certificate        s.39/192            5000             10000                              No                     Compounding
  (Other Vehicles)                                                                                                                     fees as per
                                                                                                                                       class of Vehicle.
9 Road Tax not paid                            s.177               500              1000                               No
10 Plying transport vehicle w/o Fitness        s.56/192            5000             10000                              No
11 Plying transp veh. w/o expired Permit       s.66/192            10000            10000                              No
11A Plying transp veh. out of route            s.66/192            10000            10000                              No
11B Trans veh. carrying>capacity on Permit     s.66/192            A/               10000            10000             No
                                                194(A)
11C Plying transport vehicle in contravention of other permit conditions    s.66/192            A/               10000             10000          No
                                                192A
11D Tractor-Trolley put to non-agricultural commercial use                 r.2(b)(c)/s        .66,              10000             10000          No
                                                                           .192A
11E Carriage of EXCESS PASSENGERS than authorized in RC/Permit                         s.66/                200 per excess    No
                                                                                       194A                passenger
11F Non Transport Vehicle being used as a commercial vehicle                             s.66/               10000            10000          No
                                                                                       s.192A
12 W/o / Expired Third Party Insurance                                                    s.146/196        2000             4000            No
13 Failure to report change of address within prescribed period                          s.49(2)/17           500             1000            No
14 Failure to report fact of transfer of vehicle within prescribed period                s.50(3)/17           500             1000            No**
```

**Here is the same extracted by AWS Textract as a CSV:**

```
**"'","'Section/","'Notified","'Fine","'Offence","'",
"'Offence Description","'Rule","'1st off","'2nd off","'through CCTV","'Remarks",
"'1 Failure to produce Driving Licence (DL) on demand by police officer in uniform","'s.130(1) /177","'500","'1000","'No","'",
"'2 Driving-W/o DL/DL expired/ DL not specific","'s.3/181","'5000","'5000","'No","'",
"'3 Under age driver w/o DL","'s.4/181/1 99A","'Non. Comp","'Non. Comp.","'No","'Non. Comp.",
"'3A Offence Committed by Juvenile","'S. 199A","'Non. Comp","'Non. Comp.","'No","'Non. Comp.",
"'4 Allowing unauthorized person to drive veh.","'s.5/180","'5000","'5000","'No","'",
"'5 Holding more than one DL","'s.6/177","'500","'1000","'No","'",
"'6 Learner driving w/o instructor with DL","'r.3(1)(B)/ s.177","'500","'1000","'No","'",
"'7 Learner driving w/o displaying L Plates","'r. 3(1)(C)/ S. .177","'500","'1000","'No","'",
"'8 W/o/Expired Registration Certificate (Two Wheeler)","'s.39/192","'3000","'5000","'No","'Compounding fees as per class of Vehicle.",
"'8A W/o/Expired Registration Certificate (Other Vehicles)","'s.39/192","'5000","'10000","'No","'Compounding fees as per class of Vehicle.",
"'9 Road Tax not paid","'s.177","'500","'1000","'No","'",
"'10 Plying transport vehicle w/o Fitness","'s.56/192","'5000","'10000","'No","'",
"'11 Plying transp veh. w/o /expired Permit","'s.66/192 A","'10000","'10000","'No","'",
"'11A Plying transp veh. out of route","'s.66/192 A","'10000","'10000","'No","'",
"'11B Trans veh. carrying>capacity on Permit","'s.66/192 A/ 194(A)","'10000","'10000","'No","'",
"'11C Plying transport vehicle in contravention of other permit conditions","'s.66/ s.192A","'10000","'10000","'No","'",
"'11D Tractor-Trolley put to non- agricultural commercial use","'r.2(b)(c)/s .66, s.192A","'10000","'10000","'No","'",
"'11E Carriage of EXCESS PASSENGERS than authorized in RC/Permit","'194A","'200 per","'excess passenger","'No","'",
"'11F Non Transport Vehicle being used as a commercial vehicle","'s.66/ s.192A","'10000","'10000","'No","'",
"'12 W/o / Expired Third Party Insurance","'s.146/196","'2000","'4000","'No","'",
"'13 Failure to report change of address within prescribed period","'s.49(2)/17 7","'500","'1000","'No","'",
"'14 Failure to report fact of transfer of vehicle within prescribed period","'s.50(3)/17 7","'500","'1000","'No","'",**
```

**In summary:**

*   **OpenAI can extract tables and other structured data from a document, performing as well as a dedicated tool such as AWS Textract**

### **Test # 2 Verdict: OpenAI GPT4V 2 - 1 AWS Textract**

## **Test # 3: Handwritten documents**

**Here’s a more difficult example: handwriting recognition. Despite the digitisation of the postal system, the post office still receives mailing addresses written by hand, and some of these addresses are not easy to read even by dedicated handwriting recognition software. Let us see how OpenAI fares here. For this image:**

![](/blog/llms-vs-cloud-ocr-a-new-chapter-in-text-recognition/38c95d_eecf92b9bc314b5caf825d7ed6b4e4ca_mv2.jpg)

| OpenAI GPT-4V | AWS Textract |
| --- | --- |
| The image contains two addresses written in cursive handwriting. The sender's address at the top left corner is:<br><br>Barack Obama<br>1600 Pennsylvania Ave NW<br>Washington, DC 20500<br><br>The recipient's address at the bottom right corner is:<br><br>Hugh Amick Potter, Inc<br>509 Cascade Ave, Suite H<br>Hood River, OR 97031 | Barack Obama<br>PORTLAND OR 970<br>1600 Pennsylvania Ave the HW<br>23 JAN 2014 PM3L<br>Washington, DC 20500<br>Hugh amick<br>v Letter, inc<br>509 Cascade Ave, Suite H<br>Hood River, OR 91031<br>97031206080 |

**As evident, OpenAI not only competes effectively with dedicated OCR tools but also demonstrates a superior understanding of images as distinct objects. Notably, OpenAI exhibits precise recognition by pinpointing the locations of the two addresses within the image and subsequently processing only those specific regions, avoiding the need to analyse the entire image indiscriminately.**

**Moreover, OpenAI's capabilities extend beyond mere text extraction. Utilising OpenAI enables the generation of responses to queries based on the content within these images. In this context, OpenAI excels in comprehending the nuances of both context and content associated with each image, providing a more sophisticated and contextually aware approach.**

**Taking the case of handwritten notes further, here is an example of a handwritten note from 1948 Election campaign in the US:**

![](/blog/llms-vs-cloud-ocr-a-new-chapter-in-text-recognition/38c95d_a6b35298743840ebb056895347451977_mv2.jpg)

| OpenAI GPT-4V | AWS Textract |
| --- | --- |
| THE WHITE HOUSEWASHINGTON<br><br>1. Present Ambassadorto USSR.Personal now gone -a stable boy who ought tostay in a stable. Doesnot belong in Moscow.<br><br>2. Urge Stalin to pay us anMIT. We'll send the BattlesShip Missouri for him ifhe'll come, either to Alaskaor Leningrad and bring his gang.<br><br>3. Settle the Korean questionon the basis of the Mosco aagreement - let the gangin Korea go to the government oftheir own. | s.<br>TRUMAN<br>THE WHITE HOUSE<br>U.S. SERVICE" NATIONAL<br>AND<br>WASHINGTON<br>Kusci a<br>GOVERNMENT<br>/<br>Precent ambassador<br>to URA.<br>X<br>a stable boy who ought to<br>persona non graturi<br>story in a staff Does<br>not belong in Washington<br>2 Uage Stalin to pay us a<br>visit. We el send the Battle<br>he Heome, either to Odesca<br>ship Trickouri for him if<br>3 Settle Korean question<br>or Leningia dand fring his good<br>on the fasis of thorean a-<br>greement are he Her, give<br>then am<br>Koreas a government of |

**In summary:**

*   **OpenAI is more versatile and smart in its analysis of handwritten documents.**

*   **OpenAI is excellent in recognising handwritten text which is extremely hard to read otherwise.**

### **Test # 3 Verdict: OpenAI GPT4V 3 - 1 AWS Textract**

## **Pricing Analysis: OpenAI vs. AWS Textract**

**Pricing is a crucial factor for enterprise clients looking to implement OCR solutions at scale. AWS Textract's pricing model involves various modules, each with its own associated cost. For instance, extracting queries or tables individually incurs fees, and the combination of modules results in cumulative charges. In contrast, OpenAI Vision simplifies pricing with a straightforward structure, charging per image and per token.**

**When it comes to pricing, the differences between OpenAI and AWS Textract become more apparent. AWS Textract's pricing is based on the specific modules used, with costs that can quickly add up depending on the combination of features needed.**

| Feature | AWS Textract (per 1,000 pages) | OpenAI Vision (per 1,000 images/pages) |
| --- | --- | --- |
| All features combined (tables, forms, queries, text extraction, and layout) | $70.00 | $11.05 for A4-size pages at 150 DPI<br>$7.65 for pages at 96 DPI |
| Signatures | $3.50 | Not supported* |

***\*OpenAI currently does not support signatures as it is restricted from processing confidential or sensitive personal information.***

**OpenAI Vision's pricing is more straightforward, with a single cost per image processed and an additional charge based on the number of tokens (words) in the output (approximately $3 per 1000 pages). This implies an overall cost of ~ $13 - $14 per 1000 pages(or ~ $10 per 1000 pages, if page sizes are smaller). This can lead to significant savings, especially for enterprises that need to process large volumes of documents with varying requirements.**

### **Verdict**

*   **OpenAI offers a competitive set of features at a price that is at least 5x-6x affordable than AWS Textract.**

*   **In some specific cases(such as smaller images like IDs, labels, medical prescription), OpenAI Vision can offer savings of upto 10x compared to AWS Textract.**

*   **On top of this, OpenAI also supports interaction with the content of images via chat prompts. This makes it an overall superior tool for enterprises to process text in images.**

## **Advantages of using a multimodal LLM like GPT-4V**

1.  **Multilingual Support: OpenAI Vision's ability to handle a wide range of languages, including complex scripts like Hindi, provides a significant advantage for enterprises with diverse linguistic needs.**

2.  **Unified API: The simplicity of OpenAI's single API for various OCR tasks offers a streamlined and user-friendly experience, eliminating the need for multiple modules and reducing complexity.**

3.  **Cost Transparency: OpenAI's pricing model, with clear per-image and per-token charges, facilitates cost predictability and simplifies budgeting for enterprises.**

## **But when would you still use a dedicated OCR service?**

**Even though the tests conducted by us show that GPT-4V has an advantage in a number of areas, there are still use cases where a dedicated OCR service like Textract would be useful. These are:**

1.  **In cases where the structure of the document is well defined, and the requirements are consistent across potentially hundreds or thousands of images - OCR can give us consistency that sometimes may not be possible with an LLM**

2.  **OCR APIs do not have restrictions on processing of confidential information like signatures, personal details etc. Most of the times, OCR is deployed within secure environments anyway. Large Language Models like OpenAI GPT-4V have in built guardrails that prevent extracting this kind of data even if its deployed within your secure environment. In this case, an OCR will again provide more reliability and consistency compared to an LLM.**

## **Our Conclusion: Multimodal LLMs are the way for most of your OCR needs**

**For enterprise clients who require OCR for bulk processing, OpenAI offers a more cost-effective and flexible solution compared to AWS Textract. Its ability to handle a wide range of tasks with a single API, support for multiple languages, and straightforward pricing model make it an attractive option for businesses looking to optimize their document processing workflows.**

**OCR still finds a place when your document formats are very consistent, or when there is a requirement for processing sensitive data.**

**Let’s also not forget that LLMs are progressing at a very rapid pace, and future releases from OpenAI, Google Vertex, and AWS’s own Bedrock services will only make these multi-modal capabilities even more sophisticated and even potentially cheaper.**

**Our verdict is clear - if you’re building new OCR capabilities, you must consider using a multi-modal LLM for your use case.**
