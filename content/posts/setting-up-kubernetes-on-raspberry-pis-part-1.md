---
author: Lewis Denham-Parry
categories:
- raspberry pi
- setup
date: 2018-02-13T19:00:00Z
description: Part one of setting up Kubernetes on Raspberry Pi's focusing on preparing
  the Pi's.
draft: false
image: /images/2018/02/UNADJUSTEDNONRAW_thumb_3b58-1.jpg
slug: setting-up-kubernetes-on-raspberry-pis-part-1
tags:
- raspberry pi
- setup
title: Setting Up Kubernetes On Raspberry Pis - Part 1
---

> This post is focused on preparing the Raspberry Pi's prior to setting up Kubernetes.

Go back to [Part 0](https://denhamparry.co.uk/kubernetes-cluster-with-arm-raspberry-pi/) or forward to [Part 2](https://denhamparry.co.uk/setting-up-kubernetes-on-raspberry-pis-part-2/)

## Setup Raspberry Pi

### Download Raspbian Stretch Lite

* Download latest version of [RASPBIAN STRETCH LITE](https://www.raspberrypi.org/downloads/raspbian/)

### Setup SD Cards

* Burn to SD card using [ETCHER](https://etcher.io)

### Boot into Pi

* Boot up the pi.
* Login:
  * username: pi
  * password: raspberry
* Change the default password.
  * Open the **Raspberry Pi Configuration Tool**.
  * Select **Change User Password** and follow instructions.

### Update Hostname

```sh
$ sudo raspi-config
```

* Open the **Raspberry Pi Configuration Tool**.
* Select **Network Options** > **Hostname**. 
* Change the hostname (e.g. k8s-master-1)

### Enable SSH

```sh
$ sudo raspi-config
```

* Open the **Raspberry Pi Configuration Tool**.
* Select **Interfacing Options** > **SSH**.
* Select **Yes**.

### Restart the Rashberry Pi

```sh
$ sudo reboot
```

### Setup a Static IP

> We want to setup static IPs so we know what to SSH into.  Either set this up on your DHCP server or/and locally on the Pi.

* Open the DHCP config file:

```sh
$ cat >> /etc/dhcpcd.conf
```

* Paste the following code:

```sh
profile static_eth0
static ip_address=192.168.123.100/24
static routers=192.168.123.1
static domain_name_servers=8.8.8.8

interface eth0
fallback static_eth0
```

> Change static IP address for each Raspberry Pi.

* Type **Ctrl** and **d**.

### Install Docker

* Install the latest version of Docker:

```sh
$ curl -sSL get.docker.com | sh && \
  sudo usermod pi -aG docker
```

* Add current user to Docker group

```sh
$ sudo usermod -aG docker pi
```

### Install Git

* Install git now on the master if you want to manage yaml files locally:

```sh
$ sudo apt-get install git-core
```

### Disable Swap

* For Kubernetes 1.7 and newer you will get an error if swap space is enabled.

* Check for entries:

```sh
$ sudo swapon --summary
```

* Turn off swap:

```sh
$ sudo dphys-swapfile swapoff && \
  sudo dphys-swapfile uninstall && \
  sudo update-rc.d dphys-swapfile remove
```

* This should now show no entries:

```sh
$ sudo swapon --summary
```

### Edit **/boot/cmdline.txt**

* Open the **cmdline.txt** file with an editor:

```sh
$ sudo nano /boot/cmdline.txt
```

* Add this text at the end of the line, but don't create any new lines:

```sh
 cgroup_enable=cpuset cgroup_memory=1
```

### Reboot!

* Make sure you reboot before proceeding.

```sh
$ sudo reboot
```

### Update Your Pi!

* Lets make sure we're keeping the Pi up to date.
* First, update your system's package list by entering the following command:

```sh
$ sudo apt-get update
```

* Next, upgrade all your installed packages to their latest versions with the command:

```sh
$ sudo apt-get dist-upgrade
```

> Continue to [Part 2](https://denhamparry.co.uk/setting-up-kubernetes-on-raspberry-pis-part-2/)

## References 

* [Updating Raspberry Pi](https://www.raspberrypi.org/documentation/raspbian/updating.md)