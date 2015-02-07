Kalabox App Examples
===================

Create `~/kalabox/kalabox.json` and add the following to it

```json
  {
    "home": "/Users/(YOURUSERNAME)",
    "appsRoot": "/Users/(YOURUSERNAME)/Desktop/kalabox-app-examples",
    "sysConfRoot": "/Users/(YOURUSERNAME)/.kalabox"
  }
```
then

```
  cd ~/Desktop
  git clone https://github.com/kalabox/kalabox-app-examples.git
  kbox # you should see "hotsauce" list as an app now
  kbox hotsauce pull
  kbox hotsauce build
  kbox hotsauce init
  kbox hotsauce start
```

Now visit `http://hotsauce.kbox` in your browser. It will likely tell you "no input file specified".

```
  # May need to set export DOCKER_HOST=tcp://1.3.3.7:2375 first
  docker exec -it kb_hotsauce_web /bin/bash
  # Now should be inside the docker container
  echo "<?php phpinfo(); ?>" > /data/code/index.php
  exit
```

Refresh your browser for the phpinfo page. Try downloading and installing drupal. The DB creds are currently

```
db: kalabox
u: kalabox
p:
host: hotsauce.kbox
```

Eventually all config will be stored in the environment.

### App Config

You will also see a `config` folder in the root of the hotsauce app. This allows you to easily change the settings of your services. For example, go into `config/php/php.ini` and change the `memory_limit` to something else. Then a simple `kbox hotsauce stop` and `kbox hotsauce start` and your new settings are there!

### App Kalabox.json

Currently the kalabox.json lets you specify which plugins and containers you want to use. Plugins and dockerfiles are looked for locally first, then in the kalabox source and finally on npm/dockerhub. Only 4 types of containers are currently supported. Additionally your `web` container is going to want set the proxy key.

```json
{
  "appName": "hotsauce-app",
  "appPlugins": [
    "hotsauce-plugin-drush",
    "hotsauce-plugin-hotsauce",
    "hotsauce-plugin-share"
  ],
  "appComponents": {
    "data": {
      "image": {
        "name": "hotsauce/data",
        "build": true,
        "src": "dockerfiles/hotsauce/data"
      }
    },
    "db": {
      "image": {
        "name": "kalabox/mariadb",
        "build": true,
        "src": "dockerfiles/kalabox/mariadb"
      }
    },
    "php": {
      "image": {
        "name": "hotsauce/php-fpm",
        "build": true,
        "src": "dockerfiles/hotsauce/php-fpm"
      }
    },
    "web": {
      "image": {
        "name": "hotsauce/nginx",
        "build": true,
        "src": "dockerfiles/hotsauce/nginx"
      },
      "proxy": [
        {
          "port": "80/tcp",
          "default": true
        }
      ]
    }
  }
}
```
