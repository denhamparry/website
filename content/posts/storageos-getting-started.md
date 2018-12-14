---
author: Lewis Denham-Parry
categories:
- docker
date: 2017-11-16T10:38:38Z
description: ""
draft: false
featured_image: /images/2017/11/StorageOS.svg
slug: storageos-getting-started
tags:
- docker
title: StorageOS and Docker - Getting Started
aliases:
    - "/storageos-getting-started/"
---

## Introduction

[StorageOS](//storageos.com)

Documenting the scripts used to get up and running with StorageOS.  Quotes will be added for **a-ha** moments.

## 00: Setup

* Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads).
* Install [Vagrant 1.9.3](https://vagrantup.com/downloads.html).
* Create a new directory to install the enviroment.
* Download the [Vagrantfile](https://docs.storageos.com/assets/Vagrantfile).
```bash
$ curl -sS https://docs.storageos.com/assets/Vagrantfile -o Vagrantfile
```
* Run `vagrant up` to provision three Ubuntu 16.04 VMs running Docker, the StorageOS container, and the StorageOS CLI.
```bash
$ vagrant up
```
* Connect onto one of the nodes post installation:
```bash
$ vagrant ssh storageos-1;
```

> If you've followed the steps within Setup, skip to **02: Provisioning Storage**.

## 01: Install StorageOS with Docker

> Storage can be spread across a cluster of Docker nodes.

### Setup each Node of the Cluster

* Enable Network Block Device kernel module:
```bash
$ sudo modprobe nbd nbds_max=1024
```
* Create a local directory to share volumes:
```bash
$ sudo mkdir -p /var/lib/storageos
```
* Configure Docker to use the StorageOS plugin:
```bash
$ sudo curl -o /etc/docker/plugins/storageos.json --create-dirs https://docs.storageos.com/assets/storageos.json
```
* Install StorageOS CLI:
```bash
$ curl -sSL https://github.com/storageos/go-cli/releases/download/0.0.13/storageos_linux_amd64 > /usr/local/bin/storageos
$ chmod +x /usr/local/bin/storageos
$ export STORAGEOS_USERNAME=storageos STORAGEOS_PASSWORD=storageos STORAGEOS_HOST=localhost
```
### Setup the Cluster
>StorageOS nodes need to know the exact cluster size and peers to connect to during start up. This enables nodes to contact each other over the network.
 
* Specify the expected size of the cluster (3 ,5 or 7) using the StorageOS CLI: 
```bash
CLUSTER_ID=$(storageos cluster create --size 3)
```
### Install containers
* The final step is to run the StorageOS container on each host.
 * Replace {{host}}, {{port}} and {{ipAddress}}.
```bash
$ docker -H {{host}}:{{port}} run -d --name storageos -e HOSTNAME=<<host>> -e ADVERTISE_IP={{ipAddress}} -e CLUSTER_ID=$CLUSTER_ID --net=host --pid=host --privileged --cap-add SYS_ADMIN --device /dev/fuse -v /var/lib/storageos:/var/lib/storageos:rshared -v /run/docker/plugins:/run/docker/plugins storageos/node:0.8.1 server
```
### Check Cluster Health
* The StorageOS CLI displays the status of the components nodes in the cluster:
```bash
$ storageos cluster health
```
* If they are any problems, check the Docker logs:
```bash
$ docker logs storageos
```
## 02. Provisioning Storage
> This is when I started to understand what StorageOS can offer.

* This requires the previous **01. Install StorageOS with Docker** to be setup.

* List the nodes of the Cluster:
```bash
$ storageos node ls --format "table {{.Name}}\t{{.Address}}\t{{.Capacity}}\t{{.CapacityUsed}}
```
* Once the cluster is established, StorageOS creates a default storage pool from all the nodes in the cluster:
```bash
$ storageos pool ls --format "table {{.Name}}\t{{.Nodes}}\t{{.Total}}\t{{.CapacityUsed}}"
```
* The pool's capacity should be about the three nodes' aggregated capacity.
* Inspect the pool for the full JSON configuration:
```bash
$ storageos pool inspect default
```
* You should see the name of the three hosts in the storage pool listed under controllerNames.
* Applications can create a StorageOS volume through the CLI, API or GUI. Try creating a volume:
```bash
$ storageos volume create myvol
```
* Since we didn't specify any specific size or storage features for the new volume, StorageOS uses the default settings. Let's find out what these settings are:
```bash
$ storageos volume ls --format "table {{.Name}}\t{{.Size}}\t{{.Location}}"
```
<table>
<tr>
<th style="width:25%">Field<th/>
<th>Description<th/>
</tr>
<tb>
<tr>
<td>NAMESPACE/NAME<td/>
<td>Namespaces help different projects or teams share a StorageOS cluster. Note that default refers to the default namespace that StorageOS created for myvol, rather than the default pool.<td/>
<tr/>
<tr>
<td>SIZE<td/>
<td>The default volume size is 5GB.<td/>
<tr/>
<tr>
<td>LOCATION <td/>
<td>Which host StorageOS provisioned the volume to.<td/>
<tr/>
<tb/>
</table>
* StorageOS volumes are thin provisioned, so storage is dynamically allocated to volumes as it is used. You can even provision volumes that are larger than the storage pool; try resizing the volume to 100GB:
```bash
$ storageos volume update --size 100 default/myvol
```
* Inspect the volume to check the size was updated in the JSON config:
```bash
$ storageos volume inspect default/myvol
```
* To use StorageOS volumes with containers, you use the standard Docker run command with some additional flags. Let's run a container with a shell so we can run commands inside the container:
```bash
$ docker run -it --volume-driver storageos --volume myvol:/data busybox sh
```
<table>
<tr>
<th style="width:25%">Field<th/>
<th>Description<th/>
</tr>
<tb>
<tr>
<td>--volume-driver storageos<td/>
<td>Tells Docker that StorageOS is managing these volumes.<td/>
<tr/>
<tr>
<td>--volume myvol:/data<td/>
<td>Instructs Docker to mount myvol to /data inside the container.<td/>
<tr/>
<tb/>
</table>
* View the data within the volume:
```bash
$ ls /data
```
* you should see lost+found, because StorageOS volumes are automatically formatted with a filesystem on creation. 
* Write data into a file:
```bash
$ echo "I'm writing some data to a StorageOS volume" > /data/myfile
```
* Exit the shell and the container:
```bash
$ exit
```
* Check that the data was persisted by mounting the volume on the host and reading the file:
```bash
$ storageos volume mount default/myvol /mnt
$ ls /mnt
$ cat /mnt/myfile
```
* The output should show the text that was previously written.
* Unmount the volume:
```bash
$ storageos volume unmount default/myvol
```
### Accessing storage across hosts
* StorageOS volumes are globally namespaced, meaning that any host can access the volumes.
* Mount myvol to a different host:
```bash
$ docker run -it --volume-driver storageos --volume myvol:/data busybox sh
```
* Check the container can see myfile: 
```bash
$ cat /data/myfile
```
---
## High Availability
* Labels are a mechanism for applying metadata to StorageOS objects. You can use them to annotate or organise your volumes in any way that makes sense for your organization or app.
* A label is a key-value pair that is stored as a string.
* Create a volume expected to run in a production environment:
```bash
$ storageos volume create --label env=prod testvol
```
* Inspect the volume to see the labels:
```bash
$ storageos volume inspect default/testvol
```
### Replicated Volumes
* Right now default/testvol resides on one node. You can find out the location:
#### Request
```bash
$ storageos volume ls --format "table {{.Name}}\t{{.Size}}\t{{.Replicas}}\t{{.Location}}"
```
#### Response
```bash
NAMESPACE/NAME      SIZE                REPLICAS            LOCATION
default/testvol     5GB                 0/0                 storageos-1 (healthy)
```
* If this node goes down, default/testvol will be unavailable. You can replicate the data to different nodes to ensure that default/testvol will still be available even if nodes fail.
* You can add, update or remove labels at any time. Replication is controlled by a special label, storageos.feature.replicas. Add a replica to testvol:
```bash
$ storageos volume update --label-add storageos.feature.replicas=1 default/testvol
```
### Architecture: Master and replicas
* StorageOS is based on a hybrid architecture, with a single master (which ensures deterministic performance) and distributed replicas (for high availability).
* See where StorageOS scheduled the master and replica to:
#### Request
```bash
$ storageos node ls --format "table {{.Name}}\t{{.Address}}\t{{.Volumes}}"
```
#### Response
```bash
NAME                ADDRESS             VOLUMES
storageos-1         192.168.50.100      M: 0, R: 0
storageos-2         192.168.50.101      M: 0, R: 0
storageos-3         192.168.50.102      M: 1, R: 0
```
* You can set 0-5 replicas per volume, which enables data to be protected against 0-5 node failures.
* Typically one replica is sufficient for testing or small deployments.



---

## References

[StorageOS Docker Guide](https://my.storageos.com/main/install-with-docker)