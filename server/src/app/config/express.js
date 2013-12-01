/**
 * Module dependencies.
 */
var express = require('express'),
    config = require('./config.js');

module.exports = function(app) {
    app.set('showStackError', true);

    //Prettify HTML
    app.locals.pretty = true;

    //Setting the fav icon and static folder
    //TODO: (martin) the static directory should be '/client' but for some reason 'grunt bower-install' generate wrong directory into head.jade (figure out why this is happening)
//    app.use(express.static(config.root + '/client'));
    app.use(express.static(config.root));
//    app.use(express.favicon(config.root + 'client/assets/img/teeth.png'));

    //Set views path, template engine and default layout
    app.set('views', config.root + 'server/src/app/views');
    app.set('view engine', 'jade');

    //Set stylus engine
//    app.use(require('stylus').middleware(config.root + '/assets'));

    // all environments
    app.configure(function(){
        app.use(express.logger());
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

        //bodyParser should be above methodOverride
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        //routes should be at the last
        app.use(app.router);
    });
};
