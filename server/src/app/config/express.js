/**
 * Module dependencies.
 */
var express = require('express'),
    config = require('./config.js'),
    stylus = require('stylus'),
    nib = require('nib');;

module.exports = function(app) {
    // compile stylus to css
    function compile(str, path) {
        return stylus(str)
            .set('filename', path)
            .use(nib());
    }

    app.set('showStackError', true);

    //Prettify HTML
    app.locals.pretty = true;

    //Set views path, template engine and default layout
    app.set('views', config.root + 'server/src/app/views');
    app.set('view engine', 'jade');

    //Set stylus engine
    app.use(
        stylus.middleware({
            src:  config.root + "client/src/assets/stylus",
            dest: config.root + "client/src/assets/css",
            debug: true,
            compile : function(str, path) {
                console.log('compiling');
                return stylus(str)
                    .set('filename', path)
                    .set('warn', true)
                    .set('compress', true);
            }
        })
    );
    //app.use(stylus.middleware({ src: config.root + 'client/src/assets/stylesheets', compile: compile}))

    //TODO: (martin) the static directory should be '/client' but for some reason 'grunt bower-install' generate wrong directory into head.jade (figure out why this is happening)
//    app.use(express.static(config.root + '/client'));
    app.use(express.static(config.root));

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
