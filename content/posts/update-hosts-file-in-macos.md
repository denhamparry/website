---
author: Lewis Denham-Parry
categories:
- hosts
- macOS
- nano
- dns
date: 2017-11-17T09:34:26Z
description: ""
draft: false
image: /images/2017/11/hosts.jpg
slug: update-hosts-file-in-macos
tags:
- hosts
- macOS
- nano
- dns
title: Update Hosts file in MacOS
aliases:
    - "/update-hosts-file-in-macos/"
---

* Open the Hosts file with nano:

```bash
$ sudo nano /etc/hosts
```

* Add the mapping and close nano with ==ctrl== and ==x==.

* Flush the DNS:

```bash
$ sudo killall -HUP mDNSResponder
```