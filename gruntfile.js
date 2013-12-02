module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-install');

    // Project configuration
    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),

        'bower-install': {
            target: {
                // Point to the html file that should be updated
                // when you run `grunt bower-install`
                html: 'server/src/app/views/includes/head.jade'
            }
        },
        src: {
            js: ['./client/src/app/**/*.js'],
            jade: ['./server/src/app/view/**/*.jade'],
            css: ['./client/src/assets/*.css'],
            scenarios: ['test/client/e2e/*.scenario.js']
        },
        watch: {
            options: {
                // Start a live reload server on the default port 35729
                livereload: true
            },
            files:['<%= src.js %>', '<%= src.css %>', '<%= src.jade %>'],
            tasks:['default','timestamp']
        }
    });

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    // Default task
    grunt.registerTask('default', []);
};