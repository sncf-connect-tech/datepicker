/**
 * @description
 * Build Grunt tasks
 */

'use strict';

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      module: {
        src: [
          'src/js/autocomplete.module.js',
          'src/js/*.js'
        ],
        dest: 'dist/angular-autocomplete.js'
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
    csslint: {
      options: {
        csslintrc: '.csslintrc',
        formatters: [
          {
            id: 'lint-xml',
            dest: 'build/logs/csslint.xml'
          }
        ]
      },
      strict: {
        src: [
          'src/css/*.css'
        ]
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app: {
        files: {
          'dist/angular-autocomplete.js': ['dist/angular-autocomplete.js']
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      app: {
        files: {
          'dist/angular-autocomplete.min.js': ['dist/angular-autocomplete.js']
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'src/js/*.js'
      ],
      test: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['test/spec/*.js']
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
      //continuous integration mode: run tests once in PhantomJS browser.
      continuous: {
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    ngdocs: {
      options: {
        dest: 'build/docs',
        html5Mode: false,
        title: '<%= pkg.name %> - <%= pkg.version %>',
        startPage: '/guide',
        styles: ['docs/css/styles.css']
      },
      api: {
        src: [
          'dist/angular-autocomplete.js'
        ],
        title: 'API Documentation'
      },
      guide: {
        src: [
          'docs/content/guide/*.ngdoc'
        ],
        title: 'Guide'
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-push-release');

  grunt.registerTask('default', ['csslint', 'jshint', 'concat', 'copy', 'ngAnnotate', 'uglify', 'ngdocs']);
  grunt.registerTask('test', ['karma']);

};
