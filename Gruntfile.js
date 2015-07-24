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
      watch: {
        options: {
          watch: false,
          browserifyOptions: {
            debug: false,
            standalone: 'datepicker'
          },
          transform: ['cssify'],
          plugin: ['browserify-derequire']
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
          transform: ['cssify'],
          plugin: ['browserify-derequire']
        },
        files: {
          'dist/datepicker.js': ['src/js/datepicker.js']
        }
      },
      distMin: {
        options: {
          browserifyOptions: {
            debug: false,
            standalone: 'datepicker'
          },
          plugin: ['browserify-derequire'],
          transform: ['sassr', 'uglifyify']
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
          'tmp/datepicker.css': 'src/sass/datepicker.{scss,sass}'
        }
      }
    },
    postcss: {
      server: {
        options: {
          map: true, // Inline sourcemaps
          processors: [
            require('autoprefixer-core')({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']}) // Add vendor prefixes
          ]
        },
        files: [{
          expand: true,
          flatten: true,
          src: 'tmp/*.css',
          dest: 'tmp/'
        }]
      },
      dist: {
        options: {
          processors: [
            require('autoprefixer-core')({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']}) // Add vendor prefixes
          ]
        },
        files: [{
          expand: true,
          flatten: true,
          src: 'tmp/*.css',
          dest: 'tmp/'
        }]
      }
    },
    watch: {
      js: {
        files: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'jscs', 'sass', 'postcss', 'browserify:dist', 'browserify:distMin', 'clean']
      },
      css: {
        files: ['src/sass/*.scss'],
        tasks: ['sass', 'postcss', 'browserify:dist', 'browserify:distMin', 'clean']
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
    clean: [
      'tmp'
    ],
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: false,
        autoWatch: true,
        browsers: ['Chrome']
      },
      // Continuous integration mode: run tests once in PhantomJS browser.
      continuous: {
        reporters: ['html', 'junit', 'coverage']
      }
    },
    push: {
      options: {
        files: ['package.json', 'bower.json']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-push-release');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['clean', 'jshint', 'jscs', 'sass', 'postcss', 'browserify:dist', 'browserify:distMin']);
  grunt.registerTask('build:watch', ['build', 'watch']);
  grunt.registerTask('test', ['build', 'karma:unit']);
  grunt.registerTask('test:ci', ['build', 'karma:continuous']);
  grunt.registerTask('default', ['build']);
};

})();
