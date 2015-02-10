Kalabox App Examples
===================

Here are a bunch of app examples that you can use as starting points for crafting some Kalabox apps. Will detail some generic info here but you should
consult the README in each folder for more pertinent info that those apps. And of course please check out the main kalabox readme over [here](https://github.com/kalabox/kalabox).

## Setup

Right now you need to tell Kalabox where your apps live. If you want to play around with these examples you should do something like this first.

Create `~/kalabox/kalabox.json` and add the following to it. This is a Mac OSX example with a fake user. You will want to use your own stuff.

```json
  {
    "home": "/Users/tswift",
    "appsRoot": "/Users/tswift/Desktop/kalabox-app-examples",
    "sysConfRoot": "/Users/tswift/.kalabox"
  }
```

Now actually grab the examples!

```
  cd ~/Desktop
  git clone https://github.com/kalabox/kalabox-app-examples.git
  kbox # you should see "pressflow7" and "drupal7" list as an app now
```

To install and run an app just go into the app folder and do something like this. We will use `pressflow7` as the example here.

```
cd pressflow7
npm install
kbox install
kbox start
```

Now visit `http://pressflow7.kbox` in your browser. It will likely tell you "No input file specified". To add code to your project you should now have a directory
at `~/kalabox/code/pressflow7`. Put your code in there to do all the things.

## Scoping your containers for ports and other things

In order to connect to relevant services running in kalabox, such as the DB for an app you need to run some docker commands for now. First you will want to set your
`DOCKER_HOST` env variable so docker knows what daemon to connect to. Before that happens you will want to make sure you know the IP of your Kalabox VM. Generally this will always be 10.13.37.42 but may different in some edge cases. In order to be sure you can run:

```
boot2docker --vm="Kalabox2" ip
#10.13.37.42
```

Set the env

```
export DOCKER_HOST=tcp://10.13.37.42:2375
```

Now you can run `docker ps` inside the docker vm to see what ports are doing in your containerzzz. This will help you access your services.

```
CONTAINER ID        IMAGE                       COMMAND                CREATED             STATUS                    PORTS                                                                                                  NAMES
bb4ea042c875        pressflow7/nginx:latest     "/root/start.sh"       15 hours ago        Up 14 hours               0.0.0.0:49156->443/tcp, 0.0.0.0:49157->80/tcp                                                          kb_pressflow7_web
f4e0c73bdb73        pressflow7/php-fpm:latest   "/usr/sbin/php5-fpm    15 hours ago        Up 14 hours               0.0.0.0:49154->9000/tcp, 0.0.0.0:49155->9001/tcp                                                       kb_pressflow7_php
393ecad55c84        kalabox/mariadb:latest      "mysqld_safe"          15 hours ago        Up 14 hours               0.0.0.0:49153->3306/tcp                                                                                kb_pressflow7_db
28da8b2659e5        kalabox/data:latest         "/bin/true"            15 hours ago        Exited (0) 14 hours ago                                                                                                          kb_pressflow7_data
```

So if we wanted to connect to mariadb for our pressflow app we would just do something like this using your favorite mysql client use

  host: pressflow7.kbox
  port: 49153
  user: kalabox

Be mindful that these ports can change on restart.

## Data Containers and "SSH"

Each Kalabox app uses a separate data container which is useful for sharing code between containers and the outside world. Generally your "code" will be mounted onto each container at `/data`. You can also attach to a container by running

`docker exec -it kb_pressflow7_web /bin/bash`

This will allow you to explore the container ssh-style.

## Plugins

Apps can implement specific plugins similar to the Kalabox core. Check out the pressflow7 project for an example of a very basic plugin. Also make sure you add any plugins to your `kalabox.json` so your apps knows what plugins to load.

## App Config

You will also see a `config` folder in the root of the pressflow app. This allows you to easily change the settings of your services. For example, go into `config/php/php.ini` and change the `memory_limit` to something else. Then a simple `kbox hotsauce stop` and `kbox hotsauce start` and your new settings are there!

Beware though as not all apps have this feature!

## App Kalabox.json

Currently the kalabox.json lets you specify which plugins and containers you want to use. Plugins and dockerfiles are looked for locally first, then in the kalabox source and finally on npm/dockerhub. Only 4 types of containers are currently supported. Additionally your `web` container is going to want set the proxy key so you can see it from outside the Kalabox VM.

Please check out each app for more info on specifics.

```json
{
  "appName": "pressflow7",
  "appPlugins": [
    "pressflow7-plugin-env"
  ],
  "appComponents": {
    "data": {
      "image": {
        "name": "kalabox/data"
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
        "name": "pressflow7/php-fpm",
        "build": true,
        "src": "dockerfiles/pressflow7/php-fpm"
      }
    },
    "web": {
      "image": {
        "name": "pressflow7/nginx",
        "build": true,
        "src": "dockerfiles/pressflow7/nginx"
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

## Other Resources

* [API docs](http://api.kalabox.me/)
* [Test coverage reports](http://coverage.kalabox.me/)
* [Kalabox CI dash](http://ci.kalabox.me/)
* [Mountain climbing advice](https://www.youtube.com/watch?v=tkBVDh7my9Q)
* [Boot2Docker](https://github.com/boot2docker/boot2docker)
* [Syncthing](https://github.com/syncthing/syncthing)
* [Docker](https://github.com/docker/docker)

-------------------------------------------------------------------------------------
(C) 2015 Kalamuna and friends

