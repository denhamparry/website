---
author: Lewis Denham-Parry
categories:
- docker
- azure
date: 2017-11-14T10:21:26Z
description: ""
draft: false
featured_image: /images/2017/11/docker-azure.png
slug: console-log-message-colour
tags:
- docker
- azure
title: Deploy Custom Docker Image to Azure Web App
aliases:
    - "/console-log-message-colour/"
---

Requires [Azure Cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) to be installed.

* Deployment in Azure via Azure Cli:

```bash
az group create --name HoneyBadgerResourceGroup --location "West Europe"
```

```bash
az appservice plan create --name HoneyBadgerServicePlan --resource-group HoneyBadgerResourceGroup --sku B1 --is-linux
```

```bash
az webapp create --resource-group HoneyBadgerResourceGroup --name HoneyBadgerApp --plan HoneyBadgerServicePlan --deployment-container-image-name denhamparry/honeybadger:latest
```

* Delete resource group:

```bash
az group delete --name HoneyBadgerResourceGroup --no-wait --yes -y
```
