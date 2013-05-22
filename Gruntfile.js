'use strict';

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: [
        'Gruntfile.js',
        'src/**/*.js'
      ],
      tasks: [
        'default'
        //'jshint'
        //'test'
      ]
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: ['Gruntfile.js'],
      src: ['src/**/*.js']
    },

    concat: {
      debug: {
        options: {
          stripBanners: true
        },
        src: [
          'src/scripts/*.js',
          'src/scripts/*/*.js'
        ],
        dest: 'angular-highcharts.js'
      }
    },

    uglify: {
      production: {
        files: {
          'angular-highcharts.min.js': 'angular-highcharts.js'
        }
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Register task(s)
  grunt.registerTask('default', [
    'jshint',
    //'test',
    'concat',
    'uglify'
  ]);

};

