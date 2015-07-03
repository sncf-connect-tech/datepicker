/**
 * @description
 * Build Grunt tasks
 */

(function () {

'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      build: {
        options: {
          watch: true,
          browserifyOptions: {
            debug: false,
            standalone: 'datepicker'
          }
        },
        files: {
          'dist/datepicker.js': ['src/js/datepicker.js']
        }
      },
      dist: {
        options: {
          browserifyOptions: {
            debug: false,
            standalone: 'datepicker'
          },
          transform: ['uglifyify']
        },
        files: {
          'dist/datepicker.min.js': ['src/js/datepicker.js']
        }
      }
    },
    sass: {
      dist: {
        options: {
          precision: 10,
          outputStyle: 'compressed',
          sourceMap: false,
          includePaths: [
            'src/sass/', 'src/vendors'
          ]
        },
        files: {
          'dist/datepicker.css': 'src/sass/datepicker.{scss,sass}'
        }
      }
    },
    watch: {
      sass: {
        files: [
          'src/sass/**/*.{scss,sass}'
        ],
        tasks: [
          'sass:dist'
        ]
      },
      js: {
        files: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'jscs']
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'src/',
        src: 'css/*.css',
        dest: 'dist/',
        flatten: true
      }
    },
    jscs: {
      src: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
      options: {
        config: '.jscsrc'
      }
    },
    jshint: {
      src: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: true,
        autoWatch: true,
        reporters: ['html', 'junit', 'coverage']
      },
      unitWatch: {
        autoWatch: true
      },
      // Continuous integration mode: run tests once in PhantomJS browser.
      continuous: {
        singleRun: true,
        browsers: ['PhantomJS']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['jshint', 'jscs', 'browserify:build', 'sass:dist', 'watch']);
  grunt.registerTask('default', ['jshint', 'jscs', 'browserify:dist', 'sass:dist']);
  grunt.registerTask('test', ['karma']);
};

})();
