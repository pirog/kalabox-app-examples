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
