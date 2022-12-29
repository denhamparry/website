---
author: Lewis Denham-Parry
date: 2017-11-18T10:06:28Z
description: ""
draft: false
featured_image: /images/2018/02/openssh.png
slug: setting-up-openssh-on-windows-server-2016
title: Setting up OpenSSH on Windows Server 2016
aliases:
    - "/setting-up-openssh-on-windows-server-2016/"
---

* Download the latest --zip-- file from [Github](https://github.com/PowerShell/Win32-OpenSSH/releases)
  * Run script on server to download the file:

```powershell
PS C:\> Invoke-WebRequest https://githu
b.com/PowerShell/Win32-OpenSSH/releases/download/v0.0.22.0/OpenSSH-Win64.zip -OutFile openssh.zip
```

* Extract the files from the zip file:

```powershell
PS C:\> Expand-Archive .\openssh.zip 'C:\Program Files\'
```

* Update the Enviroment Path:

```powershell
PS C:\> ($env:path).split(“;”)
PS C:\> $oldpath = (Get-ItemProperty -Path ‘Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment’ -Name PATH).path
PS C:\> $newpath = “$oldpath;C:\Program Files\OpenSSH-Win64\”
PS C:\> Set-ItemProperty -Path ‘Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment’ -Name PATH -Value $newPath
```

  * Can use the following command to create a temporary path:
  ```PS C:\> powershell
  $env:path+='c:this'
  ```

* Restart Powershell / Server for changes to take effect.
* Confirm that OpenSLL is listed within the enviroment path:


```powershell
PS C:\> ($env:path).split(“;”)
```

* Open Powershell and set the current directory to OpenSSL:

```powershell
PS C:\> cd 'C:\Program Files\OpenSSH-Win64\'
```

* Execute the --.\install-sshd.ps1-- script:

```powershell
PS C:\Program Files\OpenSSL-Win64> .\install-sshd.ps1
```

* Generate SSH host-key:

```powershell
PS C:\Program Files\OpenSSL-Win64> .\ssh-keygen.exe -A
```

* Start the SSHD service:

```powershell
PS C:\> Start-Service -Name sshd
```

* Set the service to start on boot:

```powershell
PS C:\> Set-Service -Name "sshd" -StartupType automatic
PS C:\> Get-WMIObject win32_service -Filter "name = 'sshd'"
PS C:\> Get-WMIObject win32_service | Format-Table Name, StartMode -auto
```

* Open up the Firewall port for SSH:

```powershell
PS C:\> netsh advfirewall firewall add rule name="Open Port 22" dir=in action=allow protocol=TCP localport=22
```

## References

* [Install OpenSSH](https://github.com/PowerShell/Win32-OpenSSH/wiki/Install-Win32-OpenSSH)
* [Chocolatey OpenSSH](https://chocolatey.org/packages/openssh)
* [PSTools](https://docs.microsoft.com/en-gb/sysinternals/downloads/pstools)
* [Powershell OpenSSH](https://github.com/PowerShell/Win32-OpenSSH/releases/tag/v0.0.22.0)
* [Powershell make a permanent change to the path environment variable](https://codingbee.net/tutorials/powershell/powershell-make-a-permanent-change-to-the-path-environment-variable)
* [Use Powershell to modify your enviromental path](https://blogs.technet.microsoft.com/heyscriptingguy/2011/07/23/use-powershell-to-modify-your-environmental-path/)
* [Powershell Set Service](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/set-service?view=powershell-5.1)
* [How do I open ports with Powershell](https://blogs.msdn.microsoft.com/timomta/2016/11/04/how-do-i-open-ports-with-powershell/)
