(function () {
  'use strict';

  module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      'watch': {
        react: {
          files: ['Gruntfile.js', 'src/react_components/**/*.js'],
          tasks: ['browserify', 'eslint']
        }
      },
      'browserify': {
        options: {
          transform: [
            ['babelify', {
              loose: 'all'
            }]
          ]
        },
        client: {
          src: ['src/react_components/**/*.js'],
          dest: 'public/js/app.built.js'
        }
      },
      'eslint': {
        src: ['src/react_components/main.js']
      },
      'copy': {
        main: {
          files: [
            {expand: true, flatten: true, src: ['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.*'], dest: 'public/js'},
            {expand: true, flatten: true, src: ['node_modules/bootstrap/dist/css/bootstrap*.min.css'], dest: 'public/css'},
          ]
        }
      }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('gruntify-eslint');

    grunt.registerTask('default', ['browserify']);
  };

}());
