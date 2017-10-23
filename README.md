# Certificate dashboard [Original project](https://github.com/cmrunton/tls-dashboard)

Responsive web app that checks when certificates will expire. Serves HTML & JSON so you can consume the service elsewhere.

![banner](certificate-check.png "Banner app preview")

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ bin/setup
$ foreman s
```

Environment variables

```sh
MONITORED_CERT_HOSTS="www.mysitethatsupportssl.com, www.othersitessl.com"
DAYS_LEFT_DANGER=10
DAYS_LEFT_WARNING=20
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Running with Docker

Set environment variables in the docker-compose.yml file.
Build and start the application.

```sh
docker build -t certificate-dashboard .
docker-compose up
```

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku config:set MONITORED_CERT_HOSTS="www.mysitethatsupportssl.com, www.othersitessl.com"
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
