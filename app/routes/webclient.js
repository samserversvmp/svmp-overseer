'use strict';

var sam = require('../../lib/sam');

module.exports = function (app) {

    app.route('/webclient').get(function(req,res){
        res.render('webclient_login');
    });

    app.route('/webclient/video').get(function(req,res){
        res.render('webclient_video');
    });
};