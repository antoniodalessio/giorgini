const http = require('http');


module.exports = function(grunt) {

	var baseDir = './src/assets/'
	var bowerDir = "bower_components/";
	var destDir = './site/'
		
	var common = [
		bowerDir + 'jquery/dist/jquery.js',
		baseDir + 'js/common.js'
	];

	// grunt.registerTask('templates', 'My "default" task description.', function() {
	// 	console.log("pre")

	// 	fetch("http://127.0.0.1:15645/api/publish",
	// 		 { 
	// 			 method: "get",
	// 			 headers: { 'Content-Type': 'application/json', "Authorization": "Bearer 8128422aa443a27e8ec407b5e9fc268add53566e48aa7898d415e06e5492068fe4010e777d877a73ec557ff7281dfc9765ef488840a551625c6b84c5e214aac7"},
	// 	}).then(res => res.json())
	// 	.then(json => console.log(json));
		
	// });


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
					[destDir + 'js/index.min.js']: common.concat([bowerDir + 'lightslider/dist/js/lightslider.js', baseDir + 'js/index.js']),
					[destDir + 'js/about.min.js']: common.concat([bowerDir + 'lightslider/dist/js/lightslider.js', baseDir + 'js/about.js']),
					[destDir + 'js/services.min.js']: common.concat([baseDir + 'js/services.js']),
					[destDir + 'js/stories.min.js']: common.concat([baseDir + 'js/stories.js']),
					[destDir + 'js/contact.min.js']: common.concat([bowerDir + 'jquery-validation/dist/jquery.validate.js' , baseDir + 'js/contact.js']),
					[destDir + 'js/privacy.min.js']: common.concat([])
				}
			}
		},
		templates: {

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
			},
			// test: {
			// 	files: [baseDir + 'templates/**/*.hbs'],
			// 	tasks: ['templates']
			// }
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');


	grunt.registerTask('default', ['compass', 'uglify', 'watch']);
}