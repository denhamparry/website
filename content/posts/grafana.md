---
author: Lewis Denham-Parry
date: 2018-01-29T23:34:50Z
description: ""
draft: true
slug: grafana
title: Grafana
---

## References

* [Grafana Json](https://github.com/openfaas/faas/blob/master/contrib/grafana.json)
* [AB Load Testing](https://stackoverflow.com/questions/12732182/ab-load-testing)

## Load Testing

```sh
$ ab -k -c 350 -n 2000 192.168.1.220:31112/function/dotnet-ping
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 192.168.1.220 (be patient)
Completed 200 requests
Completed 400 requests
Completed 600 requests
Completed 800 requests
Completed 1000 requests
Completed 1200 requests
Completed 1400 requests
Completed 1600 requests
Completed 1800 requests
Completed 2000 requests
Finished 2000 requests


Server Software:
Server Hostname:        192.168.1.220
Server Port:            31112

Document Path:          /function/dotnet-ping
Document Length:        0 bytes

Concurrency Level:      350
Time taken for tests:   11.196 seconds
Complete requests:      2000
Failed requests:        0
Non-2xx responses:      34
Keep-Alive requests:    1998
Total transferred:      447858 bytes
HTML transferred:       0 bytes
Requests per second:    178.64 [#/sec] (mean)
Time per request:       1959.231 [ms] (mean)
Time per request:       5.598 [ms] (mean, across all concurrent requests)
Transfer rate:          39.07 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0   17  38.4      0     134
Processing:    17  611 393.9    549    7999
Waiting:       17  603 317.0    549    1630
Total:         17  628 406.0    560    7999

Percentage of the requests served within a certain time (ms)
  50%    560
  66%    717
  75%    806
  80%    863
  90%   1052
  95%   1326
  98%   1462
  99%   1599
 100%   7999 (longest request)
```