---
author: Lewis Denham-Parry
date: 2018-02-08T21:34:31Z
description: ""
draft: true
slug: setting-up-kubernetes-on-raspberry-pis-part-4
title: Setting Up Kubernetes On Raspberry Pis - Part 4
---

## Deploy a Container

* Create a **markdownrender.yml** file:

```sh
$ sudo nano function.yml
```

* Paste the following code into the file:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: markdownrender
  labels:
    app: markdownrender
spec:
  type: NodePort
  ports:
    - port: 8080
      protocol: TCP
      targetPort: 8080
      nodePort: 31118
  selector:
    app: markdownrender
---
apiVersion: apps/v1beta1 # for versions before 1.6.0 use extensions/v1beta1
kind: Deployment
metadata:
  name: markdownrender
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: markdownrender
    spec:
      containers:
      - name: markdownrender
        image: functions/markdownrender:latest-armhf
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          protocol: TCP
```

* Create the container within Kubectl:

```sh
$ kubectl create -f markdownrender.yaml
```

* Test the container within the master:

```bash
$ curl 127.0.0.1:31118 -d "# test"
<h1>test</h1>
```

* Test the container remotely (e.g. from your computer):

```bash
$ curl 192.168.1.220:31118 -d "# test"
<h1>test</h1>
```
