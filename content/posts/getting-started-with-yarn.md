---
author: Lewis Denham-Parry
categories:
- yarn
- npm
date: 2017-07-05T16:03:04Z
description: ""
draft: false
image: /images/2017/07/feature-reliable.png
slug: getting-started-with-yarn
tags:
- yarn
- npm
title: Getting started with Yarn
---

One of my contracts were looking for a way to publish content via packages or content files (html, css, js).  They were looking to go for a Nuget solution but recommended using Bower from previous experiences.  Then came the part of loading the Bower website to see that they're now recommending Yarn, the package management system built on top of Node Package Manager (npm) but with added benefits.

These are the steps I went through to produce a proof of concept:

## Requirements

* Access to a git account
* Install [npm](https://www.npmjs.com/package/npm)
* Create and account with [npm](https://www.npmjs.com)
* In this demo, I use [Yo](*npm install -g yo*) to create a default site.  You can use this or any other site to show proof of concept.

## Install Yarn

So here's the irony:

```command
npm install -g yarn
```

You need to use npm to install yarn.

## Create a new project

We'll start off by create a repository for our package.  We're going to create a git project, go into the folder and then create a package.json file by using the yarn init command:

```command
git init yarn-time
cd yarn-time
yarn init
```

Yarn will ask you some questions:

* **Name**: This is the unique name of your package
* **Version**: The initial version number of the package, the number must increment with further releases
* **Description**: Provide an understanding of your package
* **Main**: Define the entry point of your code
* **Repository URL**: Optional reference to source code location
* **Author**: Put your name on it! (format: "Your Name <you@example.com> (http://your-website.com)
* **Licence**: Code usage licence

This creates the *package.json* file, an example is below:

```json
{
  "name": "denhamparry-yarn-time",
  "version": "1.0.0",
  "description": "This is another test",
  "main": "index.js",
  "author": "Lewis Denham-Parry <lewis@denhamparry.co.uk>",
  "license": "MIT"
}
```

**Additional fields for *package.json***

* **keywords**: is a list of terms that other developers can search for to find your package or related packages.
* **homepage**: is a url to point users to a website that informs them on the package with an introduction, documentations, and links to additional resources.
* **bugs**: is a url to point users of your package to if they discover an issue with your package.
* **contributors**: is a list of contributors to the package. If there are other people involved in your project, you can specify them here.
* **files**: is a list of files that should be included in your package when published and installed. If unspecified Yarn will include every file.
* **bin** is a mapping of cli commands (binaries) for Yarn to create for the package when installing it.

I've put my test package on [github](https://github.com/denhamparry/yarn-demo), and here's the current *package.json* file:

```json
{
  "homepage": "https://github.com/denhamparry/yarn-demo",
  "bugs": "https://github.com/denhamparry/yarn-demo/issues",
  "name": "denhamparry-yarn-demo",
  "version": "1.0.2",
  "description": "A demo yarn package",
  "main": "index.js",
  "files": [
    "alert.js",
    "ninjacat.jpg",
    "test.txt",
    "yarn-demo.css",
    "test.html"
  ],
  "repository": "https://github.com/denhamparry/yarn-demo.git",
  "author": "Lewis Denham-Parry <lewis@denhamparry.co.uk>",
  "license": "MIT"
}
```

## Publishing

We now have a project with a configured *project.json* file to publish.  To do this with Yarn, type the following command in the project directory:

```command
yarn publish
```

You'll be asked for your username and password for NPM as Yarn is built on top of NPM.  It may also ask to increment to a new version number.

If for whatever reason the package fails to publish, you can revert to NPM:

```command
npm publish
```

You can view the published project on your NPM repository, here is a link to the one I'm using in this example, [denhamparry-yarn-demo](https://www.npmjs.com/package/denhamparry-yarn-demo).

## Creating A New Web Project

So as we have a published project in NPM, we can now access it in another project.  For this I'll create a new ASP.NET project using Yeoman:

```command
yo aspnet
```

For the purpose of this demo, select the *Web Application Basic [without Membership and Authorization]* project.  This will generate a site that we can build and run locally as a proof of concept.

Select either UI framework and then type a relevant name for your demo site.  I created *yarn-demo-site* and the source files can be viewed [here](https://github.com/denhamparry/yarn-demo-site) on Github.

Yo will give you the commands required to build and run your project, an example of which can be seen below:

```command
cd "yarn-demo-site"
dotnet restore
dotnet build (optional, build will also happen when it's run)
dotnet run
```

## Referencing Your Project

Within the project directory, type the following command to add the package.  Replace *denhamparry-yarn-demo* with your own package name thats used on NPM :

```command
yarn add denhamparry-yarn-demo
```

And that's it!  You should see the package within the *node-modules* folder.

![](/content/images/2017/07/denhamparry-yarn-demo.png)

## References

[GitHub: yarn-demo](https://github.com/denhamparry/yarn-demo) 

[GitHub: yarn-demo-site](https://github.com/denhamparry/yarn-demo-site)

[NPM Repository: denhamparry-yarn-demo](https://www.npmjs.com/package/denhamparry-yarn-demo)

[Yarn Documentation](https://yarnpkg.com/en/docs/package-json)


