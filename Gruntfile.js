module.exports = function(grunt) {

	var baseDir = './src/assets/'
	var bowerDir = "bower_components/";
	var destDir = './site/'
		
	var common = [
		bowerDir + 'jquery/dist/jquery.js',
		bowerDir + 'magnific-popup/dist/jquery.magnific-popup.js',
		baseDir + 'js/common.js'
	];


	grunt.initConfig({
		
		compass: {
			dist: {
			options: {
				sassDir: baseDir + 'scss',
				cssDir: destDir + 'css',
				environment: 'production'
			}
			},
			dev: {
				options: {
					sassDir: baseDir + 'scss',
					cssDir: destDir + 'css'
				}
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					[destDir + 'js/index.min.js']: common.concat([baseDir + 'js/index.js'])
				}
			}
		},
		watch: {
			css: {
				files: [baseDir + 'scss/**/*.scss'],
				tasks: ['compass'],
				options: {
				spawn: false,
				},
			},
			js: {
				files: [baseDir + 'js/**/*.js'],
				tasks: ['uglify'],
				options: {
				spawn: false,
				},
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');


	grunt.registerTask('default', ['compass', 'uglify', 'watch']);
}