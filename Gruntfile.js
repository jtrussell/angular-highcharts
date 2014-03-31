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
        'pages'
        //'jshint'
        //'test'
      ]
    },
    
    clean: {
      dist: 'dist/*.{js,css}',
      pages: 'pages/bower_components/angular-highcharts/**'
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
          'src/scripts/module.js',
          'src/scripts/**/*.js'
        ],
        dest: 'dist/angular-highcharts.js'
      }
    },

    uglify: {
      production: {
        files: {
          'dist/angular-highcharts.min.js': 'dist/angular-highcharts.js'
        }
      }
    },

    copy: {
      pages: {
        files: [{
          src: '**',
          dest: 'pages/bower_components/angular-highcharts/',
          cwd: 'dist/',
          expand: true
        }]
      }
    },

    bump: {
      options: {
        commitMessage: 'chore: Bump for release (v%VERSION%)',
        files: ['package.json', 'bower.json'],
        commitFiles: ['-a'],
        push: false
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Register task(s)
  grunt.registerTask('default', [
    'jshint',
    //'test',
    'clean:dist',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('pages', [
    'default',
    'clean:pages',
    'copy:pages'
  ]);

};

