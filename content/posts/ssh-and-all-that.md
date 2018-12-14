---
author: Lewis Denham-Parry
date: 2017-11-17T14:34:36Z
description: ""
draft: true
slug: ssh-and-all-that
title: SSH keys
---

## About SSH keys
Using the SSH protocol, you can connect and authenticate to remote servers and services. With SSH keys, you can connect to GitHub without supplying your username or password at each visit.

## Check for existing SSH keys

* Open Terminal.
* Enter `ls -al ~/.ssh` to see if existing SSH keys are present:
```bash
$ ls -al ~/.ssh
# Lists the files in your .ssh directory, if they exist
```
* Check the directory listing to see if you already have a public SSH key.

```bash
cat ~/.ssh/id_rsa.pub
```

## Generate a new SSH key

* Open Terminal.
* Paste the text below, substituting in your email address:
```bash
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
* This creates a new ssh key, using the provided email as a label.
```bash
Generating public/private rsa key pair.
```
* When you're prompted to "Enter a file in which to save the key," press Enter. This accepts the default file location.
```bash
Enter a file in which to save the key (/Users/you/.ssh/id_rsa): 
[Press enter]
```
* At the prompt, type a secure passphrase:
```bash
Enter passphrase (empty for no passphrase): [Type a passphrase]
Enter same passphrase again: [Type passphrase again]
```

---

## References

[Connecting to GitHub with SSH](https://help.github.com/articles/connecting-to-github-with-ssh/)