
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      react: {
        files: ['src/react_components/*.jsx'],
        tasks: ['browserify', 'jshint']
      }
    },
    browserify: {
      options: {
        transform: [ require('grunt-react').browserify ]
      },
      client: {
        src: ['src/react_components/**/*.jsx'],
        dest: 'public/js/app.built.js'
      }
    },
    jshint: {
      all: ['src/react_components/*.jsx']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsxhint');

  grunt.registerTask('default', ['browserify']);
};
