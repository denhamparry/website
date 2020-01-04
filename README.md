# DenhamParry

Hugo website for DenhamParry

[![Netlify Status](https://api.netlify.com/api/v1/badges/be517ba3-db85-404a-a5f0-e8a953d4aaed/deploy-status)](https://app.netlify.com/sites/denhamparry/deploys)

## Development

TL;DR

```
$ make hugo_serve
```

### Git Submodules

```
$ git submodule update --init --recursive
```

### Docker

```
$ docker build -t denhamparry/hugo .
$ docker run --rm -it -v $PWD:/src -p 1313:1313 denhamparry/hugo hugo server -w --bind=0.0.0.0
```