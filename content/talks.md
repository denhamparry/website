---
title: Talks
date: 2022-04-22T21:00:00+00:00
reviewed: 2026-07-08
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
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
cover:
  image: /images/talks/hotdog.jpg
type: page
menu:
  main: {}
---

## 2026

<!-- markdownlint-disable MD013 -->

### Cloud Native and Kubernetes Edinburgh - Beyond Containers: Why MicroVMs Are Essential for Multi-Tenant Workloads

<!-- markdownlint-enable MD013 -->

- Type: Talk
- Date: 14th April 2026
- Event:
  [Cloud Native and Kubernetes Edinburgh](https://www.meetup.com/cloud-native-kubernetes-edinburgh/events/313744012/)
- Resources:
  [Slides](https://talks.denhamparry.co.uk/2026-04-14-beyond-containers.html)

Containers are the de facto deployment model for our applications today, but is
your container runtime appropriate for multi-tenant workloads? If you don't know
which container runtime you're using, it's likely a shared kernel — and your
multi-tenant workloads aren't as isolated as you might think. This talk
demonstrates how MicroVMs provide a hardened container runtime by giving each
workload its own kernel, enforced by hardware virtualization. We explore why
namespaces and cgroups are limited as security boundaries, walk through recent
container escape CVEs (Leaky Vessels, NVIDIAScape, runc masked-path race), and
survey the open-source MicroVM landscape — Firecracker, Cloud Hypervisor, Kata
Containers, and Edera. The session includes two live demos on a multi-tenant
Kubernetes cluster: first an attack that breaks container isolation on a
shared-kernel runtime, then the same attack contained by a MicroVM-based
runtime. Attendees leave with concrete steps to audit their own runtime,
hands-on resources including Edera On for reproducing the demos locally, and a
clearer mental model of where the container-as-security-boundary abstraction
breaks down.

<!-- markdownlint-disable MD013 -->

### London Platform User Group - The Road to Multitenancy: Running Secure Multi-Tenant Workloads at Scale

<!-- markdownlint-enable MD013 -->

- Type: Talk
- Date: 14th January 2026
- Event:
  [London Platform User Group (LoPUG)](https://www.meetup.com/london-platform-user-group-lopug/events/311100198)
- Resources:
  [Slides](https://talks.denhamparry.co.uk/2026-01-14-road-to-multitenancy.html)

Platform engineers face an impossible choice when running multi-tenant
workloads: security, performance, or scale—pick two. This talk explores the
fundamental trade-offs in container isolation, examining six different
approaches from separate machines to bare metal, and why each forces
compromises. Discover how traditional solutions like Kata Containers, gVisor,
and Firecracker sacrifice either speed or simplicity to achieve security, and
why shared kernel approaches fail compliance requirements. Learn about the
container runtime innovation that finally breaks the trilemma, delivering
VM-level isolation with near-native performance through paravirtualization. The
presentation includes a detailed comparison matrix, real-world use cases from
SaaS platforms to GPU-accelerated AI workloads, and practical guidance for
platform teams building secure, scalable multi-tenant systems without
architectural compromises.

## 2025

### Cloud Native Manchester - What I wish I knew about AI 10 days ago

- Type: Meetup
- Date: 4th December 2025
- Event: Cloud Native Manchester
- Resources:
  [Slides](https://talks.denhamparry.co.uk/2025-12-04-cloud-native-manchester.html)

This talk bridges the gap between AI hype and practical reality through
IvySketch, a production-ready GenAI application for generating custom Axolotl
characters. Rather than focusing on theoretical concerns about AI, this session
demonstrates real-world architecture patterns combining Ollama for LLM
processing, ComfyUI for image generation, NATS JetStream for async workflows,
and React with Server-Sent Events for real-time streaming. The presentation
covers full-stack Kubernetes deployment including GPU node scheduling, sealed
secrets management, Kustomize configuration, and comprehensive observability
with OpenTelemetry, Prometheus, and Grafana. Attendees learn how to build
AI-assisted applications with clean middleware patterns, distributed tracing,
and production-grade infrastructure rather than just leveraging AI tools for
development.

### Edera - Multi-Tenant Melee: Achieving Secure Isolation for Modern Container Platforms

- Type: Webinar
- Date: 20th November 2025
- Event: Edera Runtime Rumble
- Resources: [Recording](https://edera.link/vev4oth)

This Runtime Rumble session explores why shared-kernel Kubernetes multi-tenancy
can fall short as a security boundary, and how platform teams can evaluate
stronger isolation without giving up operational efficiency. The discussion
focuses on practical risks in modern container platforms and the trade-offs
between developer workflow, performance, and workload separation.

### Cloud Native Rejeckts - What I wish I knew about AI 10 days ago

- Type: Lightning Talk
- Date: 8th November 2025
- Event: Cloud Native Rejeckts
- Resources: [Recording](https://www.youtube.com/watch?v=-rtaWnFzGdA)

A lightning talk sharing insights on developing an application in 10 days using
an AI agent to write all the code.

### Edera - Tag Team Champions: Confidential Computing meets Edera

- Type: Webinar
- Date: 16th October 2025
- Event: Edera Runtime Rumble
- Resources: [Recording](https://www.youtube.com/watch?v=t_2TfygTlV8)

Confidential Computing promises hardware-based security for sensitive
workloads—but adoption hurdles and misconceptions remain. In this webinar,
Edera’s experts demystify confidential computing, compare it with
container-native isolation, and show how combining the two unlocks stronger,
more practical protections. Join us to learn when you need hardware-backed
trust, when software isolation is enough, and how to get both without
trade-offs.

### Edera - Let The Hardened Runtime Era Begin

- Type: Webinar
- Date: 26th August 2025
- Event: Edera Runtime Rumble
- Resources:
  [Recording](https://us06web.zoom.us/rec/component-page?eagerLoadZvaPages=&accessLevel=meeting&hasValidToken=false&clusterId=us06&action=play&filePlayId=&componentName=recording-register&meetingId=0mrWcyOekpaK5qQAhl6__tvKTHliIZuHU6U9Zm68thLg3qdlVvqt8ngDn_0xtXO9.RN75jIBtmvgVtdE2&originRequestUrl=https://us06web.zoom.us/rec/share/TtUmYC62cGbCNbiahRxMVWZbu4Mhmng7qR8-P1zjVFngvVpU6GS6jCdLeUIsD3Ta.d0Ou14Iad-NFzaj-)

Your security stack is living in the past while your threats are living in the
future. Modern applications and AI agents are outpacing traditional security
models. Detection-heavy tools flood teams with alerts but fail to prevent real
threats.

Edera is changing that.

Join us as we introduce the Hardened Runtime—a new security category
purpose-built to prevent breaches at the infrastructure level. Learn how
production-grade sandboxing, attack surface elimination, and instant breach
containment are reshaping how security teams think about runtime protection.

Whether you’re building agentic apps, running containers in production, or
leading cloud security architecture, this session will equip you with the
technical context and strategic framework to understand:

- Why detection-first runtime security is fundamentally broken
- What defines a Hardened Runtime (and how it compares to legacy solutions)
- How to secure AI workloads and cloud-native systems without slowing
  development
- What Edera’s approach means for security, DevOps, and innovation velocity

### Kubernetes London - Reimagining Container Runtimes: Security Without Sacrifice

- Type: Talk
- Date: 16th June 2025
- Event: Kubernetes London
- Resources: [Slides](/slides/202506_kuberneteslondon.pdf)

Modern container platforms force organizations into an impossible choice between
security, performance, and resource utilization. This talk challenges the status
quo by exploring how Edera's container-native hypervisor eliminates traditional
trade-offs through innovative architecture. We examine the fundamental security
problems with shared kernel approaches, analysing seven major container escape
vulnerabilities from 2022-2024 that exploit namespace limitations. Through
comprehensive benchmarks, we demonstrate how Edera Protect achieves Docker-level
performance while providing VM-like isolation, running on any commodity hardware
without specialized virtualization extensions. The presentation covers
breakthrough capabilities including secure privileged container support, GPU
driver isolation for AI workloads, and seamless Kubernetes integration requiring
only a simple runtime class change. We explore Apple's recent validation of
hypervisor-isolated containers and how this approach enables secure
multi-tenancy at scale. Attendees will discover practical solutions for running
sensitive workloads with strong isolation, strategies for eliminating the
development-to-production security gap, and emerging patterns in container
security architecture that prioritize both performance and protection.

<!-- markdownlint-disable MD013 -->

### KubeCon EU 2025 - Container Runtimes... on Lockdown: The Hidden Costs of Multi-tenant Workloads

<!-- markdownlint-enable MD013 -->

- Type: Talk
- Date: 04th April 2025
- Event: KubeCon EU 2025
- Resources: [Recording](https://www.youtube.com/watch?v=I9t7qfOjgbo)

Container runtimes form the bedrock of Kubernetes, but running diverse workloads
side-by-side introduces complex security challenges that many teams overlook.
This talk peels back the layers of container isolation, starting with the
fundamentals of how containers operate as Linux processes and evolving through
today's runtime landscape. We'll dive deep into the hidden costs and security
implications of different container runtime choices in multi-tenant
environments. Through real-world examples and performance benchmarks, we'll
explore the delicate balance between isolation and efficiency. You'll learn
about emerging solutions in the container runtime space and practical approaches
to securing workloads without sacrificing performance. Attendees will leave with
critical security considerations for choosing container runtimes, strategies for
workload isolation, and tools to evaluate isolation versus performance
trade-offs.

## 2024

### The Cloud-Native Club - Project Spotlight: Edera

- Type: Podcast
- Date: 26th September 2024
- Event: The Cloud-Native Club
- Resources:
  [Recording](https://www.youtube.com/live/MXdmKViYV9Y?si=jhyyU4EIf4Y1wCe0)

### OSS North America - The Overconfident Operator Vs the Nefarious Ne'er-Do-Well

- Type: Talk
- Date: 17th April 2024
- Event:
  [Open Source Summit North America](https://events.linuxfoundation.org/open-source-summit-north-america/)

Ozzie the Overconfident Operator has secured their cluster! They have done it
all: role-based access control, encryption at rest, TLS…and as they congratulate
themself on a job well done, Nova the Nefarious Ne'er-do-well watches from
around the corner, drooling with anticipation. Spoiler alert⎯Ozzie is about to
get HACKED. In this talk, the speakers play the characters of Ozzie and Nova and
playfully demo cluster security as Nefarious Nova exploits each of Ozzie's
security decisions. What can Overconfident Ozzie do when Nova gets the upper
hand? How can Ozzie proactively keep Nova's threats at bay? Take security beyond
the firewall and discover cloud native security concepts such as identity
management, container image scanning and signing, creating and implementing
policies, runtime security, and secrets management. Learn security basics
alongside Overconfident Ozzie, who is sure the cluster is COMPLETELY secure this
time. There is nothing Nova can do to break… uh-oh. Not again!

### KCD Guadalajara 2024 - The Overconfident Operator Vs the Nefarious Ne'er-Do-Well

- Type: Keynote
- Date: 23-24th February 2024
- Event: [KCD Guadalajara](https://ccoss.org/)

## 2023

### KubeCon NA 2023 - The Overconfident Operator Vs the Nefarious Ne'er-Do-Well

- Type: Talk
- Date: 08th November 2023
- Event: KubeCon NA 2023
- Resources: [Recording](https://www.youtube.com/watch?v=Y1rJY_UlLmM)

### KCD UK 2023 - Lightning Talk 2 aka WTF is the Journey

- Type: Lightning Talk
- Date: 17th October 2023
- Event: KCD UK 2023
- Resources: [Recording](https://www.youtube.com/watch?v=dR5T2qNAuCs&t=1s)

As per my
[X/Twitter post](https://x.com/denhamparry/status/1720177508279087147):

> I gave a lightning talk at KCD UK 2023, it was impromptu, sleep deprived,
> anxiety ridden, but described as a good rant. This is me sharing the advice I
> wish I had when I got started in my career

### Enlightning - Signed, Sealed, Delivered, I'm Yours! An Introduction to Sigstore

- Type: Discussion
- Date: 23rd March 2023
- Event: Enlightning
- Resources: [Recording](https://www.youtube.com/watch?v=8GKFzJaEHac)

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
- Date: 21st March 2023
- Event:
  [Manchester, UK](https://www.meetup.com/cloud-native-kubernetes-manchester/events/291823775/)

### Public Cloud Kubernetes London - _Some like it hot_ (SLSA)

- Type: Talk
- Date: 09th March 2023
- Event:
  [London, UK](https://www.meetup.com/public-cloud-kubernetes-london/events/291161443/)

### Fosdem - What Does Rugby Have To Do With Sigstore?

- Type: Talk
- Date: 04-05th February 2023
- Event:
  [Brussels, Belgium](https://archive.fosdem.org/2023/schedule/event/security_rugby_sigstore/)
- Resources:
  [Website](https://archive.fosdem.org/2023/schedule/event/security_rugby_sigstore/)

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

### KubeCon NA 2022 - Hack Back; Let's Learn Security With CTFs

- Type: Talk
- Date: 26-28th October 2022
- Event:
  [Detroit, USA](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/)
- Resources: [Recording](https://www.youtube.com/watch?v=IZXVWyKGHi4)

Threat actors have always been looking to attack clusters. Do you have the right
security in place to detect and defeat if they are targeting yours? Or they are
already in?

Kubernetes has become the de facto cloud operating system and production
environments have increased in maturity. So have the threats.

Security Teams don't necessarily have the expertise to detect state-of-art
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
- Date: 08-10th August 2022
- Event: [Kansas City, USA](https://www.kcdc.info/)

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
- Date: 08-10th August 2022
- Event: [Kansas City, USA](https://www.kcdc.info/)

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
our secrets aren't so secret any more.

Finally, `****S` will finish with case studies of where security first has won
and the instances where the secrets have been given away.

This talk will focus on the implementation of secrets based on cloud
technologies, but the core concepts can be used within any system and the best
practices that should be followed to give you a fighting chance to keep it to
yourself.

### DevSecCon24 - Threat Modelling Kubernetes: A Lightspeed Introduction

- Type: Talk
- Date: 14th June 2022
- Event: [Online](https://www.meetup.com/devseccon-wales/events/286041178/)

Cloud native container and Kubernetes systems bring new threats and risks to our
precious workloads. As cloud technologies undergo rapid innovation and new tools
and techniques emerge, security can get left behind. The answer to this
conveyor-belt of potential insecurity? Threat modelling! Join us for a primer on
threat modelling cloud native systems, understanding adversarial techniques and
preventative measures, and helping security and engineering teams increase the
security and velocity of system delivery.

### OWASP AppSec EU - The Hand That Feeds - How to Misuse Kubernetes

- Type: Talk
- Date: 09th June 2022
- Event: Online

We usually trust the hand that feeds, but what happens when we can't? How do we
run applications when there is little to no trust?

In this session, we're going to start by taking a look at attack paths in and
around Kubernetes, acting as a Red Team. We'll take advantage of an OWASP
vulnerability within a Supply Chain attack to give us an entry point. From
there, together we'll explore how an attacker can take further control of the
cluster via lateral and vertical movements.

Once we have your attention from seeing how this could be someone's worst day,
we'll look at how we can patch this attack up as a Blue Team. We'll see how
Kubernetes can mitigate some of this disaster, and what practices we should put
in place to further strengthen and defend our compute.

From attending this session, you'll leave with a Purple Team understanding of
core concepts within Kubernetes, that defence is strengthened with depth, and
how we can defend from Script Kiddies to Nation States.

### KubeCon EU 2022 - Threat Modelling Kubernetes: A Lightspeed Introduction

- Type: Talk
- Date: 19th May 2022
- Event: Feria Valencia, Valencia, Spain
- Resources: [Recording](https://youtu.be/gkXoYFKqQkE)

Cloud native container and Kubernetes systems bring new threats and risks to our
precious workloads. As cloud technologies undergo rapid innovation and new tools
and techniques emerge, security can get left behind. The answer to this
conveyor-belt of potential insecurity? Threat modelling! Join us for a primer on
threat modelling cloud native systems, understanding adversarial techniques and
preventative measures, and helping security and engineering teams increase the
security and velocity of system delivery.

### Cloud Native Security Days EU 2022 - CTF Overview and Experience

- Type: Talk / CTF
- Date: 16th May 2022
- Event: Feria Valencia, Valencia, Spain
- Resources: [Recording](https://youtu.be/YVlQS90SdaA),
  [Closing notes](https://youtu.be/93FdQUjzqow?t=490)

Prepare yourself for tomorrow's CTF event with a warm-up session based on
introductory SecurityCon CTF events. All experience levels are welcome!

Learn how to engage with confounding container breakouts, confusing Kubernetes
misconfigurations, and the art of engaging with CTF events to prepare yourself
for the high-flying no-holds-barred super-inverted gravity-defying capture the
flag event at SecurityCon tomorrow!

### NDC London 2022 - An Introduction to Kubernetes

- Type: Workshop
- Date: 09th May 2022
- Event:
  [NDC London](https://ndclondon.com/agenda/an-introduction-to-kubernetes-part-i-02zg/0vh9oah807o),
  Queen Elizabeth II Centre, London

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
- Date: 13th April 2022
- Event: [Cardiff, UK](https://www.meetup.com/devseccon-wales/events/285077006/)

### CNW / AI Wales - The One When We Went To Newport

- Type: Meetup
- Date: 07th April 2022
- Event: [Newport, UK](https://www.meetup.com/AI-Wales/events/284776918/)

### KernelCon - The Hand That Feeds: How to Misuse Kubernetes

- Type: Talk
- Date: 02nd April 2022
- Event: [Omaha, USA](https://kernelcon.org/)

We usually trust the hand that feeds, but what happens when we can't? How do we
run applications when there is little to no trust? In this session, we're going
to start by taking a look at attack paths in and around Kubernetes, acting as a
Red Team. We'll take advantage of an OWASP vulnerability within a Supply Chain
attack to give us an entry point. From there, together we'll explore how an
attacker can take further control of the cluster via lateral and vertical
movements. Once we have your attention from seeing how this could be someone's
worst day, we'll look at how we can patch this attack up as a Blue Team. We'll
see how Kubernetes can mitigate some of this disaster, and what practices we
should put in place to further strengthen and defend our compute. From attending
this session, you'll leave with a Purple Team understanding of core concepts
within Kubernetes, that defence is strengthened with depth, and how we can
defend from Script Kiddies to Nation States.

### .NET Beyond - The Hand That Feeds: How to Misuse Kubernetes

- Type: Talk
- Date: 31st March 2022
- Event: [Online](https://tanzu.vmware.com/developer/tv/dotnet-beyond/0012/)

We usually trust the hand that feeds, but what happens when we can't trust the
hand that feeds us? How do we run applications when there is little to no trust?

In this session, we're going to start by taking a look at attack paths in and
around Kubernetes, acting as a Red Team. We'll take advantage of an OWASP
vulnerability within a supply chain attack giving us an entry point. From there,
together we'll explore how an attacker can take further control of the cluster
via lateral and vertical movements.

Once we have your attention from seeing how this could be someone's worst day,
we'll look at how we can patch this up as a Blue Team. We'll see what we have
available from Kubernetes that can mitigate some of this disaster, and what
practices we should put in place to further strengthen and defend our compute.

From attending this session, you'll leave with a Purple Team understanding of
core concepts within Kubernetes, that defence is strengthened with depth, and
how we can defend from Script Kiddies to Nation States.

### KernelCon - Kubernetes Security: Learn By Hacking

- Type: Workshop
- Date: 30th - 31st March 2022
- Event: [Omaha, USA](https://kernelcon.org/)

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
- Date: 03rd March 2022
- Event: [Cardiff, UK](https://www.meetup.com/AI-Wales/events/283883339/)

### Private Kubernetes Training February 2/2

- Type: Training
- Date: 08th - 09th February 2022
- Event: Online

### Private Kubernetes Training February 1/2

- Type: Training
- Date: 02nd - 03rd February 2022
- Event: Online

### Private Kubernetes Training January 2022 2/2

- Type: Training
- Date: 26th - 27th January 2022
- Event: Online

### Private Kubernetes Training January 2022 1/2

- Type: Training
- Date: 20th - 21st January 2022
- Event: Online

### Tanzu Tuesdays - Kubernetes Capture the Flag - Again

- Type: Talk
- Date: 11th January 2022
- Event: [Online](https://tanzu.vmware.com/developer/tv/tanzu-tuesdays/0080/)

### Podcast - The KubeCon CTF

- Type: Podcast
- Date: 10th January 2022
- Event: [cosecast.com](https://cosecast.com/episode-8-kubecon-ctf)

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
- Date: 08th - 09th December 2021
- Event: Online

### Private Kubernetes Training December 2021 1/2

- Type: Training
- Date: 01st - 02nd December 2021
- Event: Online

### Tanzu Tuesdays November 2021 - Kubernetes CTF

- Type: Talk
- Date: 30th November 2021
- Event: [Online](https://tanzu.vmware.com/developer/tv/tanzu-tuesdays/0075/)

### BSides London November 2021 - Kubernetes CTF

- Type: CTF
- Date: 12th November 2021
- Event:
  [London, UK](https://web.archive.org/web/20220711204907/https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry)

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
- Date: 12th October 2021
- Event:
  [LA, USA / Online](https://events.linuxfoundation.org/cloud-native-security-conference-north-america/)
- Resources: [Introduction NA 2021](https://youtu.be/Bn_0NjvoDoo),
  [Walkthrough NA 2021](https://youtu.be/phKBYX6Pd_A)

Review of the Capture the Flag event hosted at Cloud Native Security Conference
NA that was part of KubeCon NA 2021.

### Private Kubernetes Security Training October 2021

- Type: Training
- Date: 04th - 06th October 2021
- Event: Online

### Private Kubernetes Training September 2021 2/2

- Type: Training
- Date: 22nd - 23rd September 2021
- Event: Online

### Klustered

- Type: Debugging
- Date: 16th September 2021
- Event: Online
- Resources: [Recording](https://www.youtube.com/watch?v=FClIbQ8hdxY)

### KCD UK

- Type: Conference
- Date: 16th September 2021
- Event:
  [Online](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-2021/)

### Private Kubernetes Training September 2021 1/2

- Type: Training
- Date: 15th - 16th September 2021
- Event: Online

### KCD UK - Kubernetes Threat Modelling Workshop

- Type: Workshop
- Date: 13th September 2021
- Event:
  [Online](https://www.eventbrite.co.uk/x/kubernetes-threat-modelling-tickets-169847718097)

### Private Kubernetes Security Training August 2021

- Type: Training
- Date: 23rd - 25th August 2021
- Event: Online

### Cloud Natives UK - with special guest Liz Rice and Andrew Martin

- Type: Meetup
- Date: 12th August 2021
- Event: Cloud Natives UK
- Resources: [Recording](https://www.youtube.com/watch?v=QkoD_GqmC_E)

### O'Reilly - Kubernetes Threat Modelling August 2021

- Type: Workshop
- Date: 10th August 2021
- Event:
  [Online](https://www.oreilly.com/live-events/kubernetes-threat-modeling/0636920055610/0636920055609/)

### Private Kubernetes Talk August 2021

- Type: Talk
- Date: 03rd August 2021
- Event: Online

### Private Kubernetes Training July 2021

- Type: Training
- Date: 21st - 22nd July 2021
- Event: Online

### Private Kubernetes Security Training July 2021

- Type: Training
- Date: 12th - 14th July 2021
- Event: Online

### Private Kubernetes Talk June 2021

- Type: Talk
- Date: 29th June 2021
- Event: Online

### Private Kubernetes Training June 2021 2/2

- Type: Training
- Date: 16th - 17th June 2021
- Event: Online

### Private Kubernetes Training June 2021 1/2

- Type: Training
- Date: 09th - 10th June 2021
- Event: Online

### Private Kubernetes Training May 2021

- Type: Training
- Date: 10th - 11th May 2021
- Event: Online

### Cloud Natives UK - with special guest Justin Garrison

- Type: Training
- Date: 06th May 2021
- Event: Cloud Natives UK
- Resources: [Recording](https://www.youtube.com/watch?v=JqOVC1ZKeBg)

### KubeCon Cloud Native Security Day - Capture The Flag EU 2021

- Type: CTF
- Date: 4th May 2021
- Event:
  [Online](https://events.linuxfoundation.org/cloud-native-security-day-europe/)
- Resources: [Capture the Flag overview](https://youtu.be/Bn_0NjvoDoo),
  [Capture The Flag Summary and Wrap Up](https://youtu.be/phKBYX6Pd_A)

Review of the Capture the Flag event hosted at Cloud Native Security Day EU that
was part of KubeCon EU 2021.

### Cloud Natives UK - with special guest Dan "Pop" Papandrea

- Type: Training
- Date: 25th March 2021
- Event: Cloud Natives UK
- Resources: [Recording](https://www.youtube.com/watch?v=EVPjtUuMeMQ)

## 2020

### Cloud Native Wales Meetup v2.0.2

- Type: Meetup
- Date: 16th November 2020
- Event: [Online](https://www.meetup.com/cloudnativewales/events/274550490/)

### Cloud Native Wales Meetup v2.0.1

- Type: Meetup
- Date: 29th September 2020
- Event: [Online](https://www.meetup.com/cloudnativewales/events/273116205/)

### Cloud Native Wales Meetup v2.0.0-alpha

- Type: Meetup
- Date: 09th April 2020
- Event: [Online](https://www.meetup.com/cloudnativewales/events/269794188/)

### Cloud Native Wales Meetup v1.8.0

- Type: Meetup
- Date: 12th March 2020
- Event: [Online](https://www.meetup.com/cloudnativewales/events/269166136/)

### Cloud Native Wales Meetup v1.7.0

- Type: Meetup
- Date: 13th February 2020
- Event: [Online](https://www.meetup.com/cloudnativewales/events/268445986/)

### PubConf London 2020 - You've Just Lost The Game

- Type: Talk
- Date: 31st January 2020
- Event: [London, UK](https://pubconf.io/events/2020/london/)

## 2019

### CNW / AI Wales - Christmas Social

- Type: Meetup
- Date: 18th December 2019
- Event: [Cardiff, UK](https://www.meetup.com/AI-Wales/events/266825245/)

### Cloud Native Wales Meetup v1.6.0

- Type: Meetup
- Date: 14th November 2019
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/266266702/)

### Cloud Native Wales Meetup v1.5.0

- Type: Meetup
- Date: 10th October 2019
- Event: Cardiff, UK

### Cloud Native Wales Meetup v1.4.0

- Type: Meetup
- Date: 12th September 2019
- Event: Cardiff, UK

### KCDC - What vulnerabilities? Live hacking of Containers and Orchestrators

- Type: Talk
- Date: 19th July 2019
- Event: [Kansas City, USA](https://kcdc2019.myconf.app/session/ses-134099)

### Cloud Native Wales Meetup v1.2.0

- Type: Meetup
- Date: 04th July 2019
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/csxbwqyzkbpb/)

### NDC Oslo - What vulnerabilities? Live hacking of Containers and Orchestrators

- Type: Talk
- Date: 20th June 2019
- Event: [Oslo, Norway](https://ndcoslo.com/)
- Resources: [Recording](https://www.youtube.com/watch?v=JaMJJTb_bEE)

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
- Date: 13th June 2019
- Event: [Meetup](https://www.meetup.com/cloudnativewales/events/csxbwqyzjbrb/)

### BlueConf - Contributing With No Code

- Type: Lightning Talks
- Date: 08th June 2019
- Event:
  [BlueConf](https://web.archive.org/web/20220521180658/https://blueconf.co.uk/)

### BlueConf - WTF is Cloud Native

- Type: Talk
- Date: 08th June 2019
- Event:
  [Cardiff, UK](https://web.archive.org/web/20220521180658/https://blueconf.co.uk/)

### µCon London 2019 - How do we become Cloud Native?

- Type: Talk
- Date: 29-31st May 2019
- Event: London, UK

### KubeCon EU - How we contributed to the community with no code

- Type: Lightning Talk
- Date: 19th May 2019
- Event:
  [KubeCon CloudNative Europe / Barcelona](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019)
- Resources: [Recording](https://www.youtube.com/watch?v=4jEASYCaVDo)

This time last year, two people from Wales, United Kingdom decided to bring the
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
- Date: 09th May 2019
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/csxbwqyzhbmb/)

### PubConf Minnesota 2019 - Captain Planet: Not the Hero We Want or Need

- Type: Talk
- Date: 08th May 2019
- Event: [Minnesota, USA](https://pubconf.io/events/2019/minnesota/)

<!-- markdownlint-disable MD013 -->

### NDC Minnesota 2019 - Scaling Microservices with Message Queues, DotNet Core and Kubernetes

<!-- markdownlint-enable MD013 -->

- Type: Talk
- Date: 07th May 2019
- Event: [Minnesota, USA](https://ndcminnesota.com/)

### Cloud Native Wales Meetup v0.12.0

- Type: Meetup
- Date: 11th April 2019
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/csxbwqyzgbpb/)

### Docker London - State of the Union Address

- Type: Meetup
- Date: 27th March 2019
- Event: [London, UK](https://www.meetup.com/Docker-London/events/257931060/)

### Cloud Native Wales Meetup v0.11.0

- Type: Meetup
- Date: 14th March 2019
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyzfbsb/)

### Podcast - CTO and Co-Founder Talk with Dave Albert

- Type: Podcast
- Date: 12th March 2019
- Event:
  [player.fm](https://web.archive.org/web/20220624230804/https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry)

Find out the parallels of mental health to monoliths versus microservices!

### Cloud Native Wales Meetup v0.10.0

- Type: Meetup
- Date: 07th February 2019
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyzdbsb/)

### PubConf London 2019 - Shaun of the Dev

- Type: Talk
- Date: 1st February 2019
- Event: [London, UK](https://pubconf.io)
- Resources: [Recording](https://www.youtube.com/watch?v=9NEGZQ3rRQ4)

Rapid-fire funny talks, musical acts, and comedy stunts from amazing developers.

### NDC London 2019 - Scaling Microservices with Message queues, .NET and Kubernetes

- Type: Talk
- Date: 30th January 2019
- Event: [London, UK](https://ndc-london.com)
- Resources: [Recording](https://www.youtube.com/watch?v=si44LvcgXwU)

When you design and build applications at scale, you deal with two significant
challenges: scalability & robustness. You should design your service so that
even if it is subject to intermittent heavy loads, it continues to operate
reliably. But how do you build such applications? And how do you deploy an
application that scales dynamically? Kubernetes has a feature called autoscaler
where instances of your applications are increased or decreased automatically
based on metrics that you define.

In this talk, you'll learn how to design, package & deploy reliable .NET
applications to Kubernetes & decouple several components using a message broker.
You will also learn how to set autoscaling rules to cope with an increasing
influx of messages in the queue.

### Cloud Native Wales Meetup v0.9.0

- Type: Meetup
- Date: 10th January 2019
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyzdbsb/)

## 2018

### Cloud Native Wales Meetup v0.8.0

- Type: Meetup
- Date: 12th December 2018
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxqbrb/)

### Cloud Native Wales Meetup v0.7.0

- Type: Meetup
- Date: 08th November 2018
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxpblb/)

### µCon London 2018 - One Monolith / One Macroservice / Many Microservices

- Type: Talk
- Date: 05th November 2018
- Event: London, UK

From working with a number of companies, the only constant is seeing that each
company has their own way of migrating from a monolith to a microservice
architecture, and it never working out as planned. In this talk Lewis will share
with you the idea of embracing your monolith and making it a macroservice. He'll
explore the benefits of this approach from both a technical and business
perspective, and plan how to convert this macroservice into microservices.

### Cloud Native Wales Meetup v0.6.0

- Type: Meetup
- Date: 11th October 2018
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxnbpb/)

### Cloud Native Wales Meetup v0.5.0

- Type: Meetup
- Date: 13th September 2018
- Event: [Meetup](https://www.meetup.com/cloudnativewales/events/lxwbppyxmbrb/)

### ProgNet London 2018 - Use Kubernetes to Deploy .NET Applications

- Type: Workshop
- Date: 12th September 2018
- Event: London, UK

With the explosive momentum of Docker, Kubernetes has become the de-facto
standard for orchestrating and managing containerised apps in production.

### Cloud Native Wales Meetup v0.4.0

- Type: Meetup
- Date: 09th August 2018
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxlbmb/)

### Cloud Native Wales Meetup v0.3.0

- Type: Meetup
- Date: 05th July 2018
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxkbqb/)

### Cloud Native Wales Meetup v0.2.0

- Type: Meetup
- Date: 20th June 2018
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxjbsb/)

### Cloud Native Wales Meetup v0.1.0

- Type: Meetup
- Date: 10th May 2018
- Event:
  [Cardiff, UK](https://www.meetup.com/cloudnativewales/events/lxwbppyxhbnb/)
