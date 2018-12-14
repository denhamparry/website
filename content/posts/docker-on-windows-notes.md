---
author: Lewis Denham-Parry
date: 2017-11-20T22:34:58Z
description: ""
draft: true
slug: docker-on-windows-notes
title: Docker On Windows - Notes
---

Notes whilst reading [Docker on Windows](https://blog.sixeyed.com/docker-on-windows-the-book/) by [Elton Stoneman](https://twitter.com/EltonStoneman).
## Chapter One
* [Play with Docker](https://dockr.ly/play-with-docker)
* [Docker for Windows](https://dockr.ly/docker-for-windows)
* Get Docker version:

```powershell
docker version
```

* Run Docker whale ASCII art:

```powershell
docker container run dockeronwindows/ch01-whale
```

* Secure Docker Service connection with the client using TLS:

```powershell
$ipAddress = '192.168.1.100'
mkdir -p C:\certs\client\
docker container run --rm `
--env SERVER_NAME=$(hostname) `
--env IP_ADDRESSES=127.0.0.1,$ipAddress `
--volume 'C:\ProgramData\docker:C:\ProgramData\docker' `
--volume 'C:\certs\client:C:\Users\ContainerAdministrator\.docker' `
stefanscherer/dockertls-windows
Restart-Service docker
```

* Connect to remote Docker Service:

```powershell
$env:DOCKER_HOST='tcp://192.168.1.100:2376'
$env:DOCKER_TLS_VERIFY='1'
$env:DOCKER_CERT_PATH='/users/denhamparry/Certificates/DenhamParryHome/'
docker ps -a
```

* **Note** Port needs to be opened:

```powershell
netsh advfirewall firewall add rule name="Open Port 2376" dir=in action=allow protocol=TCP localport=2376
```

---

## CHAPTER TWO

* Filter images.

```powershell
docker images --filter reference=denhamparry/ch02-dotnet-helloworld
```

### Multistage Builds (TODO)

* --build-arg can override values in Dockerfile, e.g:

```yml
...
ARG ENV_NAME=DEV
...
```

```powershell
docker image build --build-arg ENV_NAME=TEST -t denhamparry/ch02-static-website .
docker container run --detach --publish 80 denhamparry/ch02-static-website
Invoke-WebRequest 192.168.1.51:46315
```

* The above would change *ENV_NAME* value from **DEV** to **TEST**.
* -P to publish, -p to manage ports (e.g. -p 80:80).
* Docker images can run in seperate containers, sharing the container data structure whilst having their own writable layer.
* This writeable layer ammends existing files by creating new files in their writeable layer, hiding the origianl file in the image layer.

### Volumes

* Powershell to write new file:

```powershell
echo " * NEW FILE * ' > C:\app\log\newfile.txt
```

* Powershell to update existing file:

```powershell
echo " -UPDATE- ' >> C:\app\log\newfile.txt
```

* Image has volume built in, write txt file on run.

```powershell
docker container run --name source denhamparry/ch02-volumes "echo 'start' > C:\app\logs\log-1.txt"
```

* Run a new container from **source**, txt file is read/writeable.

```powershell
docker container run -it --volumes-from source denhamparry/ch02-volumes
```

* Run a new container from **source** with **ro**, txt file is read only.

```powershell
docker container run -it --volumes-from source:ro denhamparry/ch02-volumes
```

* Get volume file location on host.

```powershell
docker container inspect --format '{{ json .Mounts }}' source | ConvertFrom-Json

Type        : volume
Name        : b3f9f7a27535420421f3e26514952a6d9316b8de9c7c5156ab5a32cba7bb9e3d
Source      : C:\ProgramData\docker\volumes\b3f9f7a27535420421f3e26514952a6d9316b8de9c7c5156ab5a32cba7bb9e3d\_data
Destination : c:\app\config
Driver      : local
Mode        :
RW          : True
Propagation :

Type        : volume
Name        : 1ad5ef1c6dbf7b4bd7b01d0bdd522051d835f922aaf58c2ada5e17485b3e7309
Source      : C:\ProgramData\docker\volumes\1ad5ef1c6dbf7b4bd7b01d0bdd522051d835f922aaf58c2ada5e17485b3e7309\_data
Destination : c:\app\logs
Driver      : local
Mode        :
RW          : True
Propagation :

```

* Using the output directory, you can access the files on the host.
* Volumes can be mapped to host directories:

```powershell
docker container run --volume C:\app-config:C:\app\config denhamparry/ch02-volumes cat C:\app\config\version.txt
```

### Volumes for configuration and state

### Packaging a traditional ASP.NET web app as a Docker image

> In IIS on a VM, you'd normally have a dedicated application pool for each website in order to isolate processes from each other.  But in a containerised app, there will be only one website running - another website would be in another container, so we already have isolation, and each container can use the default application pool without worrying about an interface.

### IIS Logging

* IIS logging can be written to the Docker console from IIS.

### Enviroment Variables

```yml
ENV A01_KEY A01 value
ENV A02_KEY="A02 value" `
    A03_KEY="A03 value"
```

* Settings added to the Dockerfile with **ENV** become part of the image, so every container you run from the image will have these values set.

* When running a Docker container, you can either add or replace the Enviroment variable.

```powershell
docker container run --env ENV_01='Hello' `
--env ENV_02='World' `
microsoft/nanoserver `
powershell 'Write-Output $env:ENV_01 $env:ENV_02'
```

* Run an image overriding enviroment variables:

```powershell
docker container run -d -P --name iis-env0 `
denhamparry/ch03-iis-enviroment-variables

docker container run -d -P --name iis-env1 `
-e A01_KEY='New Value!' `
-e B01_KEY='New Key!' `
denhamparry/ch03-iis-enviroment-variables
```

* Get IP address from container and open a browser:
 
```powershell
$ip = docker inspect --format '{{ .NetworkSettings.Networks.nat.IPAddress }}' iis-env0
(Invoke-WebRequest "$ip" -UseBasicParsing).content

$ip = docker inspect --format '{{ .NetworkSettings.Networks.nat.IPAddress }}' iis-env1
(Invoke-WebRequest "$ip" -UseBasicParsing).content
```

### Healthchecks

> Return **0** for healthy, **1** for unhealthy.

* Powershell script to check if website is returning 200 status:

```powershell
try { `
    $response = iwr http://localhost/diagnostics 
    -UseBasicParsing; `
    if ($response.StatusCode -eq 200) { `
        return 0} `
    else {return 1}; `
} catch { return 1 }
```

* Example of this working:

```powershell
docker run -d -P --name healthcheck `
dockeronwindows/ch03-iis-healthcheck
$ip = docker inspect {{ .NetworkSettings.Networks.nat.IPAddress }} healthcheck
iwr "http://$ip/toggle/unhealthy" -UseBasicParsing -Method Post
iwr "http://192.168.1.51:52742/toggle/unhealthy" -UseBasicParsing -Method Post
```

## CHAPTER FOUR

* Update hosts file via Powershell:

```powershell
Add-Content -Path 'C:\Windows\System32\drivers\etc\hosts' -Value '192.168.1.51 registry.local'
```