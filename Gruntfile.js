module.exports = function (grunt) {
    'use strict';
    
    // Project configuration.
    grunt.initConfig({
        
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        
        jqueryCheck: 'if (!jQuery) { throw new Error(\"Bootstrap Tree Nav requires jQuery\"); }\n\n',
        banner: '/**\n' +
              '* <%= pkg.name %>.js v<%= pkg.version %> \n' +
              '* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.contributors[0].name %>\n' +
              '* Copyright 2013 <%= pkg.author %> by @morrissinger\n' +
              '* License: <%= pkg.license %>\n' +
                '*/\n',
        // Task configuration.
        clean: {
            dist: ['dist']
        },
        
        jshint: {
            options: {
                jshintrc: 'js/.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: [
                    'js/lang/*/*.js',
                    'js/*.js'
                ]
            }
        },
        
        concat: {
            options: {
                stripBanners: false
            },
            bootstraptreenav: {
                src: [
                    'js/*.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },
        
        uglify: {
            options: {
            },
            bootstraptreenav: {
                src: ['<%= concat.bootstraptreenav.dest %>'],
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        
        copy: {
            img: {
                expand: true,
                src: ['img/*'],
                dest: 'dist/'
            }
        },
        sass: {
            src: {
                options: {
                    style: 'expanded',
                },
                files: {
                    'dist/css/bootstrap-treenav.css' : 'sass/bootstrap-treenav.scss'
                }
            },
            dist: {
                options: {
                    style: 'compressed',
                },
                files: {
                    'dist/css/bootstrap-treenav.min.css' : 'sass/bootstrap-treenav.scss'
                }
            }
        },
        watch: {
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src']
            },
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            }
        },
        usebanner: {
            options: {
                position: 'top',
                banner: '<%= banner %>',
                linebreak: true
            },
            files: {
                src: ['dist/js/*.js','dist/css/*.css']
            }
            
        },
    // Mocha
		mocha: {
			  all: {
				src: ['tests/testrunner.html'],
			  },
            options: {
                timeout: 10000,
                log: true,
				reporter: 'Spec',         /* [1] */
				run: true                /* [2] */
			}
			}
			
    });
    
    
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-banner');
    
    var testSubtasks = ['dist-css', 'jshint', 'mocha'];
    // Only push to coveralls under Travis
    if (process.env.TRAVIS) {
        if ((process.env.TRAVIS_REPO_SLUG === 'morrissinger/BootstrapTreeNav' && process.env.TRAVIS_PULL_REQUEST === 'false')) {
            testSubtasks.push('coveralls');
        }
    }
    grunt.registerTask('test', testSubtasks);
    
    
    // JS distribution task.
    grunt.registerTask('banner', ['usebanner']);

    // JS distribution task.
    grunt.registerTask('dist-js', ['concat', 'uglify']);
    
    // CSS distribution task.
    grunt.registerTask('dist-css', ['sass']);
    
    // Img distribution task.
    grunt.registerTask('dist-img', ['copy']);
	
	//Tests with mocha
    grunt.registerTask('testing', ['mocha']);

    
    // Full distribution task.
    grunt.registerTask('dist', ['clean', 'dist-css', 'dist-img', 'dist-js', 'banner','testing']);
    
    // Default task.
    grunt.registerTask('default', ['test', 'dist']);
};