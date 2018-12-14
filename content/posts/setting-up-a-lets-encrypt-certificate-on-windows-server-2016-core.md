---
author: Lewis Denham-Parry
categories:
- lets encrypt
- windows server 2016 core
- certificates
- pfx
- powershell
- iis
date: 2017-11-16T17:47:48Z
description: ""
draft: false
image: /images/2017/11/letsencrypt.png
slug: setting-up-a-lets-encrypt-certificate-on-windows-server-2016-core
tags:
- lets encrypt
- windows server 2016 core
- certificates
- pfx
- powershell
- iis
title: Setting up a Lets Encrypt Certificate on Windows Server 2016 Core
---

I wanted to use Lets Encrypt to create certificates for my home server.  Once created I've exported a .pfx file so that I can reuse the certificate in third party services.

### Install IIS and Web Application Development Windows Feature

```powershell
PS C:\> Install-WindowsFeature -Name Web-Server
PS C:\> Install-WindowsFeature -Name Web-App-Dev -IncludeAllSubFeature 
```

### Add Domain Binding to Default Web Site

```powershell
PS C:\> New-WebBinding -Name "Default Web Site" -IPAddress "*" -Port 80 -HostHeader newsite.ljdp.co.uk
```

### Setup Certify

* Install [Certify](https://certifytheweb.com).
* Create Certificate using Certify.UI.Exe.

### Get Certificate Thumbprint

```powershell
PS C:\> GET-PSPROVIDER
PS C:\> GET-PSDRIVE
PS C:\> SET-LOCATION CERT: ; DIR
PS Cert:\> SET-LOCATION LOCALMACHINE ; DIR
PS Cert:\LOCALMACHINE> SET-LOCATION MY ; DIR
```

### Configure RDP to use Certificate

* Replace `{{THUMBPRINT}}` with thumbprint from previous step.

```powershell
PS C:\> $path = (Get-WmiObject -class "Win32_TSGeneralSetting" -Namespace root\cimv2\terminalservices -Filter "TerminalName='RDP-tcp'").__path
PS C:\> Set-WmiInstance -Path $path -argument @{SSLCertificateSHA1Hash="{{THUMBPRINT}}"}
```

### Export Certificate

```powershell
PS C:\> $mypwd = ConvertTo-SecureString -String "Gfj422m;dfwfw" -Force -AsPlainText
PS C:\> Get-ChildItem -Path cert:\localMachine\my\88D4R80945EBDA2DFC64143350BF47B47B3AE728 | Export-PfxCertificate -FilePath C:\mypfx.pfx -Password $mypwd
```
---

## References
[Install IIS or any Role and Feature](https://letitknow.wordpress.com/2012/10/22/install-iis-or-any-role-and-feature-on-windows-server-2012-with-powershell/)
[Working with Certificates in Powershell](https://blogs.technet.microsoft.com/scotts-it-blog/2014/12/30/working-with-certificates-in-powershell/)
[Configure custom SSL Certificate for RDP on Windows Server](https://serverfault.com/questions/444286/configure-custom-ssl-certificate-for-rdp-on-windows-server-2012-in-remote-admini)
[Export PFX Certificate](https://docs.microsoft.com/en-us/powershell/module/pkiclient/export-pfxcertificate?view=win10-ps)