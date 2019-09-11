# Cactuar
> A Discord bot for managing feedback in music production servers.

[![Build Status][travis-image]][travis-url]

Cactuar is a custom chat bot for music production Discord communities. The bot addresses the need for automating the moderation of feedback channels.

The issue is that in channels dedicated to artist feedback many users do not give others feedback, only dropping their tracks and expecting other people to give them feedback. This causes these channels to just be flooded with spam and provide very little value. The bot prevents anyone from sharing their music unless they pass a requirement of providing feedback to others first. It does this by analysing the messages in the channel and using an algorithm to assign a score, once the threshold has been passed the bot will allow users to post there track, updating records in the process.

There are several other beneficial commands, and an experience/leveling system in order to 'gamify' the process, in the hopes to encourage and reward those who contribute the most.

![](header.png)

## Installation

Preferd method for deployment is through the Docker image. It's created through a multistage build and includes PM2 running on Node-Alpine-Latest. You must include the nessessary enviromental variables as arguments with the run command.

If you chose to clone the repo be aware there is a .env file you can populate instead.

Currently there is no docker-compose stack, so you will need to have your own PostgreSQL server. This will be done soon.

### Docker container (prefered method)

1) Setup PostgreSQL DB

```sh
Execute the bot.sql file found in /backend/src/queries/bot.sql
```

2) Deploy docker container using the image from Docker Hub.

```sh
docker container run -d --name cactuar-dev --restart always \
--env NODE_ENV='production' \
--env TOKEN='n0t.A.reaL.t0Ken' \
--env DB_HOST='' \
--env DB_NAME='' \
--env DB_USER='' \
--env DB_PASS='' \
--env LASTFM='n0t.A.reaL.t0Ken' \
--env YOUTUBE='n0t.A.reaL.t0Ken' \
--env FREESOUND='n0t.A.reaL.t0Ken' \
headhertz/cactuar:latest
```

### Standard Method

1) Clone the repo and install dependancies:

```sh
git clone https://github.com/KyteProject/Cactuar.git
cd cactuar/backend
yarn install
```

2) Setup PostgreSQL DB

```sh
Execute the bot.sql file found in /backend/src/queries/bot.sql
```

3) Populate the .env file with enviromental variables:

```sh
vim .env
```

4) Build and deploy:

```sh
yarn deploy
```

## Development setup

1) Clone the repo and install dependancies:

```sh
git clone https://github.com/KyteProject/Cactuar.git
cd cactuar/backend
yarn install
```

2) Setup PostgreSQL DB

```sh
Execute the bot.sql file found in /backend/src/queries/bot.sql
```

3) Populate the .env file with enviromental variables:

```sh
vim .env
```

4) Execute dev script:

```sh
yarn dev
```

## Release History

* 3.1.1
    * Added 'About' command
* 3.1.0
    * Fixed role checking.
    * Added Dockerfile.
    * Added feedback blocking system allowing staff to completely block a user from requests.
    * Updated commands descriptions.
* 3.0.0
    * Rebuilt to be much much cleaner and fully class based.
* 2.0.0
    * Rewrote to extend functionality and accept multi-server configurations.
* 1.0.0
    * Simple concept, operates on single server only.

## Meta

Daniel Smith – daniel.smith@ukemi.ninja

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/KyteProject/Cactuar](https://github.com/KyteProject/)

## Contributing

1. Fork it (<https://github.com/KyteProject/Cactuar/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
