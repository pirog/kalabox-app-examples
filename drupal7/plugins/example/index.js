'use strict';

var _ = require('lodash');

// Here is where you define the plugin.
module.exports = function(argv, app, appConfig, kbox) {

  // Variables like 'argv' 'app' 'appConfig' and 'kbox' placed in
  // the callback function above automatically map to dependencies
  // registered by Kalabox. Use cli command 'kbox deps' for a 
  // full list of registered dependencies.

  //===========================================================================

  // Build the command path to map 'kbox <app.anme> urls' command line
  // call to registered task below.
  var commandPath = [app.name, 'urls'];

  // Register task with command path.
  kbox.core.tasks.registerTask(commandPath, function(done) {
    
    // Build array of component urls.
    var urls = [];
    _.each(app.config.appComponents, function(component) {
      if (component.url) {
        urls.push(component.url);
      }  
    });
    urls.sort();

    // Print list of urls to stdout.
    _.each(urls, function(url) {
      console.log(url);
    });
    
    // The 'done' callback must be called in order to return control
    // back to Kalabox.
    done();
  });

  //===========================================================================

  // Register an event listener with Kalabox.
  kbox.core.events.on('post-start', function(app, done) {

    console.log('Thats how winning is done!');
    // Run command 'kbox start foo bar bazz' and take note of what prints out.
    console.log(argv);

    // The 'done' callback must be called in order to return control
    // back to Kalabox. All events are async, and Kalabox will wait
    // until all event listeners have completed running before
    // continuing.
    done();

  });

  //===========================================================================

};
