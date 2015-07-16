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
      }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-eslint');

    grunt.registerTask('default', ['browserify']);
  };

}());
