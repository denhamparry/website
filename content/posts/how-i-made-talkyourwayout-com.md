---
author: Lewis Denham-Parry
date: 2017-09-23T08:48:53Z
description: ""
draft: true
slug: how-i-made-talkyourwayout-com
title: How I made TalkYourWayOut.com
---

* Created an Azure app service account.
* Created a project on VSTS.
* Created a new ASPNET Core 2.0 app.

```command
dotnet new mvc
```

* Setup GitFlow on Git.
* Check in Init.
* Setup continuous delivery.
* Added to project to minify files.

``` command
dotnet add package BuildBundlerMinifier
```

* Setup Cloudflare.
* Setup Google Mail for email accounts.
* Bind URL in webapp once IP address has updated
* Create view model for talk and slide
* Pull through images and data from view model in Riot
* Setup HTTPS on the site
* Fix slide resolution
* Added Azure Blob Storage with images accessed from folder directory
* Tested SignalR Core on a random page as proof of concept
* Setup Git repo on VM
* Add application insights via VS 2017

-- To Do

* Add application insight error handling
* Make chat specific to application
* Migrate application into a container