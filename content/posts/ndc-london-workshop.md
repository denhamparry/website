---
author: Lewis Denham-Parry
date: 2018-01-15T09:05:26Z
description: ""
draft: true
slug: ndc-london-workshop
title: NDC London Workshop
---

## Day One

[Ben Hall](https://twitter.com/ben_hall)

* What if we can remove confiuration complexity, depenedency conflicts and uncertainty.
* Containers are more secure, sandbox enviroments.
* Using all services (e.g. Azure client) within docker.
* By separating application, deployment and infrasrture, we get more flexablity.
* Container:
    * Own process space.
    * Own network interface.
    * Own root directories.
    * Sandboxed.
    * But its not a VM.
    * Native CPU
    * Native Memorty
    * Native IO
    * No Pre-Allocation
    * No Performance Overhead.
* Docker got us to agree on what contianers are and how they run.
* Build Base OS / Bare metal > Build container > Deploy container.

## First Exercise

### Task: Run Redis/Nginx as a Container

* (Docker Hub)[https://hub.docker.com/explore/]
* (Redis)[https://hub.docker.com/_/redis]
* (Nginx)[https://hub.docker.com/_/nginx]

* docker run
* docker run -d
* docker ps
* docker logs
* docker stop

* *Advance*: Port Bindings... Architectures (Alpine)

### Notes

* Examples

```terminal
docker run redis
$ docker run redis:alpine
$ docker run -d redis:alpine
$ docker run --name port-redis -p 12345:6379  redis
```

* Azure Cli Example

```terminal
$ docker run -it microsoft/azure-cli:2.0.24 az login
$ az group create --name NDCLDN2018 --location "West Europe"
$ az appservice plan create --name NDCLDNSP --resource-group NDCLDN2018 --sku S1 --is-linux
$ az webapp create --resource-group NDCLDN2018 --plan NDCLDNSP --name NDCLDN2018App --deployment-container-image-name nginx
$ az group delete --name NDCLDN2018
```

* Remove stopped containers

```terminal
$ docker system prune
```

* Different exit codes can be reflected in Docker.

### Task: Run a web application in Docker.

[Katacode course](https://www.katacoda.com/courses/dotnet-in-docker/deploying-aspnet-core-as-docker-container)

```dockerfile
COPY dotnetapp.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o out
```

* Docker has a built in caching system after build steps.
* If the .csproj file never changes, the restore would be the same.
* If copy directory has not changed, then cache is used.
* Reduces build times.

### When running containers...

**Photo Taken**

* Process logs with host names to be able to debug which container is causing the error.
* Dotnet by default only accepts **127.0.0.1**, change to **0.0.0.0** to allow external network interfaces.
* Elasticsearch binds to localhost by default.
* Always include a trailing slash to confirm that its a directory.
  * *Is it copying to a file or directory*.


## Task: Deploy Web Application using Docker

* (Docker Hub)[https://hub.docker.com/explore/]
* (Github Katacoda)[https://github.com/katacoda]
* (Katacoda course)[https://katacoda.com/courses/dotnet-in-docker]

* Find a base image - dotnet, Node.js, JVM
* Create a HelloWorld application
* Use dockerfile to build instructions

```terminal
$ docker build -t 
$ docker run
```

* Katacoda has guides for Node.js, DotNet, Kotlin (JVM).

### Notes

* Docker images are set in time, frozen.

#### Tagging

* Official images have a convention of :latest.
* Using ::latest can introduce problems.
* Use CI build number / Semver.
* Be explicit with your tags, **NEVER USE LATEST**.

#### Docker Image Layers

* Branching, layered file system.
* Each step is adding a new layer to a previous image.


#### Docker History Command

```terminal
docker history denhamparry/dotnethelloworld:v0.1
```

### Dockerfile Default Structure

* Find base image
* Copy dependencies
* Copy base code
* Copy metadata

### Passwords baked into Images

* IBM caught out with Swarm passwords baked into image.

### Docker Ignore

* Files will not get sent into Docker daemon.

### Theory of Base Images

* Small

## What Should Go Into a Container

One process === One container

* If one process dies, its just one process.
* Mulitple processes within a single container causes more complexity.

> Everything is a container
> Containers need to talk to eachother

## Docker Networks

(Docker Playground)[https://katacoda.com/courses/docker/playground]

```terminal
$ docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
3298f3168821        bridge              bridge              local
fa029ea1b2a4        host                host                local
e4b0fd36304a        none                null                local
```

(Try this later on)[https://katacoda.com/courses/docker/networking-intro]

```terminal
$ docker network create skynet
$ docker network ls
$ docker run -d --net=skynet redis
$ docker network inspect skynet
$ docker run -it --net=skynet alpine ash
ip
ping redis
```

* DNS lookups can happen without any code, just using container names.

## Task: Deploy Node + Reddis App

* Deploy the NodeJS image at ()[https://hub.docker.com/r/katacoda/redis-node-docker-example].
* This has a dependency on Redis.
* The node app will error, investigate and solve to get it working and deployed.
* ()[https://katacoda.com/courses/docker/networking-intro]
* How does the node app to connect to "redis"? Set alias of the container name using docker network connect of docker run.

### Notes

```terminal
$ docker network create backend-network
$ docker run -d --name=redis --net=backend-network redis
$ docker run -d --name=redis-node --net=backend-network katacoda/redis-node-docker-example
```

```terminal
docker pull katacoda/redis-node-docker-example
docker run katacoda/redis-node-docker-example
docker network ls
docker run -net=skynet katacoda/redis-node-docker-example
docker network disconnect skynet redis
docker network connect skynet redis
docker network connext --alias=db skynet redis
docker network inspect
```

* When terminal commands aren't working its because -t is not connected.
* Explicily kill containers with **-f**.

### Docker Compose

> Better, more streamlined way compared to run commands in Docker.

* Services: Application running as a container.
* Centralise all of Docker along from the source code.

```terminal
$ docker compose up
$ docker compose up -d
$ docker-compose -f docker-compose-dev.yml ps
$ docker-compose -f docker-compose-dev.yml redis scale=5
```

## Task: Configure Gogs and Drone

* Complete scenario on (Katacoda)[https://katacoda.com/courses/cicd/build-docker-images-drone].
* All build steps are self-contained in the Dockerfile.
* Finished? Try (Jenkins)[https://katacoda.com/courses/cicd/build-docker-images-using-jenkins].

### Notes

```terminal
$ DRONE_HOST=https://2886795406-80-ollie02.environments.katacoda.com docker-compose up -d
$ cat docker-compose.yml
version: '2'

services:
  postgres:
    image: postgres:9.5
    restart: always
    environment:
     - "POSTGRES_USER=gogsuser"
     - "POSTGRES_PASSWORD=gogspassword"
     - "POSTGRES_DB=gogs"
    volumes:
     - "db-data:/var/lib/postgresql/data"
  gogs:
    image: gogs/gogs:latest
    restart: always
    ports:
     - "10022:22"
     - "3000:3000"
    links:
     - postgres
    environment:
     - "RUN_CROND=true"
    volumes:
     - "gogs-data:/data"
    depends_on:
     - postgres
  drone-server:
    image: drone/drone:0.8
    ports:
      - 80:8000
      - 9000
    volumes:
      - /var/lib/drone:/var/lib/drone/
    restart: always
    links:
     - gogs
    environment:
      - DRONE_OPEN=true
      - DRONE_GOGS=true
      - DRONE_GOGS_URL=http://gogs:3000
      - DRONE_HOST=${DRONE_HOST}
      - DRONE_SECRET=SOME_RANDOM_STRING
  drone-agent:
    image: drone/agent:0.8
    command: agent
    restart: always
    depends_on:
      - drone-server
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DRONE_SERVER=drone-server:9000
      - DRONE_SECRET=SOME_RANDOM_STRING

volumes:
    db-data:
      driver: local
    gogs-data:
      driver: local
```

* Scratch (e.g. FROM scratch) image from docker can run static images (e.g. compiled Go applications).

* Review Azure private image repo.

## Docker Image Security

* Docker content trust
  * All docker images come with sha256 hash.
  * Image would error if this changes.
  * Not widley used but should be promoted.
  * Services available around this, e.g. (MicroBadger)[https://microbadger.com/]
* Docker Hub scans each layer, reviews if any layer is affected by a know vunerability.
* Red Hat Atomic Registry
* jFrog - Image scanning with Authentication/
* AquaSec - Whitelist/Blacklist image depolyments.  Revoke image from cluster.
* Docker Notary / Content Trust.
  * Sign an image with a key, image can only be deployed with key.
* (Clair)[https://github.com/coreos/clair]

## Task: Configure Clair and Image Scanning

()[https://katacoda.com/courses/docker-security/image-scanning-with-clair]

* Integrate into CI.

## Common Question: Is it secure?

* Hosting provider notices a spike in traffic.
* Remove as many vunerabilities.
* File system could be viewed to see what had been changed.
* Create Read Only containers
  * ``docker run --read-only -v /data:/data elasticsearch``
  * Lockdown on container, volume is available.

```terminal
FROM nginx
RUN adduser non-root
USER non-root

$ docker run -u 1000 -d nginx
```

> It also allows the container to access local network services + like D-bus and is therefore considered insecure.

* Restrictions
  * Cgroups - How much of something can I use?
  * Namespaces - What can I see?
  * Capabilties - What can I do?
  * Seccomp - What can I call?
  * AppArmor - What can my app do?

```terminal
docker run --pid=container:web -it ubuntu bash
```

* Attach a debugging container to the pid, and debug.
* Delete container to prevent risk.

* Seccomp prevents strace.
* AppArmor reviews all restrictions and creates a profile.

> Zombie :(){:|:};:

`` --pids-limit 10 ``

> NCC Group, Understanding and Hardening Linux Containers April 20, 2016.

** Photo taken **

## What about Production?

> Containers as a service
 
* Azure Container Instances (ACI).
  * By the second billing.

## Task: Deploy Container to Cloud

()[https://katacoda.com/courses/azure/deploying-container-instances]

```terminal
$ az login -u $username -p $password
$ az container create -g $resource --name nginx --image nginx:1.11 --ip-address public
$ az container list
$ az container list -o table
$ az container logs -g $resource --name nginx
$ az container delete --resource-group $resource --name nginx
$ az container list -o table
```

## Day Two

What about the application?
(Sam Newman)[https://twitter.com/samnewman]

(Cloud Native Cloud Foundation)[https://github.com/cncf/landscape]

## Docker in Production

> Its about scale
 
If we lose a node, we don't lose an application.

## Multi-Host Container Orchestration

* Overlay Networks and VXLan

## Docker Swarm

* Node
    * Instance of the Docker Engine connected to Swarm.
* Services
    * High level concept relating to a collection of tasks to be executed by workers.
* Load balancing
    * Docker introduces a load balancer to process requests across all containers in the service.

## Task - Deploy Containers using Swarm

(Getting Started With Swarm Mode)[https://katacoda.com/courses/docker-orchestration/getting-started-with-swarm-mode]
(Rolling Update Services Swarm Cluster)[https://katacoda.com/courses/docker-orchestration/rolling-updates-services-swarm-cluster]

1. Initalise
       docker swarm init
2. Add node
       docker swarm join host:2377 --token $token
       docker node ls
3. Create overlay network
       docker network create -d overlay skynet
4. Deploy service
       docker service create --name http --network skynet --replicas 2 -p 80:80 katacoda/docker-http-server
5. Advance: Deploy Redis + Node as services
       - Host 1 - hub.docker.com/katacoda/redis-node-docker-example/
       - Host 2 - Redis

### Notes

* Getting Started with Swarm Mode

```terminal
host1 $ docker swarm --help
host1 $ docker swarm init
host2 $ token=$(docker -H 172.17.0.236:2345 swarm join-token -q worker) && echo $token
host2 $ docker swarm join 172.17.0.236:2377 --token $token
host1 $ docker node ls
host1 $ docker network create -d overlay skynet
host1 $ docker service create --name http --network skynet --replicas 2 -p 80:80 katacoda/docker-http-server
host1 $ docker service ls
host1 $ docker ps
host2 $ docker ps
host1 $ curl docker
host2 $ curl docker
host1 $ docker service ps http
host1 $ docker service inspect --pretty http
host1 $ docker node ps self
host1 $ docker node ps $(docker node ls -q | head -n1)
host1 $ docker service scale http=5
host1 $ docker ps
host1 $ curl docker
```

* Rolling update services with Swarm

```terminal
$ docker service update --help
$ docker swarm init && docker service create --name http --replicas 2 -p 80:80 katacoda/docker-http-server:v1
$ docker service update --env-add KEY=VALUE http
$ docker service update --limit-cpu 2 --limit-memory 512mb http
$ docker service inspect --pretty http
$ docker ps -a
$ docker service update --replicas=6 http
$ docker service inspect --pretty http
$ docker service update --image katacoda/docker-http-server:v2 http
$ docker ps
$ curl http://docker
$ docker service update --update-delay=10s --update-parallelism=1 --image katacoda/docker-http-server:v3 http
$ docker ps
$ curl http://docker
```

(Portainer.io)[https://katacoda.com/portainer/scenarios/deploying-to-swarm]

## Kubernetes

(Katacoda Kubernetes)[https://www.katacoda.com/courses/kubernetes/]

> Kuberenetes is an open-source system for automating, deployment, scaling and management of containerixed aplications.

(Minikube)[https://github.com/kubernetes/minikube]

## Task: Deploy containers Kubeadm and Kubectl

(Getting started with Kubeadm)[https://katacoda.com/courses/kubernetes/getting-started-with-kubeadm]

(Deploy interactive)[https://kubernetes.io/docs/tutorials/kubernetes-basics/deploy-interactive/]

* Use Kubaadm to initialise
* Deploy CNI
* Deploy HTTP Demo App and Dashboard

(Weave Works - Kube addon)[https://www.weave.works/docs/net/latest/kube-addon/ ]

### Notes

```terminal
host1 $ kubeadm init --token=102952.1a7dd4cc8d1f4cc5 --kubernetes-version v1.8.0
host1 $ kubeadm token list
host2 $ kubeadm join --token=102952.1a7dd4cc8d1f4cc5 172.17.0.20:6443
host1 $ sudo cp /etc/kubernetes/admin.conf $HOME/
sudo chown $(id -u):$(id -g) $HOME/admin.conf
export KUBECONFIG=$HOME/admin.conf
host1 $ kubectl get nodes
host1 $ cat /opt/weave-kube
host1 $ kubectl apply -f /opt/weave-kube
host1 $ kubectl get pod -n kube-system
host1 $ kubectl run http --image=katacoda/docker-http-server:latest --replicas=1
host1 $ kubectl get pods
host2 $ docker ps | grep docker-http-server
host1 $ kubectl apply -f dashboard.yaml
host1 $ kubectl get pods -n kube-system
```

(Kubernetes dashboard yaml)[https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml]

> Feels... manual

## Task: Deploying Containers Using YAML

* Problem: How can I create infrastructure as code?
* Solution: YAML definitions

(Creating Kubernetes YAML definitions)[https://www.katacoda.com/courses/kubernetes/creating-kubernetes-yaml-definitions]


** TO ADD **

```terminal
```

> GitOps

(Weave Works)[https://www.weave.works/]

> Allowing teams to move quickly by owning the changes, owning the system.

## Services Define Communication

* NodePort - Hardcoded port
* ClusterIP - Cluster assigned IP
* LoadBalancer - Public IP assigned by cloud provider

> Container Network Interface (CNI)

(CNI for docker containers)[https://www.weave.works/blog/cni-for-docker-containers/]

## Task: Kubernetes Networking

** Update Answer**

(Networking Introduction)[https://www.katacoda.com/courses/kubernetes/networking-introduction]

## Create Ingress Routing with Kubernetes

(Create Kubernetes Ingress Routes)[https://katacoda.com/courses/kubernetes/create-kubernetes-ingress-routes]

* Ingress controls how to route traffic for a CNAME to a Kubernetes service.

### Notes

* deployment.yaml

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: webapp1
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: webapp1
    spec:
      containers:
      - name: webapp1
        image: katacoda/docker-http-server:latest
        ports:
        - containerPort: 80
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: webapp2
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: webapp2
    spec:
      containers:
      - name: webapp2
        image: katacoda/docker-http-server:latest
        ports:
        - containerPort: 80
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: webapp3
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: webapp3
    spec:
      containers:
      - name: webapp3
        image: katacoda/docker-http-server:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: webapp1-svc
  labels:
    app: webapp1
spec:
  ports:
  - port: 80
  selector:
    app: webapp1
---
apiVersion: v1
kind: Service
metadata:
  name: webapp2-svc
  labels:
    app: webapp2
spec:
  ports:
  - port: 80
  selector:
    app: webapp2
---
apiVersion: v1
kind: Service
metadata:
  name: webapp3-svc
  labels:
    app: webapp3
spec:
  ports:
  - port: 80
  selector:
    app: webapp3
```

```terminal
$ cat deployment.yaml
$ kubectl create -f deployment.yaml
$ kubectl get deployment
```

* ingress.yaml

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx-ingress-rc
  labels:
    app: nginx-ingress
spec:
  replicas: 1
  selector:
    app: nginx-ingress
  template:
    metadata:
      labels:
        app: nginx-ingress
    spec:
      containers:
      - image: nginxdemos/nginx-ingress:0.9.0
        name: nginx-ingress
        ports:
        - containerPort: 80
          hostPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-ingress-lb
  labels:
    app: nginx-ingress
spec:
  externalIPs:
  - 172.17.0.104
  ports:
  - port: 80
    name: http
    targetPort: 80
  selector:
    app: nginx-ingress
```

```terminal
$ cat ingress.yaml
$ kubectl create -f ingress.yaml
$ kubectl get rc
```

* Ingress-rules.yaml

```yaml
- host: my.kubernetes.example
  http:
    paths:
    - path: /webapp1
      backend:
        serviceName: webapp1-svc
        servicePort: 80
    - path: /webapp2
      backend:
        serviceName: webapp2-svc
        servicePort: 80
    - backend:
        serviceName: webapp3-svc
        servicePort: 80
```

```terminal
$ kubectl create -f ingress-rules.yaml
$ kubectl get ing
$ curl -H "Host: my.kubernetes.example" 172.17.0.104/webapp1
$ curl -H "Host: my.kubernetes.example" 172.17.0.104/webapp2
$ curl -H "Host: my.kubernetes.example" 172.17.0.104
```

## Summary

* Namespace - Group of deployments.
* Deployment - Workload.
* Pods - Instance of workload.
* Service - How to reach workload.
* Ingress - define routes to services.
* Network Policies - container firewalls.

## Orchrastraion

> Think of it like Tetris, horizontal models rather than vertical spikes.

## Task: Stateful Services with Kubernetes

(Storage Introduction)[https://www.katacoda.com/courses/kubernetes/storage-introduction]

(Basic Stateful Set)[https://kuberentes.io/docs/tutorials/stateful-application/basic-stateful-set]

(Rook.io)[https://rook.io]
(StorageOS)[https://storageos.com/]

## Kubernetes Operators

* An operator represents human operational knowledge in software to reliability manage an application.

## Task: Build and Deploy using OpenShift

* (Learn OpenShift)[https://learn.openshift.com]
* Complete (Getting started with OpenShift for Developers)[]
* It will guide you to using OpenShift for deploying containers.
* OpenShift is a platform built on top of Kubernetes.

> Conformance Across Kubernetes Versions

* (OpenShift)[https://www.openshift.org]
* (OpenShift - Getting Started)[https://learn.openshift.com/introduction/getting-started/]

## Service Mesh

### (Istio)[https://istio.io/]

* A platform to connect, manage and secure microservices
* Service Mesh
    * A service mesh is a dedicated infrastruce for service to service communication safe, fast and reliable.
* (Katacoda - Deploy istio on kubernetes)[https://www.katacoda.com/courses/istio/deploy-istio-on-kubernetes]

### Weave Scope

* (Weave Works Scope)[https://www.weave.works/oss/scope/]
* (Katacoda - Hello Scope)[https://www.katacoda.com/courses/weave/hello-scope]

## Daily Commands

* Connect to existing container

```terminal
$ docker exec -i -t web sh
```

* Show stats of container
```terminal
$ docker stats
```

* Review whats happening in containers
```terminal
csysdig
```

## One More Thing

### Security

* ()[https://www.shodan.io/search?query=nosniff+port+%222375%22]
* ()[https://www.shodan.io/search?query=docker]
* ()[http://dockerbench.com/]
* ()[https://github.com/aquasecurity/kube-bench]

### IOT

* ()[https://resin.io]

### DBs

* SQL Server as a Container.
* SQL Server Linux as a Container.

### Why nots?

* VS as a container?

### IDE

* Eclipse as a container

### Testing

* Selenium as a container.

### Desktop Applications

* Check photos.

## Sidenotes
* [Kubernetes basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
* Focker, Dicker, Docker Hun

kubectl delete -f ./namespaces.yml && \
 kubectl delete -f ./yaml