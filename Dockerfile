FROM ubuntu:24.04

ARG HUGO_VERSION=0.87.0
ENV DOCUMENT_DIR=/hugo-project

RUN apt-get update && apt-get upgrade -y \
      && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
           ruby ruby-dev make cmake build-essential bison flex curl \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/* \
      && rm -rf /tmp/*
RUN gem install --no-document asciidoctor asciidoctor-revealjs \
         rouge asciidoctor-confluence asciidoctor-diagram coderay pygments.rb

ADD https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz /tmp/hugo.tgz
RUN cd /usr/local/bin && tar -xzf /tmp/hugo.tgz && rm /tmp/hugo.tgz

RUN mkdir ${DOCUMENT_DIR}
WORKDIR ${DOCUMENT_DIR}

VOLUME ${DOCUMENT_DIR}

RUN useradd -m hugo
USER hugo

HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:1313/ || exit 1

CMD ["hugo","server","--bind","0.0.0.0", "--buildDrafts"]
