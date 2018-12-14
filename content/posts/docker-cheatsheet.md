---
author: Lewis Denham-Parry
date: 2017-11-14T10:30:54Z
description: ""
draft: true
slug: docker-cheatsheet
title: Docker Cheatsheet
---

## Docker Example

```bash
$ docker pull ghost
$ docker run -d --name some-ghost -p 3001:2368 ghost
```

## Delete Unused Docker Images

```bash
$ docker images -q |xargs docker rmi
```

## Delete Unused Docker Containers

```bash
$ docker ps -q |xargs docker rm
```
```powershell
PS C:\> docker rm $(docker ps -a -q)
```

## View Logs for Docker Container

[Docker Docs](https://docs.docker.com/engine/reference/commandline/logs/)

```bash
$ docker logs --details {{container}}
```
