---
title: "Google Analytics: UA vs GA4 data model changes"
description: "If you've been using Universal Analytics (UA) for your data extraction and analysis, you're likely aware that you'll need to migrate to GA4 soon (the reminders are hard to miss). Moving your Google Analytics property fro"
date: "2023-05-05"
author: "Dhiraj Nambiar"
slug: "google-analytics-ua-vs-ga4-data-model-changes"
heroImage: "/blog/google-analytics-ua-vs-ga4-data-model-changes/031d94_a0a329693b444a318980b17fafcfa508_mv2.png"
tags:
  - "Data Engineering"
comments: true
---
**If you've been using Universal Analytics (UA) for your data extraction and analysis, you're likely aware that you'll need to migrate to GA4 soon (the reminders are hard to miss). Moving your Google Analytics property from UA to GA4 is quite straightforward, and there are plenty of guides to help you with this. What about the data you’ve been extracting from your old Google Analytics UA properties? How does that get affected with the move to GA4? There will be some downstream impacts to your data pipelines, especially if you’ve been using Google Analytics data and merging it with other data sources for better digital analytics. There will also be impacts to your reporting on Google Analytics based on these data model changes.**

![](/blog/google-analytics-ua-vs-ga4-data-model-changes/031d94_a0a329693b444a318980b17fafcfa508_mv2.png)

**This article delves into the key differences between UA and GA4, and what you need to know from a data modeling / API development perspective to make the smoothest transition possible.**

### **The biggest difference in your Google Analytics reporting: User centric vs session centric data**

**The fundamental difference we should be aware of between UA and GA4, is the way in which data is captured and stored in Google Analytics with GA4. In Universal Analytics, the session was the primary entity under which data would be captured and aggregated. This allowed us to explore different dimensions of data with the session as the focal point. What’s changed with GA4 is the emphasis on the user as the primary entity of the data model. What this means is - the data you’re able to extract with GA4 will be much more granular at a “user” level across different sessions, rather than at an individual session level. What are some big differences in the data model? Read on to see a few examples.**

### **Lineage data extraction is restricted in GA4**

**Universal Analytics: In a UA property, it’s possible today to extract a large amount of data around page lineage within a session. Some of the dimensions you would use to construct detailed page lineage data are: landingPagePath, secondPagePath, previousPagePath, pageDepth and others. Just combining these 4 dimensions with metrics such as sessions, users etc would give you a good data extract of page lineage within a session**

![Page lineage data for Google Analytics Reporting on UA](/blog/google-analytics-ua-vs-ga4-data-model-changes/031d94_81a975a8d78f4bf789c7e9db4fa96518_mv2.jpg)

UA: Generating Page Lineage Data

**GA4: If you try to reconstruct this same view in GA4, you’ll be in for a surprise. You can no longer find detailed session level page lineage dimensions in GA4, except perhaps the landing page and current page path. But instead of this, you can now find other sources of lineage, such as firstUserSourceMedium and sessionSourceMedium, which can help you understand the flow of a user across sessions.**

![Page lineage is not available in GA4 ](/blog/google-analytics-ua-vs-ga4-data-model-changes/031d94_d195f6b3adc5461093da01b634f06108_mv2.jpg)

GA4: Doesn't automatically provide page lineage data

### **Events vs Hits + Goals**

**Universal Analytics: In Universal Analytics properties there was a differentiation between hits and goals. For extraction of data - you had to work with different hit types, such as pageviews, social shares etc. Defining a goal, was a separate exercise and created a separate data point altogether in Universal Analytics in the admin panel. In order to extract data about goals, you had to separately extract different dimensions about each goal. This was quite cumbersome, as you ended up having different columns in your data view for each goal - creating a data model issue for you down the line**

**GA4: With GA4, all “hits” as well as goals are essentially event types. Creating a conversion goal is as simple as toggling a particular event as a conversion goal. This is a good departure from the cumbersome way goals were defined in UA. Here’s a good summary of the differences in terminology:**

![Events vs hits and how it affects Google Analytics reporting](/blog/google-analytics-ua-vs-ga4-data-model-changes/031d94_e88457eff53842a3bfdbc32f806424a2_mv2.jpg)

UA vs GA4: Events

[Source](https://support.google.com/analytics/answer/9964640#zippy=%2Cin-this-article)

**From a data extraction perspective, this makes things much simpler. The “eventName” and “isConversionEvent” dimensions, in combination with demographic / device dimensions and metrics will do a good job of providing data related to different types of behaviours and conversion goals on your web property. You would need to replace some of your existing data extracts with event centric views based on this.**

### **Engagement Metrics & Bounce rate**

**Compared to Universal Analytics, GA4 uses different metric definitions which includes :**

1.  ***Engaged Sessions*: The number of sessions that either lasted longer than 10 seconds, led to a conversion event, or had two or more screen or page views.**

2.  ***Engagement Rate*: The percentage (%) of engaged sessions by total sessions**

3.  ***Engagement Time*: The length of time your website was front and center on a user’s browser or when your app was in the foreground of their phone screen**

**Because of the difference of how these metrics are calculated, Bounce rate has a different definition in GA4.**

**In Universal Analytics, Bounce Rate is defined as a percentage of single page sessions in which there was no interaction with the page. Whereas, in GA4 Bounce Rate is Percentage of sessions that were not engaged sessions. The difference is more fundamental in nature - in Universal Analytics, if you had a single page application, you would very likely see a very high bounce rate, regardless of the time spent by users on your application. This isn’t necessarily a “bounce” if you think about it. The new definition of engaged sessions does a better job in my view of accurately tracking engagement.**

**Bottom line: Make sure you’re adding these metrics of Engaged Sessions, Engagement Rate and Engagement time to your data model, and make necessary adjustments downstream to handle the new (hopefully better!) bounce rate metrics!**

### **Multi-Channel Funnel - UA vs GA4**

**Multi-channel funnels in Google Analytics allow you to see the different channels that users interact with before they convert, such as organic search, paid search, email, social media, and more. This helps you understand the various touchpoints that lead to a conversion and the impact of each channel on the overall user journey.**

**Multi-channel funnels are available in both Universal Analytics (UA) and Google Analytics 4 (GA4). However, Extracting Multi-channel funnel data from UA would require one to hit** [**Multi-Channel Funnels Reporting API**](https://developers.google.com/analytics/devguides/reporting/mcf/v3) **which works only with UA at this moment. Therefore, it is correct to say that the MCF Reporting API works with UA, but there is no equivalent API for GA4 at this time.**

**There is, however, a runFunnel** [**API**](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1alpha/properties/runFunnelReport) **in GA4, which hopefully will be upgraded to give more essential details like the Multi-Channel Funnels Reporting API over a period of time. The runFunnel API does not provide you some specific data that would be available earlier such as conversion paths by source / medium, but instead, it allows us to create & extract very detailed event-specific funnel data.**

### Conclusion

**That’s a wrap - there are quite a few more data & API changes that are being introduced with GA4, and we’ve tried to cover the most commonly used dimensions and metrics and how you could migrate those into GA4 from your old UA property. Hope this was useful to all of you.**

**You can always contact us at Newtuple directly for a consultation & implementation on how best to migrate your data, APIs and jobs from UA to GA4. We can help you build a robust digital + marketing data model, and a semantic layer combining data from Google Analytics, Ad platforms, CRM systems and more.**

**Write to us at** [**sales@newtuple.com**](mailto:sales@newtuple.com) **or** [**fill up this form**](https://www.newtuple.com/contactus) **to know more.**
