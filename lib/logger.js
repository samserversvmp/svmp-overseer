var
    sam = require('./sam'),
    path = require('path'),
    winston = require('winston');

module.exports = winston;

winston.beforeConfig = function () {
    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {level: 'info', colorize: true, timestamp: true});
};

winston.afterConfig = function () {
    var logLevel = sam.config.get('log_level');
    var logFile = sam.config.get('log_file');

    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {level: logLevel, colorize: true, timestamp: true});
    winston.add(winston.transports.File, {filename: logFile, level: logLevel, json: false, timestamp: true});
};

module.exports.stream = {
    write: function(message, encoding){
        winston.info(message.trim());
    }
};
