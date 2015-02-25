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

# this will output
config
containers
drush
git
inspect
install
restart
start
stop
uninstall
```

Cool! All sorts of FUN COMMANDS! The big ones are `install`, `start`, `restart` `stop` and `uninstall` which all do exactly what you think they do.

**`kbox config`**

Will list your global and app specific config.

**`kbox containers`** 

Will list some info about the containers needed to run your app.

**`kbox inspect`** 

Will give you a lot of info about a specific container.

**`kbox git`** and **`kbox drush`** are commands that are available because the backdrop example has installed the [git](https://github.com/kalabox/kalabox-plugin-git) and [drush](https://github.com/kalabox/kalabox-plugin-drush) kalabox plugins.

### Installing and starting

Inside your app directory run

```
kbox install
kbox start
```

Now visit `http://backdrop.kbox` in your browser. It will likely tell you "No input file specified". To add code to your project you should now have a directory at `~/kalabox/code/pressflow7`. Put your code in there to do all the things. If you are adding a large amount of code you might want to check on the status of syncthing over at `10.13.37.42:8080`

Some apps may have plugins enabled to help with downloading code from specific places like github or Pantheon. Please consult the docs for these apps for help. For example backdrop uses the `git` kalabox plugin so you could run

`kbox git clone myrepo.git ./` 

Kalabox will forward in your ssh key and try to clone your code to the webroot.

## Scoping your containers for ports and other things

In order to connect to relevant services running in kalabox, such as the DB for an app you need to run some kbox commands for now. 

Inside our app directory run `kbox containers` you will get output like this

```
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

So if we wanted to connect to mariadb for our pressflow app we would just do something like this using your favorite mysql client use

  host: backdrop.kbox
  port: 49153
  user: kalabox (may be different on different apps)

Be mindful that these ports can change on restart.

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

