'use strict';

var argv = require('minimist')(process.argv.slice(2));

module.exports = function(plugin, manager, app) {
  /**
   * Run and remove an image.
   *
   * @param cmd Array of drush command args
   * @param callback optional callback that is called when process is complete.
   **/
  var runRmDrush = function(cmd, callback) {
    app.docker.run(
      'kalabox/drush',
      cmd,
      process.stdout,
      {
        Env: ['APPNAME=' +  app.appname, 'APPDOMAIN=' +  app.appdomain],
        Volumes: { '/src': {} }
      },
      {
        Binds: [app.path + ':/src:rw'],
        VolumesFrom: [app.dataCname]
      },
      function (err, data, container) {
        if (err) {
          throw err;
        }
        app.manager.docker.getContainer(container.id).remove(function(err, data) {
          if (callback) {
            callback(err, data);
          }
        });
      }
    );
  };

  app.manager.registerTask('hotsauce.get', function(){
    var cmd = ['dl', 'hotsauce', '-y', '--destination=/data', '--drupal-project-rename=code'];
    runRmDrush(cmd, function(err, data){
      if (err) {
        throw err;
      }
    });
  });

};
