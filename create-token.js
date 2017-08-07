'use strict';

var sam = require('./lib/sam'),
    shell = require('shelljs'),
    ms = require('ms'),
    uuid = require('node-uuid'),
    jwt = require('jsonwebtoken');

const commander = require('commander');

commander.version(require('./package.json').version)
    .usage('[options] <username>')
    .option('-a --admin', 'Create a token with the admin role')
    .option('-e --expires <n>', 'Token validity time. Ex: 1d, 3h, 30m, 60s, etc.')
    .parse(process.argv);

if (process.argv.length <= 2) {
    commander.help();
}

if (commander.args.length !== 1) {
    commander.help();
}

var username = commander.args[0];

sam.init();
var pass = sam.config.get('private_key_pass');
var file = sam.config.get('private_key');
process.env.passphrase = pass;
var command = 'openssl rsa -in ' + file + ' -passin env:passphrase';
var privKey = shell.exec(command, {silent: true}).output;
delete process.env.passphrase;

var options = {
    sub: username,
    jti: uuid.v4(),
    iss: require('os').hostname()
};
if (commander.admin) options.role = 'admin';
if (commander.expires) options.exp = Math.floor((Date.now() + ms(commander.expires)) / 1000);

console.log("Creating token: ", JSON.stringify(options));
var token = jwt.sign(options, privKey, {algorithm: sam.config.get('jwt_signing_alg')});
console.log(token);

process.exit();
