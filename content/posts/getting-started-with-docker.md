---
author: Lewis Denham-Parry
categories:
- docker
- getting started
date: 2017-05-17T19:12:25Z
description: ""
draft: false
image: /images/2017/05/docker_background.png
slug: getting-started-with-docker
tags:
- docker
- getting started
title: Getting Started With Docker
aliases:
    - "/getting-started-with-docker/"
---

Being an IT contractor, I usually find myself setting up a clients environment to get their project to work locally.  As these are setup by individuals, there is a lack of common practice to be able to get setup quickly and end up having to put the hot fixes in place that have been in place for years.

Initially I looked towards Docker as a way to create identical environments between Windows and Mac.  Once I understood the core concept of Docker I realised how useful it could be in any project.

Once the Docker configuration for a project is setup, a new user could have a local container setup, ready to go from 2 command lines.

Below is my first attempt at creating a Docker configuration for a simple Angular project.

# Docker

## Layered File System

* Docker is like a cake with multiple layers
* Writable file layer within container can be lost

## Volumes

* A directory associated to the container.
* Know as **data volume**
* These are persistent
* Alias to folder in docker host

#### docker-machine

```terminal
docker-machine ls
docker-machine start [machine-name]
docker-machine stop [machine-name]
docker-machine env [machine-name]
docker-machine ip [machine-name]
docker-machine status [machine-name]
```

### images

```terminal
docker pull [image-name]
docker images
docker rmi [image-id]
```

### container

```terminal
docker run [image-name]
docker ps -a
docker rm [container-id]
docker rm -v [container-id]
```

<table>
<thead>
<tr>
<th>Code</th>
<th>Explanation</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>-v</strong></td>
<td>Remove volume associated with container</td>
</tr>
</tbody>
</table>

### volume

```terminal
docker run -p 8080:3000 -v /var/www/ node
docker inspect [container-name]
docker run -p 8080:3000 -v $(pwd):/var/www/ node
docker run -p 8080:3000 -v $(pwd):/var/www/ node
docker run -p 8080:3000 -v $(pwd):/var/www/ -w "/var/www/" node npm start
docker run -i -t -p 8080:500 -v $(pwd):/app -w "/app" microsoft/aspnet:1.0.0-rc1-update1-coreclr /bin/bash
```

**NOTES**

<table>
<thead>
<tr>
<th>Code</th>
<th>Explanation</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>-p</strong></td>
<td>Port</td>
</tr>
<tr>
<td><strong>$(pwd)</strong></td>
<td>Current working directory on host</td>
</tr>
<tr>
<td><strong>-w</strong></td>
<td>Working directory on host</td>
</tr>
<tr>
<td><strong>-i</strong></td>
<td>Interactive mode</td>
</tr>
<tr>
<td><strong>-t</strong></td>
<td>Putty</td>
</tr>
<tr>
<td><strong>/bin/bash</strong></td>
<td>Bash script on VM</td>
</tr>
</tbody>
</table>

___

#### The Project
* [Docker Express](https://github.com/denhamparry/docker-express)

#### References
* [Docker Docs](https://docs.docker.com/)
* [Shayne Boyer: Configure Docker for Windows under Parallels](//tattoocoder.com/configure-docker-for-windows-under-parallels/)
* [Docker for Windows](https://docs.docker.com/docker-for-windows/#docker-settings)
