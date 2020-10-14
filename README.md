# mTxServ Official Discord Bot

This bot is developed with `discord.js` and `discord commando`.

![Help Command](doc/help.png)
![GameServer Command](doc/server.png)
![Minecraft Version & Modpack Command](doc/version.png)
![HowTo Command](doc/howto.png)


## Installation

```
docker-compose build
docker-compose up -d
docker-compose exec bot bash
yarn install
cp .env.dist .env
```

## Configuration

Copy the `.env.dist` to `.env`. Don't forget to edit it.

```
cp .env.dist .env
```

## Dev

If the `dev` flag, the `BOT_TOKEN_DEV` will be used tu run the bot:

```
nodejs bot.js -dev
```

## Prod

```
nodejs bot.js
```
