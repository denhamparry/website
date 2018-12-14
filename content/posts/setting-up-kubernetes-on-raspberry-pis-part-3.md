---
author: Lewis Denham-Parry
date: 2018-02-08T20:55:07Z
description: ""
draft: true
slug: setting-up-kubernetes-on-raspberry-pis-part-3
title: Setting Up Kubernetes On Raspberry Pis - Part 3
---

## Install Kubectl on your Computer

### Via Brew

#### Instal

```sh
$ brew install kubectl
```

#### Upgrade

```sh
$ brew upgrade kubernetes-cli
```

## Check the kubectl configuration

Check that kubectl is properly configured by getting the cluster state:

```sh
$ kubectl cluster-info
```

If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not correctly configured:

```sh
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

If kubectl cluster-info returns the url response but you can’t access your cluster, to check whether it is configured properly, use:

```sh
$ kubectl cluster-info dump
```

## Enabling shell autocompletion

On macOS, you will need to install bash-completion support via Homebrew first:

If running Bash 3.2 included with macOS

```sh
$ brew install bash-completion
```

or, if running Bash 4.1+

```sh
$ brew install bash-completion@2
```

## Access your Raspberry Pi Kubernetes Cluster from your

View current config file:

```sh
$ cd ~/.kube/
$ ls
```

Rename local config file:

```sh
mv config original.config
```

Copy kubectl config from Raspberry Pi:

```sh
scp pi@amplifi:~/.kube/config ~/.kube/config
```

Restart locally for changes to take effect.

## References

* [Install Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl)