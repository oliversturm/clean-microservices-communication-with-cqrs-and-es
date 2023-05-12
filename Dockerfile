FROM node:lts

RUN apt update && apt install -y \
    tmux \
    wait-for-it \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .  

# command processor
EXPOSE 3001
# readmodel customers
EXPOSE 3003
# readmodel orders
EXPOSE 3005
# change notifier
EXPOSE 3006
# react app
EXPOSE 3000
# svelte app
EXPOSE 3010

CMD wait-for-it -t 0 mongo:27017 -- npm start
