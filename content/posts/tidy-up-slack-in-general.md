---
author: Lewis Denham-Parry
categories:
- slack
- node js
date: 2018-06-14T05:51:36Z
description: ""
draft: false
image: /images/2018/06/slack-1.jpg
slug: tidy-up-slack-in-general
tags:
- slack
- node js
title: Tidy up Slack (in General)
aliases:
    - "/tidy-up-slack-in-general/"
---

[Salman](https://twitter.com/soulmaniqbal), [Aled](https://twitter.com/Aled_James9) and I have been busy setting up a new technology community, [Cloud Native Wales](https://blog.cloudnativewales.io).  We're looking to go live and invite people to use some of our tools, but realise that we've been using the **#general** a bit too much and want to remove some of the rubbish prior to going live.

Since then, we've found out that **#general** is a privileged channel, and it's difficult to bulk delete all the messages.  Luckily, we found a way to fix it!

## Setup

### Prerequisite

- Install [Node.js](https://nodejs.org/).
- Download a copy of [delete-channel-messages.js](https://gist.githubusercontent.com/firatkucuk/ee898bc919021da621689f5e47e7abac/raw/8c3b420fe3e334d740957a229937cdcbd10c0063/delete-channel-messages.js).
- Generate a [Slack token](https://api.slack.com/custom-integrations/legacy-tokens).
- Get the Slack Channel Id.
    - Go to your Slack channel URL, for example:
        - [https://mycompany.slack.com/messages/general]()
    - The url will be redirected with your Channel Id:
        - [https://mycompany.slack.com/messages/E31C53LEB/]()
    - The Channel Id in the example would be `E31C53LEB`.

## Delete Messages

1. Update *delete-channel-messages.js* with your **Token** and **Channel Id**.
1. Start the script:

```sh
sh node delete-channel-messages.js
1528955344.000153 deleted!
```

## References

- [Cleaning all messages on a Slack channel](https://medium.com/@jjerryhan/cleaning-all-messages-on-slack-channel-c46d71615c9a)