---
author: Lewis Denham-Parry
categories:
- Ubnt
- Networking
date: 2017-05-16T16:10:04Z
description: A guide to setting up Ubnt devices at home with decision process of purchasing
  the equipment to setting up with Sky Fibre and not looking back.
draft: false
image: /images/2017/05/unifi.jpg
slug: setting-up-a-home-network-with-ubnt
tags:
- Ubnt
- Networking
title: Setting Up A Home Network With Unifi
aliases:
    - "/setting-up-a-home-network-with-ubnt/"
---

For the last 5 years I've been using an Apple TimeCapsule as my router and wifi base.  The decision to use this was for:

1. TimeCapsule backups.
2. Extending wifi networks with Airport Express.
3. It wasn't included with the broadband package I signed up for.
4. The UI looked pretty and easy to use.

During this time, I upgraded the device (with the replaced devices being handed down to family members), I setup a home VPN to play FIFA on my Xbox One remotely and started to notice the wifi cutting out more often.

With the rise of internet connected devices within my house, serving everything from media, home security and someone to talk to whilst cooking (Alexa) I wanted to find a stable solution that was more modular.  I liked the idea of being able to have devices with specific uses that could be managed and upgraded independently over time.

## Solution - Ubnt / Unifi / 

After looking at a couple off the shelve solutions, and Apple no longer producing what I was used to, I found Ubnt thanks to numerous tech bloggers talking about it.

Speaking with a few friends who deal with networks on a professional day to day basis, the overall response was to get it.

## Investment

![Ubnt Devices](/content/images/2017/05/UniFiDevices.jpg)

With help from one of the friends, I purchased the following devices:

* UniFi Security Gateway
* UniFi Switch 8
* UniFi AP AC Pro
* UniFi Hybrid Cloud

The cost element of these 4 devices was a concern.  Would I see the benefit of it?  Could I spend my money better elsewhere?  Am I just going through a phase?

## Notes

I've had an issue with the USG upgrading and having an issue with the *config.gateway.json* file.

The fix was to remove the *config.gateway.json* file, restart the USG and then setting the *dhcp-client-identifier* (due to the provider being Sky Fibre in the UK), and then creating a new *config.gateway.json* file by connecting to the USG via SSH and executing the following command:

```terminal
mca-ctrl -t dump-cfg
```

The *config.gateway.json* is located on the controller.