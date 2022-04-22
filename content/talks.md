---
title: Talks
date: 2022:04:22T21:00:00+00:00
tags: ["talk"]
author: Lewis Denham-Parry
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: Public talks that I've given
disableShare: false
dissbleHLJS: true
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
cover:
  image: /images/talks/header.png
type: page
menu:
  main: {}

---

## Coming Up

### NDC London 2022 - An Introduction to Kubernetes

- Link: [NDC London 2022](https://ndclondon.com/agenda/an-introduction-to-kubernetes-part-i-02zg/0vh9oah807o)
- Where: Queen Elizabeth II Centre, London
- Date: 09th May 2022

In this workshop, we're going to introduce you to the orchestrator formally known as Kubernetes. This isn't about why or if you should be using it, more of I need to work with a Kubernetes cluster and how do I connect to it and get it to work for me.

In this workshop, you will: 

- have your very own cluster already setup and show you how to connect to it from your own machine 
- understand how we run our workloads and how to update them 
- how do we load balancer our workloads and make them available to others on the internet 
- some common mistakes that you can avoid

By the end of the workshop, you will be able to hold your head high and say that you can work with a Kubernetes cluster and be ready for your next Cloud Native adventure!

### KubeCon EU 2022 - Threat Modelling Kubernetes: A Lightspeed Introduction

- Link: [KubeCon EU 2022](https://sched.co/ytqj)
- Where: Feria Valencia, Valencia, Spain
- Date: 19th May 2022

Cloud native container and Kubernetes systems bring new threats and risks to our precious workloads. As cloud technologies undergo rapid innovation and new tools and techniques emerge, security can get left behind. The answer to this conveyor-belt of potential insecurity? Threat modelling! Join us for a primer on threat modelling cloud native systems, understanding adversarial techniques and preventative measures, and helping security and engineering teams increase the security and velocity of system delivery.

## Done!

### KernelCon - The Hand That Feeds: How to Misuse Kubernetes

- Where: [KernelCon 2022](https://kernelcon.org/)
- Date: 02nd April 2022

We usually trust the hand that feeds, but what happens when we can't? How do we run applications when there is little to no trust? In this session, we're going to start by taking a look at attack paths in and around Kubernetes, acting as a Red Team. We'll take advantage of an OWASP vulnerability within a Supply Chain attack to give us an entry point. From there, together we'll explore how an attacker can take further control of the cluster via lateral and vertical movements. Once we have your attention from seeing how this could be someone's worst day, we'll look at how we can patch this attack up as a Blue Team. We’ll see how Kubernetes can mitigate some of this disaster, and what practices we should put in place to further strengthen and defend our compute. From attending this session, you'll leave with a Purple Team understanding of core concepts within Kubernetes, that defence is strengthened with depth, and how we can defend from Script Kiddies to Nation States.

### .NET Beyond - The Hand That Feeds: How to Misuse Kubernetes

- Where: [.NET Beyond 2022](https://tanzu.vmware.com/developer/tv/dotnet-beyond/0012/)
- Date: 31st March 2022

We usually trust the hand that feeds, but what happens when we can’t trust the hand that feeds us? How do we run applications when there is little to no trust?

In this session, we’re going to start by taking a look at attack paths in and around Kubernetes, acting as a Red Team. We’ll take advantage of an OWASP vulnerability within a supply chain attack giving us an entry point. From there, together we’ll explore how an attacker can take further control of the cluster via lateral and vertical movements.

Once we have your attention from seeing how this could be someone’s worst day, we’ll look at how we can patch this up as a Blue Team. We’ll see what we have available from Kubernetes that can mitigate some of this disaster, and what practices we should put in place to further strengthen and defend our compute.

From attending this session, you’ll leave with a Purple Team understanding of core concepts within Kubernetes, that defence is strengthened with depth, and how we can defend from Script Kiddies to Nation States.

### KernelCon - Kubernetes Security: Learn By Hacking

- Where: [KernelCon 2022](https://kernelcon.org/training#k8sec)
- Date: 30th - 31st March 2022

Understand why many cloud native services have evolved quickly, and often miss vital security considerations, with Hacking Kubernetes, GKE CIS Benchmark, and SANS authors:

- Secure containerized applications and defend orchestration workloads.
- Use real-world exploits to target key application deployment components.
- Understand the risks involved in running cloud native infrastructure.
- Explore vulnerabilities to cloud native deployments through authentication, pipeline, and supply chain exploits.
- Exploit and then secure application deployments via Docker and Kubernetes.
- Determine how vulnerabilities are exploited and how defences are designed.

## 2021

### Capture The Flag NA 2021

- Where: [Cloud Native Security Conference NA 2021](https://events.linuxfoundation.org/cloud-native-security-conference-north-america/)
- Date: 12th October 2021
- Online: [YouTube - Introduction NA 2021](https://youtu.be/Bn_0NjvoDoo)
- Online: [YouTube - Walkthrough NA 2021](https://youtu.be/phKBYX6Pd_A)

Review of the Capture the Flag event hosted at Cloud Native Security Conference
NA that was part of KubeCon NA 2021.

### Capture The Flag EU 2021

- Where: [Cloud Native Security Day EU 2021](https://events.linuxfoundation.org/cloud-native-security-day-europe/)
- Date: 4th May 2021
- Online: [YouTube - Capture the Flag overview](https://youtu.be/Bn_0NjvoDoo)
- Online: [YouTube - Capture The Flag Summary + Wrap UpVirtual](https://youtu.be/phKBYX6Pd_A)

Review of the Capture the Flag event hosted at Cloud Native Security Day EU
that was part of KubeCon EU 2021.

### What vulnerabilities? Live hacking of Containers and Orchestrators

- Where: [NDC Oslo](https://ndcoslo.com/)
- Date: 20th June 2019
- Online: [YouTube](https://www.youtube.com/watch?v=JaMJJTb_bEE)

We often see alerts about vulnerabilities being found in frameworks that we use
today, but should we really care about them? What's the worst that can happen?
Can someone own a container? Could they run a bitcoin miner on my servers? Are
they able to own the cluster?

In this talk, we look at one of the worst-case scenarios from a real-world
perspective. We have a red team member attempting to hack a cluster we own with
a live hack on stage whilst the blue team member tries to stop it from
happening.

We'll discuss developing best practices, implement security policies and how
best to monitor your services to put preventative measures in place.

---

### How we contributed to the community with no code

- Where: [KubeCon CloudNative Europe / Barcelona](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019)
- Date: 10th May 2019
- Online: [YouTube](https://www.youtube.com/watch?v=4jEASYCaVDo)

This time last year, two people from Wales, United Kingdom decried to bring the
CNCF to their doorstep.

Previously, they were attending international conferences and national meetups
to meet and be a part of the community.

Knowing that they were in a privileged position, they wanted to share it with
others that, for whatever reason, were unable to make these events.

Cloud Native Wales will be soon celebrating a year of meetups, and best of all,
we get to share this with the 100's of people within our meetup community.

This talk will inspire you to take the chance to branch the CNCF and build a
community closer to home, help others learn, share and contribute to the world
wide community.

---

### Shaun of the Dev

- Where: [PubConf](https://pubconf.io)
- Date: 1st February 2019
- Online [YouTube](https://www.youtube.com/watch?v=9NEGZQ3rRQ4)

Rapid-fire funny talks, musical acts, and comedy stunts from amazing developers.

---

### Scaling microservices with Message queues, .NET and Kubernetes

- Where: [NDC London](https://ndc-london.com)
- Date:  30th January 2019
- Online: [YouTube](https://www.youtube.com/watch?v=si44LvcgXwU)

When you design and build applications at scale, you deal with two significant
challenges: scalability & robustness. You should design your service so that
even if it is subject to intermittent heavy loads, it continues to operate
reliably. But how do you build such applications? And how do you deploy an
application that scales dynamically? Kubernetes has a feature called autoscaler
where instances of your applications are increased or decreased automatically
based on metrics that you define.

In this talk, you’ll learn how to design, package & deploy reliable .NET
applications to Kubernetes & decouple several components using a message broker.
You will also learn how to set autoscaling rules to cope with an increasing
influx of messages in the queue.

---

### One Monolith / One Macroservice / Many Microservices

- Where: [µCon London 2018 - The Microservices Conference](https://skillsmatter.com/conferences/10336-mucon-london-2018-the-microservices-conference#skillscasts)
- Date:  5th November 2018
- Online: [SkillsMatter](https://skillsmatter.com/skillscasts/12964-one-monolith-one-macroservice-many-microservices)

From working with a number of companies, the only constant is seeing that each
company has their own way of migrating from a monolith to a microservice
architecture, and it never working out as planned. In this talk Lewis will
share with you the idea of embracing your monolith and making it a macroservice.
He’ll explore the benefits of this approach from both a technical and business
perspective, and plan how to convert this macroserivce into microservices.

---

### Tutorial: Use Kubernetes to Deploy .NET Applications

- Where: [ProgNET London 2018](https://skillsmatter.com/conferences/10107-prognet-london-2018#skillscasts).
- Date:  12th September 2018.

With the explosive momentum of Docker, Kubernetes has become the de-facto
standard for orchestrating and managing containerised apps in production.

---

## Podcast

### The KubeCon CTF

Date: 10 January 2022.

In this episode Steve speaks with the Control Plane Kubernetes security training
gurus, Lewis Denham-Parry and Andy Martin about their brain-child, the KubeCon
Capture the Flag!

We get into how it began, the community the enables it and the inspiration for
some of the concepts within its structure and scenes.

Recorded back in June 2021 and long overdue thanks to some editing nightmares,
this is one to listen to before we  meet up for KubeCon 2022 #optimistic  

Podcast: [cosecast.com](https://cosecast.com/episode-8-kubecon-ctf)

### CTO and Co-Founder Talk with Dave Albert

- Date: 12th March 2019.

Find out the parallels of mental health to monoliths versus microservices!

Podcast: [player.fm](https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry)

---
