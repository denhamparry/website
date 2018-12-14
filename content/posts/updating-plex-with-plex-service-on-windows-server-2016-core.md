---
author: Lewis Denham-Parry
categories:
- plex
- windows server 2016 core
date: 2017-11-14T10:14:56Z
description: ""
draft: false
image: /images/2017/11/plex-windowsserver2016.png
slug: updating-plex-with-plex-service-on-windows-server-2016-core
tags:
- plex
- windows server 2016 core
title: Updating Plex Media Server with Plex Service on Windows Server 2016 Core
aliases:
    - "/updating-plex-with-plex-service-on-windows-server-2016-core/"
---

* Download the latest [Plex Media Server](http://plex.tv/downloads/) installation file to the Windows Server.

```powershell
wget https://downloads.plex.tv/plex-media-server/1.9.7.4441-e5eb5d5a1/Plex-Media-Server-1.9.7.4441-e5eb5d5a1.exe -UseBasicParsing -OutFile Plex-Media-Server-1.9.7.4441.exe
```

* Open a Powershell window.
* Stop the Plex Service.

```powershell
Stop-Service -Name "PlexService"
```

* Execute the Plex setup file from command prompt.

```powershell
C:\Downloads> .\Plex-Media-Server-1.9.7.4441.exe
```

* Do not launch Plex Media Server after installation, if requested restart the server.
* Ensure that the Plex Media Server is not set to launch on login:

```powershell
Remove-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name "Plex Media Server"
```

* Start the Plex Service.

```powershell
Start-Service -Name "PlexService"
```