---
author: Lewis Denham-Parry
categories:
- docker
- wordpress
- azure
date: 2017-11-14T11:31:29Z
description: ""
draft: false
featured_image: /images/2017/11/DockerWordPress.png
slug: wordpress-and-docker
tags:
- docker
- wordpress
- azure
title: Wordpress and Docker
aliases:
    - "/wordpress-and-docker/"
---

##Local Development

Investigation into using Wordpress with Angular, decided to spin up a Wordpress docker image to play about locally with.

```bash
docker pull wordpress
docker pull mysql:latest
```

```bash
docker run --name demo-mysql -e MYSQL_ROOT_PASSWORD=password -d mysql:tag
```

```bash
docker run --name demo-wordpress --link demo-mysql:mysql -p 4202:80 -d wordpress
```

---

##Deployment of WordPress and MySQL Containers with Docker Compose to Azure

<a href="//portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdocker-wordpress-mysql%2Fazuredeploy.json" target="_blank">
	<img src="//azuredeploy.net/deploybutton.png"/>
</a>

<a href="//armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdocker-wordpress-mysql%2Fazuredeploy.json" target="_blank">
    <img src="//armviz.io/visualizebutton.png"/>
</a>



[Azure Docker Extension](https://github.com/Azure/azure-docker-extension)



[Reference](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-wordpress-mysql)
