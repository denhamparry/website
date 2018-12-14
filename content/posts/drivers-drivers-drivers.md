---
author: Lewis Denham-Parry
date: 2018-01-05T18:05:22Z
description: ""
draft: true
slug: drivers-drivers-drivers
title: Drivers Drivers Drivers
---

## List PNP Device Names

```powershell
Get-WmiObject Win32_PnPSignedDriver  | SELECT DeviceName
```

## Check PNP Installation

```powershell
Get-PnpDevice -FriendlyName "Hauppauge WinTV-soloHD DVB"
Get-PnpDevice -FriendlyName "Hauppauge WinTV-soloHD DVB" | Disable-PnpDevice
Get-PnpDevice -FriendlyName "Hauppauge WinTV-soloHD DVB" | Enable-PnpDevice
```

## Delete Driver Version 1

```powershell
$drivers = Get-WindowsDriver -online  | Where-Object {$_.ClassName -eq “Media”}
foreach($driver in $drivers)
{
    pnputil -f -d $driver.Driver
}
```

## Delete Driver Version 2

```powershell
$x=Get-WmiObject Win32_PnPSignedDriver -filter "DeviceName='Hauppauge WinTV-soloHD DVB'"
$x.Delete()
```


## Delete Driver Version 3

```powershell
$drivers = Get-WmiObject Win32_PnPSignedDriver -filter "DeviceName='Hauppauge WinTV-soloHD DVB'"
foreach($driver in $drivers)
{
    pnputil -f -d $driver.Driver
}
```

## Output

```powershell
PS C:\Users\Administrator\Downloads> $drivers = Get-WmiObject Win32_PnPSignedDriver -
filter "DeviceName='Hauppauge WinTV-soloHD DVB'"
>> foreach($driver in $drivers)
>> {
>>     pnputil /delete-driver $driver.InfName /force
>> }
PS C:\Users\Administrator\Downloads> Get-PnpDevice -FriendlyName "Hauppauge WinTV-sol
oHD DVB"

Status     Class           FriendlyName
------     -----           ------------
Unknown    MEDIA           Hauppauge WinTV-soloHD DVB


PS C:\Users\Administrator\Downloads> $x=Get-WmiObject Win32_PnPSignedDriver -filter "
DeviceName='Hauppauge WinTV-soloHD DVB'"
>> $x
PS C:\Users\Administrator\Downloads>

PS C:\Users\Administrator\Downloads> $x=Get-WmiObject Win32_PnPSignedDriver -filter "
DeviceName='Hauppauge WinTV-soloHD DVB'"
>> $x
```