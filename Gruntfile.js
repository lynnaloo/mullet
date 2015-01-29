(function () {
  'use strict';

  module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      'watch': {
        react: {
          files: ['Gruntfile.js', 'src/react_components/*.jsx'],
          tasks: ['browserify', 'jshint-jsx']
        }
      },
      'browserify': {
        options: {
          transform: [ require('grunt-react').browserify ]
        },
        client: {
          src: ['src/react_components/**/*.jsx'],
          dest: 'public/js/app.built.js'
        }
      },
      'jshint-jsx': {
        all: ['src/react_components/**/*.jsx', 'src/react_components/**/*.js'],
        options: {
          convertJSX: true
        }
      }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint-jsx');

    grunt.registerTask('jshint', ['jshint-jsx']);
    grunt.registerTask('default', ['browserify']);
  };

}());
