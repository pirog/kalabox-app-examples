Kalabox App Examples
===================

Here are a bunch of app examples that you can use as starting points for crafting some Kalabox apps. Will detail some generic info here but you should
consult the README in each folder for more pertinent info that those apps. And of course please check out the main kalabox readme over [here](https://github.com/kalabox/kalabox).

## Setup

Let grab some apps!

```
  cd ~/Desktop
  git clone https://github.com/kalabox/kalabox-app-examples.git
```

To install and run an app just go into the app folder and do something like this. We will use `backdrop` as the example here.

### Some Commands

First check out the command this app provides

```
cd backdrop
kbox

Usage: kbox <command> [-- <options>]

Examples:
  kbox apps -- -h
  kbox config -- --verbose

Commands:
  apps              Display list of apps.
  config            Display the kbox application's configuration.
  containers        Display list of application's installed containers.
  drush             Run drush commands.
  git               Run git commands.
  inspect           Inspect containers.
  install           Install a kbox application.
  restart           Stop and then start a running kbox application.
  rsync             Run rsync commands.
  start             Start an installed kbox application.
  stop              Stop a running kbox application.
  uninstall         Uninstall an installed kbox application
  down              Bring kbox container engine down.
  ip                Display kbox container engine's ip address.
  provision         Install or update kbox and it's dependencies.
  shields           Shield generator operation.
  status            Display status of kbox container engine.
  up                Bring kbox container engine up.
  version           Display the kbox version.

Options:
  -h, --help     Display help message.                                 [boolean]
  -v, --verbose  Use verbose output.                                   [boolean]
```

### Installing and starting

Inside your app directory run

```
npm install
kbox install
kbox start
```

Now visit `http://backdrop.kbox` in your browser. It will likely tell you "No input file specified". To add code to your project you should now have a directory called `code` inside of your app directory. Put your code in there to do all the things. If you are adding a large amount of code you might want to check on the status of syncthing over at `10.13.37.42:60008`

Some apps may have plugins enabled to help with downloading code from specific places like github or Pantheon. Please consult the docs for these apps for help. For example backdrop uses the `git` kalabox plugin so you could run

`kbox git clone myrepo.git ./`

Kalabox will forward in your ssh key and try to clone your code to the containers webroot.

## Scoping your containers for ports and other things

In order to connect to relevant services running in kalabox, such as the DB for an app you need to run some kbox commands for now.

Inside our app directory run `kbox containers` you will get output like this

```json
{
  "id": "470fa7a966b672bcf0c85ab7281b3572d42e9b695e88186093dec57b1afb91c5",
  "name": "kb_backdrop_db",
  "app": "backdrop",
  "ports": [
    "3306/tcp=>49153"
  ],
  "running": true
}
{
  "id": "823e87472bd50b42a7fb7c51b5f42d41ec0b541a36b6085f8000367fafecd02f",
  "name": "kb_backdrop_php",
  "app": "backdrop",
  "ports": [
    "9000/tcp=>49154"
  ],
  "running": true
}
{
  "id": "05071466eba2b76789dbcd66639bc5cf38e299be3b54d82592ea6ea6e6850fbd",
  "name": "kb_backdrop_web",
  "app": "backdrop",
  "ports": [
    "443/tcp=>49155",
    "80/tcp=>49156"
  ],
  "running": true
}
{
  "id": "4288090d00d85267c2cd7d6d460a711ef1bcc4cf720e495e89c0db0c6b1a1753",
  "name": "kb_backdrop_data",
  "app": "backdrop",
  "running": false
}
```

So if we wanted to connect to mariadb for our backdrop app we would just do something like this using your favorite mysql client use

  host: backdrop.kbox
  port: 49153
  user: kalabox (may be different on different apps)

Be mindful that these ports can change on restart.

## Easily change your infrastructure config

Most kalabox apps worth their salt will make sure of shared config so users can change basic settings of common services without having to rebuild their entire container.

For example you will also see a `config` folder in the root of the backdrop app. This allows you to easily change the settings of your services. For example, go into `config/php/php.ini` and change the `memory_limit` to something else. Then a simple `kbox backdrop stop` and `kbox backdrop start` and your new settings are there!

Beware though as not all apps have this feature! Consult the dockerfiles (which may be on the Docker registry) for each app to see how you can share your config like this.

## App Kalabox.json

Currently the kalabox.json lets you specify which plugins and containers you want to use. It also allows you to specify some plugin config. Plugins and dockerfiles are looked for locally first, then in the kalabox source and finally on npm/dockerhub. Additionally your `web` container is going to want set the proxy key so you can see it from outside the Kalabox VM.

Please check out each app for more info on specifics.

```json
{
  "appName": "hiphop-drupal7",
  "appPlugins": [
    "kalabox-plugin-dbenv",
    "kalabox-plugin-git",
    "kalabox-plugin-drush"
  ],
  "pluginConf": {
    "kalabox-plugin-drush": {
      "drush-version": "drush6"
    },
    "kalabox-plugin-dbenv": {
      "settings": {
        "databases": {
          "default": {
            "default": {
              "driver": "mysql",
              "prefix": "",
              "database": "kalabox",
              "username": "kalabox",
              "password": "",
              "host": "hiphop-drupal7.kbox",
              "port": 3306
            }
          }
        },
        "conf": {
          "pressflow_smart_start": 1
        }
      }
    }
  },
  "appComponents": {
    "data": {
      "image": {
        "name": "kalabox/data:stable"
      }
    },
    "db": {
      "image": {
        "name": "kalabox/mariadb:stable"
      }
    },
    "hhvm": {
      "image": {
        "name": "brunoric/hhvm:deb"
      }
    },
    "web": {
      "image": {
        "name": "pirog/nginx:stable",
        "build": true,
        "src": "dockerfiles/nginx"
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

Here is the kalabox.json file for the HipHop Drupal 7 app. It uses three plugins. We can tell the app to use drush6 by default with

```json
    "kalabox-plugin-drush": {
      "drush-version": "drush6"
    },
```

And to set app configuration in the environment with

```json
  "kalabox-plugin-dbenv": {
      "settings": {
        "databases": {
          "default": {
            "default": {
              "driver": "mysql",
              "prefix": "",
              "database": "kalabox",
              "username": "kalabox",
              "password": "",
              "host": "hiphop-drupal7.kbox",
              "port": 3306
            }
          }
        },
        "conf": {
          "pressflow_smart_start": 1
        }
      }
    }
```

We are pulling 3 of our containers from the Docker registry but using a local dockerfile to build the HHVM container.

## Plugins

Apps can implement plugins similar to the Kalabox core. Check out the backdrop project for an example of some very basic plugins. You can also check out [NPM](https://www.npmjs.com/search?q=kalabox-plugin) for other plugin examples. Generally plugins will go in the `plugins` folder or `node_modules` if you are using an external plugin. Also make sure you add any plugins to your `kalabox.json` so your apps knows what plugins to load. External plugins are just node modules so you can install them with `npm install kalabox-plugin-drush --save`.

[Read more about plugins](https://github.com/kalabox/kalabox/wiki/Plugin-System)

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

