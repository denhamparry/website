---
author: Lewis Denham-Parry
categories:
- linux
- ncdu
date: 2019-03-15T22:21:36Z
description: "NCDU - How within 3 minutes on a Friday night I saved 10gb+ of space on my Mac"
draft: true
featured_image: /images/2019/03/ncduheader.png
slug: ncdutotherescue
tags:
- ncdu
- cleanup
title: ncdu TO THE RESCUE
---

## So what happened

It was Friday night, I had a long week and was just shutting everything down when I saw a tweet:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Just about to go to bed but found this, and well, what a great start to the weekend! <a href="https://t.co/KTZ5QXFlnU">pic.twitter.com/KTZ5QXFlnU</a></p>&mdash; Lewis Denham-Parry (@denhamparry) <a href="https://twitter.com/denhamparry/status/1106680779256594433?ref_src=twsrc%5Etfw">March 15, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Why was I so excited?  In 2012 I had a 120gb hard drive running 2 operating systems to develop on (and that was before containers).

I was new to MacOS, and quickly ran into disk space errors, the error being that there wasn't any.

I was looking for solutions which led me down a rabbit hole of GUIs, none of which worked and just spawned ads.

Since then, I've found a love for bash and using terminal.

## What is ncdu

__NCurses Disk Usage__ (Ncdu) is a disk usage analyzer with an ncurses interface. It is designed to find space hogs on a remote server where you don't have an entire graphical setup available, but it is a useful tool even on regular desktop systems. Ncdu aims to be fast, simple and easy to use, and should be able to run in any minimal POSIX-like environment with ncurses installed.

* [More information](https://dev.yorhel.nl/ncdu)

## Setup

Lets get it installed:

### 1) Install Homebrew

[Homebrew](https://brew.sh) is the missing package manager for macOS (or Linux)

To install, run this command within the terminal prompt:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Follow the command prompts and you're done!

### 2) Install ncdu

We can use Homebrew to install ncdu using:

```bash
brew install ncdu
```

### 3) Use ncdu

Within your terminal type ncdu within the directory you're trying to :

