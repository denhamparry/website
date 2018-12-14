---
author: Lewis Denham-Parry
date: 2018-01-30T00:08:43Z
description: ""
draft: true
slug: c-apps-on-raspberry-pi
title: C# apps on Raspberry Pi
---

## References

* [First Faas python function](https://blog.alexellis.io/first-faas-python-function/)
* [QRcode - C#](https://github.com/faas-and-furious/qrcode-csharp)

```bash
$ curl 192.168.1.220:31112/function/qrcode -d "http://www.denhamparry.co.uk" > qrcode.png
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 1604k    0 1604k  100    28   321k      5  0:00:05  0:00:04  0:00:01  321k
```