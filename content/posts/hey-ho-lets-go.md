---
author: Lewis Denham-Parry
date: 2018-05-24T17:50:20Z
description: ""
draft: true
slug: hey-ho-lets-go
title: Hey ho, Lets Go!
---

## Install Go

* https://golang.org/doc/install
* Download package and install.

## Lets Go on tour...

* https://tour.golang.org/
* https://gitlab.com/denhamparry/LetsGoOnATour
* https://blog.golang.org/playground

## Uninstall Go

To remove an existing Go installation from your system delete the go directory. This is usually */usr/local/go* under Linux, Mac OS X, and FreeBSD or *c:\Go* under Windows.

You should also remove the Go bin directory from your PATH environment variable. Under Linux and FreeBSD you should edit */etc/profile* or *$HOME/.profile*. If you installed Go with the Mac OS X package then you should remove the */etc/paths.d/go* file. Windows users should read the section about setting environment variables under Windows.

## Go Cli

### Why?

> The Go programming language is an open source project to make programmers *more productive*.
> [https://golang.org](https://golang.org)
 
* Effcient.
* Clean.
* Expansive.

All the tools are centralised in a central tool called **Go**.

* Building applications.
* Testing applications.
* Profiling applications.
* Managing workspaces.
* Interacting with enviroment.

```bash
$ go
Go is a tool for managing Go source code.

Usage:

        go command [arguments]

The commands are:

        build       compile packages and dependencies
        clean       remove object files and cached files
        doc         show documentation for package or symbol
        env         print Go environment information
        bug         start a bug report
        fix         update packages to use new APIs
        fmt         gofmt (reformat) package sources
        generate    generate Go files by processing source
        get         download and install packages and dependencies
        install     compile and install packages and dependencies
        list        list packages
        run         compile and run Go program
        test        test packages
        tool        run specified go tool
        version     print Go version
        vet         report likely mistakes in packages

Use "go help [command]" for more information about a command.

Additional help topics:

        c           calling between Go and C
        buildmode   build modes
        cache       build and test caching
        filetype    file types
        gopath      GOPATH environment variable
        environment environment variables
        importpath  import path syntax
        packages    package lists
        testflag    testing flags
        testfunc    testing functions

Use "go help [topic]" for more information about that topic.

```