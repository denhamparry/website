---
author: Lewis Denham-Parry
categories:
- workshop
- alexa
- amazon
- aws
date: 2017-11-15T09:17:37Z
description: ""
draft: false
featured_image: /images/2017/11/amazonEchoBanner.jpg
slug: alexa-bristol-workshop-november-2017
tags:
- workshop
- alexa
- amazon
- aws
title: Alexa Bristol Workshop November 2017
aliases:
    - "/alexa-bristol-workshop-november-2017/"
---

Attended an Alexa Workshop on the 3rd November 2017 in Bristol hosted by Amazon, these are my notes.

## Introduction

Hosted by [David Low](https://twitter.com/daviddlow)

### Twitter Accounts

* [maxamorde](https://twitter.com/maxamorde)
* [muttonia](https://twitter.com/muttonia)

[Alexa Design](https://alexa.design)
[Alexa Build](https://alexa.design/build)

[Course sign-up link](https://alexa.design/daviddlow)

[Amazon Developer](https://developer.amazon.com)
[Amazon AWS](https://aws.amazon.com)

## Theory

Mobile moment: when someone picks up a device to achieve a goal.
e.g. watching football in front of the tv, get extra detail.
Ask person next to you, why not shout it towards the tv.

### Disruptions and Expectations

> Expectation is shifting

70s. Character mode => Teletext
80s. Graphical Interaction
90s. Web
00s. Mobile Smartphone
Present. Voice Interface

* Amazon believes voice is the next disruption.
* China at 30% already.

> Act less like computers and more like people.

* Expectations need to be met early and met well.
* The beam is used to record from one of six microphones.
* Echo dot in the car can be useful...
* 250,000 marriage proposals to Alexa (circa 2016) => number of times an answer has been returned to the question.

## Why Voice

* Started off with engineers wanting to talk to a computer like in Star Trek.
* Base voice commands on cars.
* Alexa is opening up to cars, any skill built will be available within a car.
  * BMW have announced that the Mini will have a dedicated Alexa dashboard 2018 Q1.
* Alexa used as an egg timer in kitchens.
  * Campbell's soup added an app to have a talk by talk to cook a recipe.
  * Integrated oven links with Alexa and recipe when the oven temperature is ready.
* Get used to controlling the house by voice fairly quickly.
* New Alexa home tech built in to integrate directly to IoT at home.

> Walt Mossberg: ambient computing, the transformation of the environment... *photo taken*

## The Alexa Service

1. Alexa Skills Kit
    * SDK can connect to anything with linux, a microphone and speaker.
1. Amazon Alexa
    * Lives in the cloud.
    * Automated Speech Recognition.
    * Natural Language Understanding.
    * Always learning.
1. Alexa Voice Services
    * *missed slide*.

* 25k skills, recently released:
  * Ocado => 'Alexa, ask Ocado to add carrots to my shopping list'.
  * DVLA => 'Alexa, open Vehicle Enquiry'.
  * EasyJet => 'Alexa, ask EasyJet if my flight is on time'.
  * Dominos => 'Alexa, ask Domino's to feed me'.
  * Alexa => 'Alexa, open My O2'.

> DVLA => Not losing jobs, taking away the short, repetitive tasks (easy answers), focus on the harder, longer ones.

* Amazon doesn't care where the device is being bought from, just that its being bought.
* Amazon believes 99% of words are currently recognized.
* Speech recognition accuracy over time will be at 99% expected around 2020 by industry.

* Add photo on Rapid Advancement*

## Under the hood

1. User says something (mp3 file to the cloud).
1. Apply Natural Language Model to figure out the intent.
1. The intent gets sent to the back end.
1. Your service then processes the request.
1. Respond to intent through text and visual.
1. You pass back a textual or audio response / You pass back a graphical response.

* This process takes about 0.5 seconds.

## Two Ends of a Skill

* Skill configuration
  * User facing setup and configuration of all skills is handled here.

* Back end code
  * Can be hosted anywhere you want.
  * Requires HTTPS.

> Alexa at heart is a voice service and will always be a voice service.
> Weather: assumes the request is for now, rather than any other time.

## Example Skill - Coffee Now

* Invocation Name
  * Has to be 2 words unless its a brand name.
  * *e.g. Coffee Now*
* Intents / Function
  * To do something.
  * *e.g. Order coffee*
* Sample Utterances
  * For every intent, you require a sample utterance.
  * *e.g. Order a small cappuccino*
* Slots / Variables
  * Sometimes theres a variance.
  * *e.g. Coffee Size/Type, type of milk*
* Code / Logic
  * Processing the request.
  * *e.g. Advise cost, place order, advise wait time.*

### Invocation words and names

> Open, launch and play are all the same.
> Ask, tell

* One Shot
* Conversational
* Open Only

``` bash
Alexa, ask National Rail for my commute.
Alexa, open Just Eat.
Alexa, tell Uber to get me a ride.
Alexa, launch Cat Facts.
Alexa, play Reindeer Trivia.
Alexa, ask Coffee Now.
```

### Intents and Slots

* Each intent consists of two fields.
* Slots can include types.

### Sample Utterances

*Photo taken.*

### Custom Slots

*Photo taken.*

### Putting It All Together

Alexa           Always start here
ask             Invocation word
Coffee Now      Invocation name
to
order me        Intent: OrderCoffee
a
large           Slot: CoffeeSize
skinny          Slot: CoffeeMilk
cappuccino      Slot: CoffeeType
please

### Types of Request

* LaunchRequest.
* IntentRequest.
* SessionEndedRequest.
* All requests contain consistent metadata.

---

## Morning Coffee Break

---

## CODING DEMO

---

## LUNCH

---

## Developer Advocate - Talk from [Jamie Grossman](https://twitter.com/jamielliottg)

### Intents

* Individual parts of the skill.
* Think of a game, turn left, turn right.
* Built-in intents - Amazon built in to help out.
* Custom intents for the USP of the skill.

### Slots

* Use slots as input values.
* Allows the user to provide more contextual information.
* Created by the developer, the custom slot consists of a list of possible values.
* Built-in slots for commonly used values are available.

### Utterances

* Brings everything together.
* A list of possible phrases that map to intents.
* Must provide as many as possible to improve skill's accuracy.
* Can include slots from custom/built-in slot types.

> When building skills, focus on your interaction models.

To test apps online you can use [Echosim](https://echosim.io)

---
