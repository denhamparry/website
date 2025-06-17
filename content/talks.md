---
title: Talks
date: 2022-04-22T21:00:00+00:00
reviewed: 2025-06-04
tags: ["talk"]
author: Lewis Denham-Parry
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: Public talks that I've given
disableShare: false
disableHLJS: true
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
cover:
  image: /images/talks/hotdog.jpg
type: page
menu:
  main: {}
---

## 2025

### Reimagining Container Runtimes: Security Without Sacrifice

- Type: Talk
- Date: 16th June 2025
- Event: Kubernetes London

Modern container platforms force organizations into an impossible choice between
security, performance, and resource utilization. This talk challenges the status
quo by exploring how Edera's container-native hypervisor eliminates traditional
trade-offs through innovative architecture. We examine the fundamental security
problems with shared kernel approaches, analyzing seven major container escape
vulnerabilities from 2022-2024 that exploit namespace limitations. Through comprehensive
benchmarks, we demonstrate how Edera Protect achieves Docker-level performance while
providing VM-like isolation, running on any commodity hardware without specialized
virtualization extensions. The presentation covers breakthrough capabilities including
secure privileged container support, GPU driver isolation for AI workloads, and
seamless Kubernetes integration requiring only a simple runtime class change. We
explore Apple's recent validation of hypervisor-isolated containers and how this
approach enables secure multi-tenancy at scale. Attendees will discover practical
solutions for running sensitive workloads with strong isolation, strategies for
eliminating the development-to-production security gap, and emerging patterns in
container security architecture that prioritize both performance and protection.

### Container Runtimes... on Lockdown: The Hidden Costs of Multi-tenant Workloads

- Type: Talk
- [YouTube](https://www.youtube.com/watch?v=I9t7qfOjgbo)
- Date: 04th April 2025

Container runtimes form the bedrock of Kubernetes, but running diverse workloads
side-by-side introduces complex security challenges that many teams overlook.
This talk peels back the layers of container isolation, starting with the fundamentals
of how containers operate as Linux processes and evolving through today's runtime
landscape.
We'll dive deep into the hidden costs and security implications of different container
runtime choices in multi-tenant environments. Through real-world examples and
performance benchmarks, we'll explore the delicate balance between isolation and
efficiency.
You'll learn about emerging solutions in the container runtime space and practical
approaches to securing workloads without sacrificing performance.
Attendees will leave with critical security considerations for choosing container
runtimes, strategies for workload isolation, and tools to evaluate isolation versus
performance tradeoffs.

## 2024

### The Cloud-Native Club | Project Spotlight: Edera

- Type: Podcast
- [Youtube](https://www.youtube.com/live/MXdmKViYV9Y?si=jhyyU4EIf4Y1wCe0)
- Date: 26 Sept 2024

### OSS North America - The Overconfident Operator Vs the Nefarious Ne’er-Do-Well

- Type: Talk
- [Open Source Summit North America](https://events.linuxfoundation.org/open-source-summit-north-america/)
- Date: 17th April 2024

Ozzie the Overconfident Operator has secured their cluster! They have done it
all: role-based access control, encryption at rest, TLS…and as they congratulate
themself on a job well done, Nova the Nefarious Ne’er-do-well watches from
around the corner, drooling with anticipation. Spoiler alert⎯Ozzie is about to
get HACKED. In this talk, the speakers play the characters of Ozzie and Nova and
playfully demo cluster security as Nefarious Nova exploits each of Ozzie’s
security decisions. What can Overconfident Ozzie do when Nova gets the upper
hand? How can Ozzie proactively keep Nova’s threats at bay? Take security beyond
the firewall and discover cloud native security concepts such as identity
management, container image scanning and signing, creating and implementing
policies, runtime security, and secrets management. Learn security basics
alongside Overconfident Ozzie, who is sure the cluster is COMPLETELY secure this
time. There is nothing Nova can do to break… uh-oh. Not again!

### KCD Guadalajara 2024 - The Overconfident Operator Vs the Nefarious Ne’er-Do-Well

- Type: Keynote
- [KCD Guadalajara](https://ccoss.org/)
- Date: 24-24th February 2024

## 2023

### KubeCon NA 2023 - The Overconfident Operator Vs the Nefarious Ne’er-Do-Well

- Type: Talk
- Where: [YouTube](https://www.youtube.com/watch?v=Y1rJY_UlLmM)
- Date: 08th November 2023

### Lighting Talk 2 aka WTF is the Journey

- Type: Lighting Talk
- Where: [YouTube](https://www.youtube.com/watch?v=dR5T2qNAuCs&t=1s)
- Date: 17th October 2023

As per my [X/Twitter post](https://x.com/denhamparry/status/1720177508279087147):

> I gave a lightning talk at KCD UK 2023, it was impromptu, sleep deprived,
> anxiety ridden, but described as a good rant. This is me sharing the advice I
> wish I had when I got started in my career

### ⚡️ Enlightning - Signed, Sealed, Delivered, I’m Yours! An Introduction to Sigstore

- Type: Discussion
- Where: [YouTube](https://www.youtube.com/watch?v=8GKFzJaEHac)
- Date: 23rd March 2023

How do you know that the software you're running on your laptop or in production
is actually the software you think you're running? Attackers may try to modify
source code or compiled binaries/containers as they move about the internet and
your network. We can check the authenticity of software and other digital
artefacts with digital signatures. But, in practice, almost nobody does! Today,
we'll see why not, and what the Sigstore project is doing to fix that. We'll
explore digital signatures, losing your Yubikey on the street, why the price of
security for OSS projects should be zero, how you achieve more security by
promising less, and why software signatures need "sunshine laws," all in the
context of the Sigstore project and its constituent components Fulcio, Rekor,
and Cosign. You'll learn how the OSS ecosystem is getting more secure every day
and how you can apply the same tools and principles.

### Cloud Native Manchester - _Some like it hot_ (SLSA)

- Type: Talk
- Where:
  [Manchester, UK](https://www.meetup.com/cloud-native-kubernetes-manchester/events/291823775/)
- Date: 21st March 2023

### Public Cloud Kubernetes London - _Some like it hot_ (SLSA)

- Type: Talk
- Where:
  [London, UK](https://www.meetup.com/public-cloud-kubernetes-london/events/291161443/)
- Date: 09th March 2023

### Fosdem - What Does Rugby Have To Do With Sigstore?

- Type: Talk
- Video:
  [Website](https://fosdem.org/2023/schedule/event/security_rugby_sigstore/)
- Where:
  [Brussels, Belgium](https://fosdem.org/2023/schedule/event/security_rugby_sigstore/)
- Date: 04-05th February 2023

Cosign, fulcio, rekor are all components in keyless signing with Sigstore.

Each piece has its responsibility to provide a smooth developer experience for
container signing.

How does it all work together to complete that complicated dance to tie identity
to cryptographic signatures?

And what's more cryptic than rugby?

In this talk, James and Lewis will educate attendees about sigstore and
container signing using examples from the best sport in the world, rugby.

If you're interested in learning more about sigstore and what a hooker does,
this talk is for you.

## 2022

### KubeCon NA 2022 - Hack Back; Let’s Learn Security With CTFs

- Type: Talk
- Video: [YouTube](https://www.youtube.com/watch?v=IZXVWyKGHi4)
- Where:
  [Detroit, USA](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/)
- Date: 26-28th October 2022

Threat actors have always been looking to attack clusters. Do you have the right
security in place to detect and defeat if they are targeting yours? Or they are
already in?

Kubernetes has become the de facto cloud operating system and production
environments have increased in maturity. So have the threats.

Security Teams don’t necessarily have the expertise to detect state-of-art
attack scenarios specific to cloud-native environments, like Kubernetes.

So, where do they get started? Capture-The-Flag (CTF) events are a great way to
learn about the techniques of both attack (Red Team) and defence (Blue Team).

This talk will give you a framework for your own internal CTF events, with Red
and Blue Team assessments, as a best practice for improving security in your
organisation.

We'll give a hands-on, live walkthrough of the top 3 state-of-art attack
scenarios as CTF exercises using common open source projects like Simulator and
Tetragon.

Remember, the best way to learn how to detect is to first know how to attack!

### KCDC 2022 - The Hand That Feeds - How to Misuse Kubernetes

- Type: Talk
- Where: [Kansas City, USA](https://www.kcdc.info/sessions)
- Date: 08-10th August 2022

We usually trust the hand that feeds, but what happens when we can't trust the
hand that feeds us? How do we run applications when there is little to no trust?

In this session, we're going to start by taking a look at attack paths in and
around Kubernetes, acting as a Red Team. We'll take advantage of an OWASP
vulnerability within a Supply Chain attack giving us an entry point. From there,
together we'll explore how an attacker can take further control of the cluster
via lateral and vertical movements.

Once we have your attention from seeing how this could be someone's worst day,
we'll look at how we can patch this up as a Blue Team. What do we have available
from Kubernetes that can mitigate some of this disaster, and what practices
should we put in place to further strengthen and defend our compute.

From attending this session, you'll leave with a Purple Team understanding of
core concepts within Kubernetes, that defence is strengthened with depth, and
how we can defend from Script Kiddies to Nation States.

### KCDC 2022 - The Lost Art Of Keeping A Secret

- Type: Talk
- Where: [Kansas City, USA](https://www.kcdc.info/sessions)
- Date: 08-10th August 2022

One thing that `L****` has noticed recently is that with all the advances that
we have in technology, we still appear to have problems in keeping secrets to
ourselves.

In this talk, `*E***` will introduce the core concepts of secrets. We look at an
overview as to how best we can manage secrets, from creating them to using them
in our applications.

`**W**` will then look at the actors involved, the role of a developer consuming
a secret, an engineer providing and defending them to an attacker on the lookout
for some more data.

`***I*` will then look at ways that we can manage secrets over many
environments, from development to production. Finally, we check what to do when
our secrets aren't so secret anymore.

Finally, `****S` will finish with case studies of where security first has won
and the instances where the secrets have been given away.

This talk will focus on the implementation of secrets based on cloud
technologies, but the core concepts can be used within any system and the best
practices that should be followed to give you a fighting chance to keep it to
yourself.

### DevSecCon24 - Threat Modelling Kubernetes: A Lightspeed Introduction

- Type: Talk
- Where: [Online](https://www.meetup.com/devseccon-wales/events/286041178/)
- Date: 14th June 2022

Cloud native container and Kubernetes systems bring new threats and risks to our
precious workloads. As cloud technologies undergo rapid innovation and new tools
and techniques emerge, security can get left behind. The answer to this
conveyor-belt of potential insecurity? Threat modelling! Join us for a primer on
threat modelling cloud native systems, understanding adversarial techniques and
preventative measures, and helping security and engineering teams increase the
security and velocity of system delivery.

### OWASP AppSec EU - The Hand That Feeds - How to Misuse Kubernetes

- Type: Talk
- Link:
  [Online](https://whova.com/web/sT1P4N7cLm%2FUyeUd0yq6HLfmBOP%2FXqL042hVxqUa0ZA%3D/Speakers?utm_source=owasp-web&utm_medium=event-page&utm_campaign=none)
- Where: Online
- Date: 09th June 2022

We usually trust the hand that feeds, but what happens when we can't? How do we
run applications when there is little to no trust?

In this session, we're going to start by taking a look at attack paths in and
around Kubernetes, acting as a Red Team. We'll take advantage of an OWASP
vulnerability within a Supply Chain attack to give us an entry point. From
there, together we'll explore how an attacker can take further control of the
cluster via lateral and vertical movements.

Once we have your attention from seeing how this could be someone's worst day,
we'll look at how we can patch this attack up as a Blue Team. We’ll see how
Kubernetes can mitigate some of this disaster, and what practices we should put
in place to further strengthen and defend our compute.

From attending this session, you'll leave with a Purple Team understanding of
core concepts within Kubernetes, that defence is strengthened with depth, and
how we can defend from Script Kiddies to Nation States.

### KubeCon EU 2022 - Threat Modelling Kubernetes: A Lightspeed Introduction

- Type: Talk
- Video: [YouTube](https://youtu.be/gkXoYFKqQkE)
- Where: Feria Valencia, Valencia, Spain
- Date: 19th May 2022

Cloud native container and Kubernetes systems bring new threats and risks to our
precious workloads. As cloud technologies undergo rapid innovation and new tools
and techniques emerge, security can get left behind. The answer to this
conveyor-belt of potential insecurity? Threat modelling! Join us for a primer on
threat modelling cloud native systems, understanding adversarial techniques and
preventative measures, and helping security and engineering teams increase the
security and velocity of system delivery.

### Cloud Native Security Days EU 2022 - CTF Overview and Experience

- Type: Talk / CTF
- Video: [YouTube](https://youtu.be/YVlQS90SdaA)
- Video: [YouTube: Closing Notes](https://youtu.be/93FdQUjzqow?t=490)
- Where: Feria Valencia, Valencia, Spain
- Date: 16th May 2022

Prepare yourself for tomorrow's CTF event with a warm-up session based on
introductory SecurityCon CTF events. All experience levels are welcome!

Learn how to engage with confounding container breakouts, confusing Kubernetes
misconfigurations, and the art of engaging with CTF events to prepare yourself
for the high-flying no-holds-barred super-inverted gravity-defying capture the
flag event at SecurityCon tomorrow!

### NDC London 2022 - An Introduction to Kubernetes

- Type: Workshop
- Link:
  [London, UK](https://ndclondon.com/agenda/an-introduction-to-kubernetes-part-i-02zg/0vh9oah807o)
- Where: Queen Elizabeth II Centre, London
- Date: 09th May 2022

In this workshop, we're going to introduce you to the orchestrator formally
known as Kubernetes. This isn't about why or if you should be using it, more of
I need to work with a Kubernetes cluster and how do I connect to it and get it
to work for me.

In this workshop, you will:

- have your very own cluster already setup and show you how to connect to it
  from your own machine
- understand how we run our workloads and how to update them
- how do we load balancer our workloads and make them available to others on the
  internet
- some common mistakes that you can avoid

By the end of the workshop, you will be able to hold your head high and say that
you can work with a Kubernetes cluster and be ready for your next Cloud Native
adventure!

### DevSecCon Wales - HackTheBox-athon Workshop 2022

- Type: Workshop
- Where: [Cardiff, UK](https://www.meetup.com/devseccon-wales/events/285077006/)
- Date: 13th April 2022

### CNW / AI Wales - The One When We Went To Newport

- Type: Meetup
- Where: [Newport, UK](https://www.meetup.com/AI-Wales/events/284776918/)
- Date: 07th Apr 2022

### KernelCon - The Hand That Feeds: How to Misuse Kubernetes

- Type: Talk
- Where: [Omaha, USA](https://kernelcon.org/)
- Date: 02nd April 2022

We usually trust the hand that feeds, but what happens when we can't? How do we
run applications when there is little to no trust? In this session, we're going
to start by taking a look at attack paths in and around Kubernetes, acting as a
Red Team. We'll take advantage of an OWASP vulnerability within a Supply Chain
attack to give us an entry point. From there, together we'll explore how an
attacker can take further control of the cluster via lateral and vertical
movements. Once we have your attention from seeing how this could be someone's
worst day, we'll look at how we can patch this attack up as a Blue Team. We’ll
see how Kubernetes can mitigate some of this disaster, and what practices we
should put in place to further strengthen and defend our compute. From attending
this session, you'll leave with a Purple Team understanding of core concepts
within Kubernetes, that defence is strengthened with depth, and how we can
defend from Script Kiddies to Nation States.

### .NET Beyond - The Hand That Feeds: How to Misuse Kubernetes

- Type: Talk
- Where: [Online](https://tanzu.vmware.com/developer/tv/dotnet-beyond/0012/)
- Date: 31st March 2022

We usually trust the hand that feeds, but what happens when we can’t trust the
hand that feeds us? How do we run applications when there is little to no trust?

In this session, we’re going to start by taking a look at attack paths in and
around Kubernetes, acting as a Red Team. We’ll take advantage of an OWASP
vulnerability within a supply chain attack giving us an entry point. From there,
together we’ll explore how an attacker can take further control of the cluster
via lateral and vertical movements.

Once we have your attention from seeing how this could be someone’s worst day,
we’ll look at how we can patch this up as a Blue Team. We’ll see what we have
available from Kubernetes that can mitigate some of this disaster, and what
practices we should put in place to further strengthen and defend our compute.

From attending this session, you’ll leave with a Purple Team understanding of
core concepts within Kubernetes, that defence is strengthened with depth, and
how we can defend from Script Kiddies to Nation States.

### KernelCon - Kubernetes Security: Learn By Hacking

- Type: Workshop
- Where: [Omaha, USA](https://kernelcon.org/training#k8sec)
- Date: 30th - 31st March 2022

Understand why many cloud native services have evolved quickly, and often miss
vital security considerations, with Hacking Kubernetes, GKE CIS Benchmark, and
SANS authors:

- Secure containerized applications and defend orchestration workloads.
- Use real-world exploits to target key application deployment components.
- Understand the risks involved in running cloud native infrastructure.
- Explore vulnerabilities to cloud native deployments through authentication,
  pipeline, and supply chain exploits.
- Exploit and then secure application deployments via Docker and Kubernetes.
- Determine how vulnerabilities are exploited and how defences are designed.

### CNW / AI Wales - Spring Awakening

- Type: Meetup
- Where: [Cardiff, UK](https://www.meetup.com/AI-Wales/events/283883339/)
- Date: 03th Mar 2022

### Private Kubernetes Training February 2/2

- Type: Training
- Where: Online
- Date: 08th - 09th February 2022

### Private Kubernetes Training February 1/2

- Type: Training
- Where: Online
- Date: 02nd - 03rd February 2022

### Private Kubernetes Training January 2022 2/2

- Type: Training
- Where: Online
- Date: 26th - 27th January 2022

### Private Kubernetes Training January 2022 1/2

- Type: Training
- Where: Online
- Date: 20th - 21st January 2022

### Tanzu Tuesdays - Kubernetes Capture the Flag - Again

- Type: Talk
- Where: [Online](https://tanzu.vmware.com/developer/tv/tanzu-tuesdays/0080/)
- Date: 11th January 2022

### Podcast - The KubeCon CTF

- Type: Podcast
- Where: [cosecast.com](https://cosecast.com/episode-8-kubecon-ctf)
- Date: 10 January 2022.

In this episode Steve speaks with the Control Plane Kubernetes security training
gurus, Lewis Denham-Parry and Andy Martin about their brain-child, the KubeCon
Capture the Flag!

We get into how it began, the community the enables it and the inspiration for
some of the concepts within its structure and scenes.

Recorded back in June 2021 and long overdue thanks to some editing nightmares,
this is one to listen to before we meet up for KubeCon 2022.

## 2021

### Private Kubernetes Training December 2021 2/2

- Type: Training
- Where: Online
- Date: 08th - 09th December 2021

### Private Kubernetes Training December 2021 1/2

- Type: Training
- Where: Online
- Date: 01st - 02nd December 2021

### Tanzu Tuesdays November 2021 - Kubernetes CTF

- Type: Talk
- Where: [Online](https://tanzu.vmware.com/developer/tv/tanzu-tuesdays/0075/)
- Date: 30th November 2021

### BSides London November 2021 - Kubernetes CTF

- Type: CTF
- Where:
  [London, UK](https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry)
- Date: 12th November 2021

Delve deeper into the dark and mysterious world of Kubernetes security! Exploit
a supply chain attack and start your journey deep inside the target
infrastructure, exploit your position to hunt and collect the flags, and
hopefully learn something new and wryly amusing along the way!

Attendees can play six increasingly beguiling and demanding scenarios to
bushwhack their way through the dense jungle of Kubernetes security. Everybody
is welcome, from beginner to hardened veteran, as we venture amongst the
low-hanging fruits of insecure configuration and scale the lofty peaks of
cluster compromise!

### KubeCon Cloud Native Security Conference Day - Capture The Flag NA 2021

- Type: CTF
- Where:
  [LA, USA / Online](https://events.linuxfoundation.org/cloud-native-security-conference-north-america/)
- Date: 12th October 2021
- Video: [YouTube - Introduction NA 2021](https://youtu.be/Bn_0NjvoDoo)
- Video: [YouTube - Walkthrough NA 2021](https://youtu.be/phKBYX6Pd_A)

Review of the Capture the Flag event hosted at Cloud Native Security Conference
NA that was part of KubeCon NA 2021.

### Private Kubernetes Security Training October 2021

- Type: Training
- Where: Online
- Date: 04th - 06th October 2021

### Private Kubernetes Training September 2021 2/2

- Type: Training
- Where: Online
- Date: 22nd - 23rd September 2021

### Klustered

- Type: Debugging
- Where: [Online](https://www.youtube.com/watch?v=FClIbQ8hdxY)
- Date: 16th September 2021

### KCD UK

- Type: Conference
- Where:
  [Online](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-2021/)
- Date: 16th September 2021

### Private Kubernetes Training September 2021 1/2

- Type: Training
- Where: Online
- Date: 15th - 16th September 2021

### KCD UK - Kubernetes Threat Modelling Workshop

- Type: Workshop
- Where:
  [Online](https://www.eventbrite.co.uk/x/kubernetes-threat-modelling-tickets-169847718097)
- Date: 13th September 2021

### Private Kubernetes Security Training August 2021

- Type: Training
- Where: Online
- Date: 23rd - 25th August 2021

### Cloud Natives UK - with special guest Liz Rice and Andrew Martin

- Type: Meetup
- Where: [Online](https://www.youtube.com/watch?v=QkoD_GqmC_E)
- Date: 12th August 2021

### O'Reilly - Kubernetes Threat Modelling August 2021

- Type: Workshop
- Where:
  [Online](https://www.oreilly.com/live-events/kubernetes-threat-modeling/0636920055610/0636920055609/)
- Date: 10th August 2021

### Private Kubernetes Talk August 2021

- Type: Talk
- Where: Online
- Date: 03rd August 2021

### Private Kubernetes Training July 2021

- Type: Training
- Where: Online
- Date: 21st - 22nd July 2021

### Private Kubernetes Security Training July 2021

- Type: Training
- Where: Online
- Date: 12th - 14th July 2021

### Private Kubernetes Talk June 2021

- Type: Talk
- Where: Online
- Date: 29th June 2021

### Private Kubernetes Training June 2021 2/2

- Type: Training
- Where: Online
- Date: 16th - 17th June 2021

### Private Kubernetes Training June 2021 1/2

- Type: Training
- Where: Online
- Date: 09th - 10th June 2021

### Private Kubernetes Training May 2021

- Type: Training
- Where: Online
- Date: 10th - 11th May 2021

### Cloud Natives UK - with special guest Justin Garrison

- Type: Training
- Where: [Online](https://www.youtube.com/watch?v=JqOVC1ZKeBg)
- Date: 06th May 2021

### KubeCon Cloud Native Security Day - Capture The Flag EU 2021

- Type: CTF
- Where:
  [Online](https://events.linuxfoundation.org/cloud-native-security-day-europe/)
- Date: 4th May 2021
- Video: [YouTube - Capture the Flag overview](https://youtu.be/Bn_0NjvoDoo)
- Video:
  [YouTube - Capture The Flag Summary + Wrap UpVirtual](https://youtu.be/phKBYX6Pd_A)

Review of the Capture the Flag event hosted at Cloud Native Security Day EU that
was part of KubeCon EU 2021.

### Cloud Natives UK - with special guest Dan "Pop" Papandrea

- Type: Training
- Where: [Online](https://www.youtube.com/watch?v=EVPjtUuMeMQ)
- Date: 25th March 2021

## 2020

### Cloud Native Wales Meetup v2.0.2

- Type: Meetup
- Where: [Online](https://www.meetup.com/cloudnativewales/events/274550490/)
- Date: 16 Nov 2020

### Cloud Native Wales Meetup v2.0.1

- Type: Meetup
- Where: [Online](https://www.meetup.com/cloudnativewales/events/273116205/)
- Date: 29th Sept 2020

### Cloud Native Wales Meetup v2.0.0-alpha

- Type: Meetup
- Where: [Online](https://www.meetup.com/cloudnativewales/events/269794188/)
- Date: 09th Apr 2020

### Cloud Native Wales Meetup v1.8.0

- Type: Meetup
- Where: [Online](https://www.meetup.com/cloudnativewales/events/269166136/)
- Date: 12th Mar 2020

### Cloud Native Wales Meetup v1.7.0

- Type: Meetup
- Where: [Online](https://www.meetup.com/cloudnativewales/events/268445986/)
- Date: 13th Feb 2020

### PubConf London 2020 - You've Just Lost The Game

- Type: Talk
- Where: [London, UK](https://pubconf.io/events/2020/london/)
- Date: 31st January 2020

## 2019

### CNW / AI Wales: Christmas Social

- Type: Meetup
- Where: [Cardiff, UK](https://www.meetup.com/AI-Wales/events/266825245/)
- Date: 18th Dec 2019

### Cloud Native Wales Meetup v1.6.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/266266702/)
- Date: 14th Nov 2019

### Cloud Native Wales Meetup v1.5.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/266266702/)
- Date: 10th Oct 2019

### Cloud Native Wales Meetup v1.4.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/266266702/)
- Date: 12th Sept 2019

### KCDC - What vulnerabilities? Live hacking of Containers and Orchestrators

- Type: Talk
- Where: [Kansas City, USA](https://kcdc2019.myconf.app/session/ses-134099)
- Date: 19th July 2019

### Cloud Native Wales Meetup v1.2.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/csxbwqyzkbpb/)
- Date: 04th Jul 2019

### NDC Oslo - What vulnerabilities? Live hacking of Containers and Orchestrators

- Type: Talk
- Where: [Oslo, Norway](https://ndcoslo.com/)
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

### Cloud Native Wales Meetup v1.1.0

- Type: Meetup
- Where: [Meetup](https://www.meetup.com/cloudnativewales/events/csxbwqyzjbrb/)
- Date: 13th Jun 2019

### BlueConf - Contributing With No Code

- Type: Lightning Talks
- Where: [BlueConf](https://blueconf.co.uk/)
- Date 08th Jun 2019

### BlueConf - WTF is Cloud Native

- Type: Talk
- Where: [Cardiff, UK](https://blueconf.co.uk/)
- Date 08th Jun 2019

### µCon London 2019 - How do we become Cloud Native?

- Type: Talk
- Where:
  [London, UK](https://skillsmatter.com/conferences/11982-con-london-2019-the-conference-on-microservices-ddd-and-software-architecture#program)

### KubeCon EU - How we contributed to the community with no code

- Type: Lightning Talk
- Where:
  [KubeCon CloudNative Europe / Barcelona](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019)
- Date: 19th May 2019
- Online: [Barcelona, Spain](https://www.youtube.com/watch?v=4jEASYCaVDo)

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

### Cloud Native Wales Meetup v1.0.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/csxbwqyzhbmb/)
- Date: 09th May 2019

### PubConf Minnesota 2019 - Captain Planet: Not the Hero We Want or Need

- Type: Talk
- Where: [Minnesota, USA](https://pubconf.io/events/2019/minnesota/)
- Date: 08th May 2019

### NDC Minnesota 2019 - Scaling Microservices with Message Queues, DotNet Core

and Kubernetes

- Type: Talk
- Where: [Minnesota, USA](https://ndcminnesota.com/)
- Date: 07th May 2019

### Cloud Native Wales Meetup v0.12.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/csxbwqyzgbpb/)
- Date: 11th Apr 2019

### Docker London: State of the Union Address

- Type: Meetup
- Where: [London, UK](https://www.meetup.com/Docker-London/events/257931060/)
- Date: 27th Mar 2019

### Cloud Native Wales Meetup v0.11.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyzfbsb/)
- Date: 14th Mar 2019

### Podcast - CTO and Co-Founder Talk with Dave Albert

- Type: Podcast
- Where:
  [player.fm](https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry)
- Date: 12th March 2019.

Find out the parallels of mental health to monoliths versus microservices!

### Cloud Native Wales Meetup v0.10.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyzdbsb/)
- Date: 07th Feb 2019

### PubConf London 2019 - Shaun of the Dev

- Type: Talk
- Where: [London, UK](https://pubconf.io)
- Date: 1st February 2019
- Online [YouTube](https://www.youtube.com/watch?v=9NEGZQ3rRQ4)

Rapid-fire funny talks, musical acts, and comedy stunts from amazing developers.

### NDC London 2019 - Scaling Microservices with Message queues, .NET and

Kubernetes

- Type: Talk
- Where: [London, UK](https://ndc-london.com)
- Date: 30th January 2019
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

### Cloud Native Wales Meetup v0.9.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyzdbsb/)
- Date: 10th Jan 2019

## 2018

### Cloud Native Wales Meetup v0.8.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxqbrb/)
- Date: 12th Dec 2018

### Cloud Native Wales Meetup v0.7.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxpblb/)
- Date: 08th Nov 2018

### µCon London 2018 - One Monolith / One Macroservice / Many Microservices

- Type: Talk
- Where:
  [London, UK](https://skillsmatter.com/conferences/10336-mucon-london-2018-the-microservices-conference#skillscasts)
- Date: 05th November 2018

From working with a number of companies, the only constant is seeing that each
company has their own way of migrating from a monolith to a microservice
architecture, and it never working out as planned. In this talk Lewis will share
with you the idea of embracing your monolith and making it a macroservice. He’ll
explore the benefits of this approach from both a technical and business
perspective, and plan how to convert this macroserivce into microservices.

### Cloud Native Wales Meetup v0.6.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxnbpb/)
- Date: 11th Oct 2018

### Cloud Native Wales Meetup v0.5.0

- Type: Meetup
- Where: [Meetup](https://www.meetup.com/cloudnativewales/events/lxwbppyxmbrb/)
- Date: 13th Sept 2018

### ProgNet London 2018 - Use Kubernetes to Deploy .NET Applications

- Type: Workshop
- Where:
  [London, UK](https://skillsmatter.com/conferences/10107-prognet-london-2018#skillscasts).
- Date: 12th September 2018.

With the explosive momentum of Docker, Kubernetes has become the de-facto
standard for orchestrating and managing containerised apps in production.

### Cloud Native Wales Meetup v0.4.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxlbmb/)
- Date: 09th Aug 2018

### Cloud Native Wales Meetup v0.3.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxkbqb/)
- Date: 05th Jul 2018

### Cloud Native Wales Meetup v0.2.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxjbsb/)
- Date: 20th Jun 2018

### Cloud Native Wales Meetup v0.1.0

- Type: Meetup
- Where:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxhbnb/)
- Date: 10th May 2018
