---
title: "Master the Art of Data Streamlining with Pub/Sub Pipelines"
description: "Data pipeline"
date: "2024-06-13"
updated: "2025-11-24"
author: "Rahul Kumar"
slug: "master-the-art-of-data-streamlining-with-innovative-pub-sub-pipelines"
tags:
  - "Data Engineering"
heroImage: "/blog/master-the-art-of-data-streamlining-with-innovative-pub-sub-pipelines/034285_09fc04e5ddde49738904f35fb8e88fe3_mv2.jpeg"
comments: true
---
![Data pipeline using pub/sub](/blog/master-the-art-of-data-streamlining-with-innovative-pub-sub-pipelines/034285_3a8ba282d9314daf8ff6485908f3daf5_mv2.png)

Data pipeline

Creating a pipeline that requires sending some events to be processed in the background keeping scalability in mind is one of the key requirements for building applications today. In order to process heavy/time consuming jobs in your current application it’s generally better to separate it from your core application, and one way to achieve is to use a pub/sub architecture.

The idea here is as follows:

*   Maintain a queue of messages

*   A publisher pushes messages to the queue under a topic namespace

*   A subscriber subscribes to a one or more topic & all subscribers receives it whenever a message is published to that particular topic

The most popular services in this are [Apache Kafka](https://kafka.apache.org/intro), Google’s pub/sub, AWS SQS/AppSync etc. In this article we will demonstrate using Azure’s pub/sub service which is service bus

1.  Login to azure portal and search for service bus

![Service bus namespace](/blog/master-the-art-of-data-streamlining-with-innovative-pub-sub-pipelines/034285_38ca4c8b75fb4a699161719f26996d19_mv2.png)

Service bus namespace

2\. [Create](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal#create-a-namespace-in-the-azure-portal) a service bus namespace under standard pricing tier (allows us to create topics in the queue)

3\. After that create a [topic](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal#create-a-topic-using-the-azure-portal) inside the service bus namespace

![Topic](/blog/master-the-art-of-data-streamlining-with-innovative-pub-sub-pipelines/034285_24b6442d69444a19af67bf29c511429b_mv2.png)

Topic

4\. Now all that is left to do is create a [subscription](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal#create-subscriptions-to-the-topic) for the previously create topic

![Subscription for the topic](/blog/master-the-art-of-data-streamlining-with-innovative-pub-sub-pipelines/034285_85bee33a1f0d46b8964f0154baef2d0a_mv2.png)

Subscription for the topic

Optionally we can set the message lock duration or the maximum amount of time the message can be held by subscriber before lock on the message expires to 5 minutes (max for azure)

5\. Now we are all set to publish messages to the topic and having a subscriber process/consume it. To do that we can use the Azure SDK

6\. Obtain the access key from the portal to authenticate to the service

![Access key](/blog/master-the-art-of-data-streamlining-with-innovative-pub-sub-pipelines/034285_cf0a6aadc1aa4bddbd7b60be7d5f37f4_mv2.png)

Access key

7\. Create a publisher script which will publish messages to the topic

```python
from azure.servicebus import ServiceBusMessage, ServiceBusClient, ServiceBusSender
import traceback

NAMESPACE_CONNECTION_STR = "YOUR_CONN_STRING"
TOPIC_NAME = "YOUR_TOPIC_NAME"

def send_a_list_of_messages(sender: ServiceBusSender, *msgs):
    """Send list of msgs using the sender client

    Args:
        sender (ServiceBusSender): ServiceBusSender client
        msgs (tuple): List of msgs
    """
    # Create a list of messages
    messages = [ServiceBusMessage(str(msg)) for msg in msgs]
    # send the list of messages to the topic
    sender.send_messages(messages)

def send_messages_to_queue(*msgs , topic_name):
    """ Send a list of msgs to azure queue

    Args:
        msgs(tuple) : Tuple of msgs
    """
    try:
        servicebus_client = ServiceBusClient.from_connection_string(conn_str=NAMESPACE_CONNECTION_STR)
        with servicebus_client:
            # Get a Topic Sender object to send messages to the topic
            sender = servicebus_client.get_topic_sender(topic_name=topic_name)
            with sender:
                # Send a list of messages
                send_a_list_of_messages(sender, *msgs)

    except Exception as e:
        error_msg = f"Some error occured in the azure pub queue worker..{e} with stack trace \n {traceback.format_exc()}"

if __name__ == '__main__':
    message = {
        'job_id' : 1234,
        "process": 'some_text_that_needs_processing'
    }

    send_messages_to_queue(message, TOPIC_NAME)
```

[View the original GitHub Gist](https://gist.github.com/rahul-newtuple/9db093bcf0533d9599aee1c6f4e384ad)

8\. Create a subscriber that will keep listening to topic for a new message and process them as they arrive, that will keep processing long running jobs

```python
from azure.servicebus import ServiceBusClient, exceptions
import traceback

NAMESPACE_CONNECTION_STR = "YOUR_CONN_STRING"
TOPIC_NAME = "YOUR_TOPIC_NAME"
SUBSCRIPTION_NAME = "YOUR_SUBS_NAME"

def recieve_topic_msgs():
    """Recieve and process the azure queue msgs sychronously"""
    # Create a ServiceBusClient object.
    try:
        with ServiceBusClient.from_connection_string(NAMESPACE_CONNECTION_STR) as client:

            # Create a receiver for the queue.
            with client.get_subscription_receiver(TOPIC_NAME,subscription_name=SUBSCRIPTION_NAME) as receiver:
                while True:
                    # Fetch new messages.
                    # Note: This call is blocking, but will timeout after max_wait_time if no messages are available, which allows for graceful shutdown.
                    for msg in receiver.receive_messages():
                        try:
                            # Process each message.
                            receiver.complete_message(msg)
                        except ValueError as e:
                            print(f"Msg consumption failed enqueing back to queue..{e}" , exc_info=1)
                            receiver.abandon_message(msg)
                        except exceptions.MessageLockLostError as e:
                            print(f"Msg consumption failed skipping..{e}")
                            continue
    except Exception as e:
        error_msg = f"Some error occured in the azure subs queue worker..{e}"
        print(error_msg)

if __name__ == '__main__':
  recieve_topic_msgs()
```

[View the original GitHub Gist](https://gist.github.com/rahul-newtuple/9090c498420e7332874739be8eea090e)

And voilà, you have successfully created a pub/sub based data pipeline !

> The messages that exceed the lock time period can optionally be sent back the queue or send to dead letter queue.

> The messages will tried max delivery number of times before they are taken away or sent to dead letters if configured.

References:

[https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal)
