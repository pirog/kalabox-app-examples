Pressflow7
===================

This is a nice app that runs Drupal7 or Pressflow7 sites. It is relatively optimized for Drupal with nginx, php-fpm and mariadb all running in separate containers.
It also has some nice config for APC, xdebug and other tools of that ilk. This app also has a nice Pressflow Environment plugin that sets your database config in the
environment so if you are using pressflow drupal you don't need to muck with your settings.php.

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
  kbox # you should see "pressflow7" list as an app now
```

To install and run an app just go into the app folder and do something like this. We will use `pressflow7` as the example here.

```
cd pressflow7
npm install
kbox install
kbox start
```

Now visit `http://pressflow7.kbox` in your browser. It will likely tell you 'no input file'. To add code to your project you should now have a directory
at `~/kalabox/code/pressflow7`. Put your code in there to do all the things.

## Getting to your Database

This app will start with a database called `kalabox` and user `kalabox` with no password.

If you are importing a site and want to directly access the database you will need to find the outside port to use. You can do this with:

```
docker ps --all | grep kb_pressflow7_db
393ecad55c84        kalabox/mariadb:latest      "mysqld_safe"          16 hours ago        Up 15 hours                0.0.0.0:49153->3306/tcp                                                                                kb_pressflow7_db
```

With this you can access your database from the outside with

```
host: pressflow7.kbox
user: kalabox
password:
database: kalabox
port: 49153
```

## Pressflow7 plugins

Pressflow ships with a very basic plugin that adds a `PRESSFLOW_SETTINGS` environmental variable to your environment. Pressflow variants of Drupal can read from this
so you don't have to set your DB creds in settings.php or during installation. If you are using this app with normal drupal you will want to use the following creds in your install:

```
database: kalabox
user: kalabox
password:
host: pressflow7.kbox # this is in the advanced settings
```

Here is what the plugin looks like for the curious:

```js
'use strict';

module.exports = function(app, appConfig, events) {

  // Events
  events.on('pre-install-component', function(component, done) {

    // Add in the pressflow magic
    var pressflowSettings = {
      databases: {
        default: {
          default: {
            driver: 'mysql',
            prefix : '',
            database: 'kalabox',
            username: 'kalabox',
            password: '',
            host: app.domain,
            port: 3306,
          }
        }
      },
      conf: {
        pressflow_smart_start: 1
      }
    };
    component.installOptions.Env.push('PRESSFLOW_SETTINGS=' + JSON.stringify(pressflowSettings));

    done();
  });

};

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

