---
author: Lewis Denham-Parry
date: 2018-01-22T13:56:36Z
description: ""
draft: true
slug: tigerbay-api-review
title: Tigerbay API Review
---


## General Notes

* Where is the starting point on the booking journey?
    * e.g. On wireframe, villa is already selected.

## Nimble

* [Tigerbay Nimble](https://dev-nimble-trunk.tigberbaynet.co.uk)

### Booking API Walkthrough

#### Previously, in booking journey...

| URL | Method | Description
|---|---|---|
| /sales/reservations | POST | |
| /sales/reservations/{{id}} | GET | |
| /sales/reservations/{{reservationId}}/components | GET | |
| /accomSearch/searches | POST | Times are not relevant on check in/out |
| /accomSearch/searches/{{searchId}} | GET | searchId is a Guid
| /sales/reservations/{{reservationsId}}/components | POST | 
|---|---|---|

## Backend

* [Tigerbay Back office](https://dev-admin-trunk.tigberbaynet.co.uk/admin)

### Notes

* Can't book an Accon, can only book an Accon unit.
* Inventory suite manages allocations 

## Design Demo URLs

http://cv.forge.peteluffman.com/

### Search

http://cv.forge.peteluffman.com/search.html
http://cv.forge.peteluffman.com/search-prefiltered.html
http://cv.forge.peteluffman.com/search-prefiltered-hero.html
http://cv.forge.peteluffman.com/search-no-results-in-date.html
http://cv.forge.peteluffman.com/search-no-results-guest-count.html
http://cv.forge.peteluffman.com/search-no-results.html

### Private Collection

http://cv.forge.peteluffman.com/landing-private-collection.html
http://cv.forge.peteluffman.com/landing-resorts.html
http://cv.forge.peteluffman.com/landing-resort.html

### Villas

http://cv.forge.peteluffman.com/villa.html

### Destination

http://cv.forge.peteluffman.com/destinations.html
http://cv.forge.peteluffman.com/destination.html

### Blog

http://cv.forge.peteluffman.com/blog.html
http://cv.forge.peteluffman.com/blog-archive.html
http://cv.forge.peteluffman.com/blog-article.html

### Content

http://cv.forge.peteluffman.com/content-why-us.html
http://cv.forge.peteluffman.com/content-team.html
http://cv.forge.peteluffman.com/content-faqs.html
http://cv.forge.peteluffman.com/content-generic.html

### Enquiry

http://cv.forge.peteluffman.com/enquiry.html


## Architecture

### Definition

The web applicaiton consists of two tiers with a thin web site layer to provide information dispaly and capturing for the end user.  The second tier is a RESTful API proxy to the Tigerbay backened via the Nimble API.  This second tier includes as much application logic as possible including compound operation against Nimble.

The web application is a single entity focused on delivering the booking journey site.  The site will be rendered statically on the server and will also have the ability to manage client side to imporve usability and performance of the web applicaiton.  

#### To Discuss - Dynamic Data / Config

* Page structure and content will be supplied by a CMS service e.g. Umbraco.
* Page strucutre will be developed and set within the site per client.  Any dynamic data that is expected to change out of scope of future code releases will be accessed via a configuration setting.

A proxy will be setup to manage calls made to Nimble.  This will manage any complexities removing them from the web application.  Such examples would be object mapping (e.g. appending, flattening) and making mulitple calls during a single request (e.g. car hire, extras).  Redundancy for Nimble can be built into the layer with the addition of message queues.  This layer can also be scaled seperatly to the web application to manage traffic load.

Each application will be based with a container structure, continuous integration and continous deployment.  This will enable the developers to focus on code, reducing time to deploy code as well as enabling rollback incase of failed deployments.

### Container Setup

|          Layers          |
|---|
|   Site specific content  |
| Generic Tigerbay content |
|      Hosting Service     |
|       System Files       |
|     Operating System     |

### CI / CD

* Visual Studios Team Services
* Code Reviews
   * C#
    * [Stylecop](https://github.com/StyleCop)
  * JS
    * [JSHint](http://jshint.com)
  * TS
    * [Gulp Typescript](https://www.npmjs.com/package/gulp-typescript)
  * SASS
    * [Gulp Sass](https://www.npmjs.com/package/gulp-sass)
* Unit Tests
  * C# 
    * [XUnit](https://xunit.github.io)
    * [FakeItEasy](https://fakeiteasy.github.io)
  * TS
    * [Mocha](https://mochajs.org/)
    * [Chai](http://chaijs.com/)

### Application

#### Overall

* Logging(?)
* Hosting(?)

#### Booking Journey

* Stand alone web application
* ASP.NET Core 2
* [SASS](http://sass-lang.com)
* [Typescript](https://www.typescriptlang.org)
* CDN
* Local storage(?)

#### Nimble Proxy

* RESTful framework
  * [Nancy](http://nancyfx.org)?
* Message queuing(?)
  * Nimble redundancy
  * Statelessness?