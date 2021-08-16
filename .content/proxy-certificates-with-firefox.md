---
author: Lewis Denham-Parry
categories:
- firefox
- proxy
- https
date: 2017-06-30T06:45:38Z
description: ""
draft: false
featured_image: /images/2017/06/firefox-independent-1200.5bd827ccf1ed.jpg
slug: proxy-certificates-with-firefox
tags:
- firefox
- proxy
- https
title: Proxy certificates with Firefox
aliases:
    - "/proxy-certificates-with-firefox/"
---

Within some companies, proxies are rife.  Regardless how you feel about them you have to get past the pain of setting up services that don't work well with the proxy (not usually at fault of the service) by not giving you any indication as to what happened.

This happened with me and Firefox.  Setting up a new machine at a new contract, all the other browsers work fine except for Firefox.  After recently listening to a talk about invalid certificates I realised that this was the issue when trying to load any secure website.

To resolve, you need to add the certificate to within the Certificate Authorities within Firefox. **Be aware, bad things could possibly happen if you register a bad certificate.  Only do this if you personally trust the certificate source**  These are the steps I took to resolve the issue:
 
* Go to *Settings > Options > Advanced  > Certificates > View Certificates*
* Click *Servers > Add Exception*
* Go to a HTTPS url (e.g. [https://addons.cdn.mozilla.net](https://addons.cdn.mozilla.net))
    * Note: It appears some certificates are white listed and will pass successfully on the tested proxy.  Search for a url with a certificate that fails
* Click *View* and the *Issued By* dialog should have a common name thats not linked to the website e.g. *Websense Production*
* Click *Details* and *Export*, save the (PEM) file locally
* Go back to *Certificate Manager > Authorities* and click *Import*
* Import the locally saved certificate from the previous step
* Select all the trusts and click *Ok*
* Restart Firefox

#### References

[Mozilla support](https://support.mozilla.org/en-US/questions/1089956)