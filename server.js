'use strict';

var
    sam = require('./lib/sam'),
    config = require('./lib/config'),
    path = require('path'),
    vmManager = require('./lib/cloud/vm-manager');

sam.init();

var app = require('./lib/console/express')();

// Run an interval to terminate expired VMs (those that have been idle for too long)
vmManager.startExpirationInterval();

var port = sam.config.get('port');

if (sam.config.isEnabled('enable_ssl')) {
    var https = require('https');
    var fs = require('fs');

    var options = sam.config.get('tls_options');

    var server = https.createServer(options, app);
    server.listen(port);

    sam.logger.info('SAM REST API running on port %d with SSL', port);
} else {
    app.listen(port);
    sam.logger.info('SAM REST API running on port %d', port);
}
