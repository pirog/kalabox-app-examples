Drupal7
===================

This is a VERY VERY barebones example of a Drupal7 app running Apache, php 5.4 and mysql 5.5 in a single container. It is basically just all the recommended settings provided on [drupal.org](http://www.drupal.org). *We actually recommend using the pressflow7 app instead as this app has weird file permissions issues for now*.

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
  kbox # you should see "drupal7" list as an app now
```

To install and run an app just go into the app folder and do something like this. We will use `drupal7` as the example here.

```
cd drupal7
npm install
kbox install
kbox start
```

Now visit `http://drupal7.kbox` in your browser. It will likely tell you FORBIDDEN. To add code to your project you should now have a directory
at `~/kalabox/code/drupal7`. Put your code in there to do all the things. *Again the permissions here are weird so you might need to `docker exec` into `kb_drupal7_web` in order to set correct permissions for your code.

## Getting to your Database

When this app starts up it checks for a `settings.php` file and if it doesn't exist it it will create a database called `kalabox` which you can access with user: kalabox, password:kalabox. These are the creds you will want to use in your drupal install.

If you are importing a site and want to directly access the database you will need to find the outside port to use. You can do this with:

```
docker ps --all | grep kb_drupal7_web
d21bf3937ac3        kalabox/drupal7:latest      "/bin/bash /start.sh   3 minutes ago       Up 2 minutes               0.0.0.0:49158->3306/tcp, 0.0.0.0:49159->80/tcp                                                         kb_drupal7_web
```

With this you can access your database from the outside with

```
host: drupal7.kbox
user: kalabox
password: kalabox
database: kalabox
port: 49158
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

