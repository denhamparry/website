---
author: Lewis Denham-Parry
categories:
- raspberry pi
- kubernetes
- setup
date: 2018-02-14T18:00:00Z
description: Setting up kubeadm and kubectl to manage Kubernetes and add Raspberry
  Pi nodes.
draft: false
image: /images/2018/02/IMG_1427.jpg
slug: setting-up-kubernetes-on-raspberry-pis-part-2
tags:
- raspberry pi
- kubernetes
- setup
title: Setting Up Kubernetes On Raspberry Pis - Part 2
---

> Following on from [Part 1](https://denhamparry.co.uk/setting-up-kubernetes-on-raspberry-pis-part-1/), we'll now look to setup kubeadm and kubectl to manage Kubernetes and add nodes.

## Install kubeadm

* Add repo lists & install kubeadm

```sh
$ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - && \
  echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list && \
  sudo apt-get update -q && \
  sudo apt-get install -qy kubeadm
```

* You now have two new commands installed:
  * kubeadm - used to create new clusters or join an existing one
  * kubectl - the CLI administration tool for Kubernetes
* Initialize your master node:

```sh
$ sudo kubeadm init --token-ttl=0
```

* We pass in **--token-ttl=0** so that the token never expires - do not use this setting in production. The UX for kubeadm means it's currently very hard to get a join token later on after the initial token has expired.

> Optionally also pass --apiserver-advertise-address=192.168.0.27 with the IP of the Pi.

* Note: This step will take a long time, even up to 15 minutes.

```sh
Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join --token a008af.51d17e7aaf5b51ab 192.168.1.220:6443 --discovery-token-ca-cert-hash sha256:4bda99158fd77c200e47fc327c5567cd665b294d95a8b53245bdb931f366d71b
```

* After the init is complete run the snippet given to you on the command-line:

```sh
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

* Save your join-token.
* Your join token is valid for 24 hours, so save it into a text file. Here's an example of mine:

```sh
kubeadm join --token a008af.51d17e7aaf5b51ab 192.168.1.220:6443 --discovery-token-ca-cert-hash sha256:4bda99158fd77c200e47fc327c5567cd665b294d95a8b53245bdb931f366d71b
```

* Check everything worked:

```sh
$ kubectl get pods --namespace=kube-system
NAME                                   READY     STATUS    RESTARTS   AGE
etcd-k8s-master-1                      1/1       Running   0          15m
kube-apiserver-k8s-master-1            1/1       Running   1          15m
kube-controller-manager-k8s-master-1   1/1       Running   0          16m
kube-dns-7b6ff86f69-gk2vj              0/3       Pending   0          16m
kube-proxy-x6mth                       1/1       Running   0          16m
kube-scheduler-k8s-master-1            1/1       Running   0          16m
```

* You should see the "READY" count showing as 1/1 for all services as above. DNS uses three pods, but will remain in **Pending** until  networking has been setup.

## Setup Networking

* Install Weave network driver

```sh
$ kubectl apply -f https://git.io/weave-kube-1.6
```

## Join other Nodes

* On the other RPis, repeat everything apart from **kubeadm init**.
* Join the cluster using the **kubeadm join**:

```sh
$ sudo kubeadm join --token a008af.51d17e7aaf5b51ab 192.168.1.220:6443 --discovery-token-ca-cert-hash sha256:4bda99158fd77c200e47fc327c5567cd665b294d95a8b53245bdb931f366d71b
```

* Once joined, go back to the Master and check connected nodes:

```sh
$ kubectl get nodes
NAME           STATUS    ROLES     AGE       VERSION
k8s-master-1   Ready     master    1h        v1.9.2
k8s-worker-1   Ready     <none>    8m        v1.9.2
```