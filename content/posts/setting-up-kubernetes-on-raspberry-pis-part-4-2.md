---
author: Lewis Denham-Parry
date: 2018-02-08T21:40:31Z
description: ""
draft: true
slug: setting-up-kubernetes-on-raspberry-pis-part-4-2
title: Setting Up Kubernetes On Raspberry Pis - Part 5
---

## Start up the Dashboard

* The dashboard can be useful for visualising the state and health of your system but it does require the equivalent of "root" in the cluster.

```sh
echo -n 'apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: kubernetes-dashboard
  labels:
    k8s-app: kubernetes-dashboard
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: kubernetes-dashboard
  namespace: kube-system' | kubectl apply -f -
```

* This is the development/alternative dashboard which has TLS disabled and is easier to use.

```sh
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/alternative/kubernetes-dashboard-arm.yaml
```

* You can then find the IP and port via:

```sh
$ kubectl get svc -n kube-system
```

* To access this from your laptop you will need to use kubectl proxy and navigate to http://localhost:8001/ on the master, or tunnel to this address with ssh.

* To access the dashboard remotely, ssh from your computer:

```sh
$ ssh -L 8001:127.0.01:30736 pi@k8s-master-1.local
```

* Browse to [Kubernetes dashboard](http://127.0.0.1:8001/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard).

## References

* [Kubernetes Web UI Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)
* [Kubernetes Dashboard: Recommended Setup](https://github.com/kubernetes/dashboard/wiki/Installation#recommended-setup)
* [Kubernetes Dashboard: ReadMe](https://github.com/kubernetes/dashboard/blob/master/README.md)
* [Access Control: admin privileges](https://github.com/kubernetes/dashboard/wiki/Access-control#admin-privileges) 
* [Accessing Dashboard](https://github.com/kubernetes/dashboard/wiki/Accessing-Dashboard---1.7.X-and-above)
