module.exports = function(grunt) {
	grunt.initConfig({
		//sass: {
        //    options: {
        //        sourcemap: 'none'
        //    },
		//	app: {
		//		files: {
        //            'css/app.css': 'scss/app.scss',
        //            'css/rtl-fix.css': 'scss/rtl-fix.scss',
		//		}
		//	},
		//},
		cssmin: {
			app: {
				files: [{
					src: [
						'css/*.css',
						'!css/*.min.css',
					],
					dest: 'css/app.min.css'
				}]
			},
			extensions: {
				files: [{
					src: [

					],
					dest: 'css/extensions.min.css'
				}]
			}
		},
		ngtemplates:  {
			app: {
				src: 'templates/**/*.html',
				dest: 'js/templates/templates.js',
				htmlmin: {
					collapseWhitespace: true,
					collapseBooleanAttributes: true
				},
				options: {
					module: 'JINI.templates',
				}
			}
		},
		uglify: {
			extensions: {
				files: {
					'js/extensions.min.js': [
						'lib/angular/angular.min.js',
						'lib/angular-animate/angular-animate.min.js',
						'lib/angular-messages/angular-messages.min.js',
						'lib/angular-sanitize/angular-sanitize.min.js',
						'lib/angular-ui-router/release/angular-ui-router.min.js',
						'lib/ngstorage/ngStorage.min.js',
						'lib/ng-tiny-scrollbar/ng-tiny-scrollbar.min.js',
						'lib/helpers/helpers.js',
					]
				},
				options: {
					mangle: false,
				},
			},
			app: {
				files: {
					'js/app.min.js': [
						'js/app.js',
						'js/controllers/Controller.js',
							'js/controllers/**/*.js',
						'js/directives/Directive.js',
						'js/services/Service.js',
						'js/filters/Filter.js',
						'js/templates/Template.js',
							'js/templates/templates.js',
					]
				}
			}
		},
        watch: {
			//'app-sass': {
			//	files: 'scss/*.scss',
			//	tasks: ['sass:app', 'cssmin:app']
			//},
			'app-css': {
				options: {
					livereload: true,
				},
				files: ['css/*.css', '!css/*.min.css'],
				tasks: ['cssmin:app']
			},
			'app-js': {
				options: {
					livereload: true,
				},
				files: ['js/**/*.js', '!js/*.min.js'],
				tasks: ['uglify:app']
			},
			'app-ext': {
				options: {
					livereload: true,
				},
				files: ['js/old.script.js'],
				tasks: ['uglify:extensions']
			},
			'ngtemplates': {
				options: {
					livereload: true,
				},
				files: ['templates/**/*.html'],
				tasks: ['ngtemplates:app', 'uglify:app']
			},
            'gruntfile': {
                files: ['Gruntfile.js'],
                tasks: ['cssmin', 'uglify', 'ngtemplates', 'watch']
            }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['cssmin', 'ngtemplates', 'uglify', 'watch']);
};
