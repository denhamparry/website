---
author: Lewis Denham-Parry
date: 2017-07-14T19:46:28Z
description: ""
draft: true
slug: installing-windows-server-2016
title: Installing Windows Server 2016
---

## Step Through

1) Create Bootable USB
2) Install Windows Server 2016
3) Setup server
* sconfig (just to see)
* powershell
* Set-DisplayResolution 1280 720
* tzutils /l
* Set-TimeZone "<<timezone>>"
* Set-Date -Date "2017/07/14 21:12:53"
* Get-NetIPAddress
* Get-NetIPAddress -InterfaceAlias ethernet

--- skipped ---

* hostname
* Get-Content env:computername
* Rename-Computer -NewName DenhamParryFile -restart

--- skipped ---

* Get-NetFirewallRule
* Get-NetFirewallRule | ft
* Get-NetFirewallRule -Name corenet-igmp-in
* Get-NetFirewallRule -Name corenet-igmp-out
* Get-NetFirewallRule -Name corenet-igmp-in | Enable-NetFirewallRule
* Get-NetFirewallRule -Name corenet-igmp-out | Enable-NetFirewallRule
* Get-NetFirewallRule | ft displayname, displaygroup
* Get-NetFirewallRule | ft displaygroup
* Enable-NetFirewallRule -DisplayGroup "file and printer sharing"

## Share Folders

* New-SmbShare -Name "VMSFiles" -Path "C:\ClusterStorage\Volume1\VMFiles" -FullAccess "Contoso\Administrator", "Contoso\Contoso-HV1$"

New-SmbShare -Name "Parallels" -Path "C:\Parallels" -FullAccess "Administrator", "Lewis"

* Remove-SmbShare -Name "VMSFiles"

## Program List

* Get-ItemProperty HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* | Select-Object DisplayName, DisplayVersion, Publisher, InstallDate | Format-Table –AutoSize

List all programs

* Get-WmiObject -Class Win32_Product | Select-Object -Property Name

Uninstall Program

* $app = Get-WmiObject -Class Win32_Product | Where-Object {
$_.Name -match “HP ProLiant Health Monitor Service (X64)”
}
* $app.Uninstall()

Uninstall Programs

*$programs = @(“program1”, “program2”, “program3”)
* foreach($program in $programs){
$app = Get-WmiObject -Class Win32_Product | Where-Object {
$_.Name -match “$program”
}
$app.Uninstall()
}

## Local Users

``` powershell
Get-LocalUser -Name "lewis"
Set-LocalUser -Name "lewis" -Password "" -PasswordNeverExpires 1
```

## Notes

cls - clear screen
powershell - use powershell

## IIS 

### Add Web Application Development Windows Feature
```powershell
Install-WindowsFeature Web-App-Dev -IncludeAllSubFeature
```

### Add IIS Binding with Powershell

```powershell
New-WebBinding -Name "Default Web Site" `
-IPAddress "*" `
-Port 80 -HostHeader test.site.com `
-PhysicalPath 'c:\nerd-dinner' `
-ApplicationPool '.NET v4.5'
```

### Remove Website from IIS with Powershell

```powershell
Remove-Website -Name 'Default Web Site'; `
```

## Download Files

```powershell
Invoke-WebRequest https://githu
b.com/PowerShell/Win32-OpenSSH/releases/download/v0.0.22.0/OpenSSH-W
in64.zip -OutFile openssh.zip
```

## ZIP

```powershell
Expand-Archive c:\a.zip -DestinationPath c:\a
```

## Env Commands

```powershell
$env:computername
($env:path).split(“;”)
```

## List all install programs

Get-WmiObject -Class Win32_Product | Select-Object -Property Name

## References 



[USB setup / DiskPart for partition](https://channel9.msdn.com/Blogs/ITProGuru/Create-Bootable-Windows-Server-2016-USB-Installation-Drive-Step-by-step)

[Plex Setup](http://www.lowefamily.com.au/2016/10/23/how-to-install-plex-media-server-on-windows-10-and-windows-server-2016/)

[Remote Desktop Setup](http://www.tomsitpro.com/articles/enable-remote-desktop-in-windows-server-2016,2-1102.html)

[Setup Shared Folders](https://technet.microsoft.com/en-us/itpro/powershell/windows/smbshare/new-smbshare?f=255&MSPPError=-2147217396)

[MakeMKR](http://www.makemkv.com/download/)

[Remove Programs with Powershell](http://lifeofageekadmin.com/how-to-uninstall-programs-using-powershell/)

[List of installed programs](https://www.howtogeek.com/165293/how-to-get-a-list-of-software-installed-on-your-pc-with-a-single-command/)

[Add a binding to an IIS site using Powershell](https://serverfault.com/questions/560037/add-a-binding-to-an-iis-site-using-powershell)
