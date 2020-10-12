FROM node:latest

ENV DEBIAN_FRONTEND="noninteractive"

# Set timezone
RUN rm /etc/localtime && ln -s /usr/share/zoneinfo/Europe/Paris /etc/localtime

RUN curl -sS http://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y \
    git \
    gnupg \
    yarn \
    nano \
    && rm -rf /var/lib/apt/list*

WORKDIR /bot

CMD tail -f /dev/null
