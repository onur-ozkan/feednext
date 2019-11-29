ARG DEBIAN_VERSION
FROM debian:${DEBIAN_VERSION}

ARG NODE_VERSION

RUN apt-get update && apt-get install -y \
            sudo   \
            curl

RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} | sudo bash -

RUN sudo apt install -y nodejs

RUN npm install pm2 -g