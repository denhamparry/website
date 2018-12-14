---
author: Lewis Denham-Parry
date: 2018-02-01T10:53:50Z
description: ""
draft: true
slug: mining-cryptocurrencies-with-docker
title: Mining Cryptocurrencies with Docker
---

## References

* [Mine with Docker](https://github.com/alexellis/mine-with-docker)

```bash
docker service create --mode=global \
  --name miner alexellis2/cpu-opt:2018-1-2 ./cpuminer \
  -a hodl \
  -o stratum+tcp://hodl.uk.nicehash.com:3352 \
  -u dcd94952-b703-49ff-8ec0-efffa3d84f46
```