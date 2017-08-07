/**
 * Main namespace object used through-out the app.
 *
 * @exports sam
 */
var sam = {};

module.exports = sam;

/**
 * Current version used. Read from package.json
 * @type {String}
 */
sam.VERSION = require('../package.json').version;

/**
 * Called at start of App.  Initializes the core modules
 */
sam.init = function() {

    /**** Setup ****/

    // Winston and wrap in out global name space
    sam.logger = require('./logger');
    sam.logger.beforeConfig();


    // Config with validation
    sam.config = require('./config');
    sam.config.init();

    sam.logger.afterConfig();

    var cloud = sam.config.get('cloud_platform');
    if (cloud === "openstack") {
        sam.cloud = require('./cloud/openstack');
    } else if (cloud === "aws") {
        sam.cloud = require('./cloud/aws');
    }
    sam.cloud.init();

    // Mongoose with Q wrapper
    sam.mongoose = require('mongoose-q')(require('mongoose'));

    if(!sam.mongoose.connection.db) {
        var dbname;

        if(process.env.NODE_ENV === 'production') {
            dbname = sam.config.get('db:production');
        } else {
            dbname = sam.config.get('db:test');
        }
        sam.mongoose.connect(dbname);
        sam.logger.info("Mongoose:  connected to: " + dbname);

        sam.mongoose.connection.on('error',function (err) {
            sam.logger.error("Problem connecting to mongdb. Is it running? " + err );
            process.exit(1);
        });
        sam.mongoose.connection.on('disconnected', function () {
            sam.logger.info("Mongoose:  disconnected connection");
        });

    }
    // Model
    sam.User = require('./model/user')(sam.mongoose);
    sam.VMSession = require('./model/vm-session')(sam.mongoose);

    // used to lock out users who fail authentication too many times
    sam.lockout = require('./lockout');
};

/**
 * Shut down. Closes DB connection and cleans up any temp config settings
 */
sam.shutdown = function() {
    sam.config.reset();

    if(sam.mongoose.connection){
        sam.mongoose.connection.close();
    }
}
