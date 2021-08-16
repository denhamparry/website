---
author: Lewis Denham-Parry
date: 2018-02-02T14:26:15Z
description: ""
draft: false
featured_image: /images/2018/02/magnet-1.png
slug: getting-started-with-openfass
title: Getting started with OpenFaaS
aliases:
    - "/getting-started-with-openfass/"
---

> This is a non-technical review of getting setup on a load of buzz words.  Spoiler alert: Its the most fun I've had with technology in a long time and is a lot easier than you think thanks to a talented and helpful community.

I went to NDC London to go on a two day Kubernetes workshop with [Ben Hall](https://twitter.com/ben_hall) and three days of talks.

Firstly, the workshop with Ben is fantastic.  If you haven't seen [Katacoda](https://www.katacoda.com) then that should be the next page you look at, its such a great teaching resource and I find myself going back to it to learn something new whenever I get some spare time in the day.

![Ben Hall Kubernetes Workshop](/images/2018/02/UNADJUSTEDNONRAW_thumb_3ab7.jpg)

Later in the week, I was looking forward to seeing a talk called *Building a Raspberry Pi Kubernetes Cluster and running .NET Core Cross-Platform Web Cloud*. I never thought of having a bare metal setup of Kubernetes due to the three major cloud providers offering great services, so was intrigued to know more and see .Net running on a Raspberry Pi.  The talk was presented by [Scott Hanselman](https://twitter.com/shanselman) and [Alex Ellis](https://twitter.com/alexellisuk).

The talk had Scott and Alex performing a great demo of how Kubernetes works on a Raspberry Pi cluster.  Instantly this connected with me and I understood what I've been missing since learning Kubernetes.  

> Having the *cloud* setup in front of you and using lights connected to the Pi's to display how Kubernetes works is the simplest way to understand whats going on.

Alex also introduced [OpenFaas](https://www.openfaas.com/), which lets you package anything as a serverless function.  I've been using Docker daily for the last year now, and I feel more comfortable using a container than I do without.  Alex and Scott demoed a C# application running as a serverless function using OpenFaas on a Raspberry Pi.  This was amazing but I was thinking that this was probably one of those nice projects that wouldn't work in the real world.

> This is the first time I've been to a talk and have not taken any decent photos as I was focused on the talk.  I was also on the River Thames the night before so might have been a little tired for the 9am start
 
![Reasons to be tired](/images/2018/02/UNADJUSTEDNONRAW_thumb_3b00.jpg)

I spent the rest of the conference thinking about the Raspberry Pi cluster, and how I wanted to replicate what I had seen.  As a software developer, I've been looking to work on some new device.  I've looked at IoT, I've played around with Alexa but nothing has really excited me enough to continue past creating a couple of applications.

> This gave me a goal of setting up my own Raspberry Pi cluster and get it working to show to others and hopefully get the same reaction as I had when I first saw it working.

From the start it was great, going into the attic and looking through boxes of *old* technical equipment, ordering a load of Raspberry Pis and a tower from the states which still hasn't arrived but the pictures look amazing.

![Shopping](/images/2018/02/UNADJUSTEDNONRAW_thumb_3b58.jpg)

This post isn't about walking through the setup, Alex and the community have done that for you.  If you're sold already then [click here](https://gist.github.com/alexellis/fdbc90de7691a1b9edb545c17da2d975) to get started, I'll add more links at the bottom of the post that I've found useful in getting OpenFaas setup and will post my own setup guide soon.

I managed to get everything working within about four hours over a weekend, with some *help* from my three year old intern.

![RaspberryPi Cluster and Intern](/images/2018/02/UNADJUSTEDNONRAW_thumb_3b63.jpg)

By the end of it, I was able to run my own C# serverless function.  I can send any text across to it and the responses will be transalted into Welsh (Source code is [here](https://github.com/denhamparry/dotnet-translate)).

![OpenFaas translating English to Welsh](/images/2018/02/Screen-Shot-2018-02-01-at-21.32.37.png)

Moving on, I'm now playing around with it, setting up lights on each Pi to show how many Pods are running on each one, attempting to setup LetsEncrypt until I realised I set it up wrong hitting my rate limitfor the week within 2 minutes and hosting a Ghost blog.  

> It has also been noticed that I've used ramekins as holders for the Pis, I'd recommend this method as you get to eat the desserts prior to setting up your cluster ([Ramekins available from here](https://www.tesco.com/groceries/en-GB/products/297297493?sc_cmp=ppc*GHS+-+Grocery+-+New*PX+%7C+Shopping+GSC+%7C+Top+Offers*PRODUCT+GROUP297297493*&gclid=EAIaIQobChMIotifnO-G2QIVshbTCh0igA5MEAkYBCABEgI_qfD_BwE&gclsrc=aw.ds)).

![Raspberry Pis in ramekins](/images/2018/02/UNADJUSTEDNONRAW_thumb_3b7a.jpg)

I've got several posts lined up with more technical information in regards to the setup but have purely been focused on making mistakes and understanding how it all works the last week.

Below are the links to resources that helped me getting started, but I'd be more than happy to help you out if you fancy setting this up yourself, just send me a [tweet](https://twitter.com/denhamparry).

![Raspberry Pis displaying running pods with lights](/images/2018/02/UNADJUSTEDNONRAW_thumb_3b81.jpg)

## References 

* [K8s on (vanilla) Raspbian Lite](https://gist.github.com/alexellis/fdbc90de7691a1b9edb545c17da2d975)
* [How To Build A Kubernetes Cluster With ARM Raspberry Pi Then Run NET Core On OpenFaas](https://www.hanselman.com/blog/HowToBuildAKubernetesClusterWithARMRaspberryPiThenRunNETCoreOnOpenFaas.aspx)
* [Raspberry PI Downloads](https://www.raspberrypi.org/downloads/raspbian/)
* [Etcher](https://etcher.io/)
* [Enable SSH on Raspberry Pi](https://www.raspberrypi.org/documentation/remote-access/ssh/)
* [Access Control: admin privileges](https://github.com/kubernetes/dashboard/wiki/Access-control#admin-privileges)
* [Kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
