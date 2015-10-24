// Generated on 2014-11-29 using generator-ionic 0.6.1
'use strict';

var _ = require('lodash');
var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');

module.exports = function  (grunt) {
	
	//load grunt task automatically
	require('load-grunt-tasks')(grunt);

	//Time how long tasks take
	require('time-grunt')(grunt);

	//grant configuration
	grunt.initConfig({
		express:{
			options : {},
			dev : {
				options:{
					script: 'server.js'
				}
			},
			// build:{
			// 	options:{
			// 		script : '_release/server.js'
			// 	}
			// }
		},

		exec:{
			run_server : 'node _release/server.js',
			git_push :'cd _release && git checkout master && git add -A && git commit -m "deploy" && git push && cd ..',
			// release_dir : 'cd _release',
			// git_checkout : 'git checkout master',
			// git_add : 'git add -A',
			// git_commit : 'git commit -m "deploy"',
			// git_push : 'git push',
			// root_dir : 'cd ..'
		},

		watch : {
			express: {
				files:  [ '**/*.js', '!public/**/*.js','!node_modules/**/*.js', '!_release/**/*.js','!bower_components/**/*.js' ],
				tasks:  [ 'express:dev' ],
				options: {
					spawn: false,
					atBegin: true,
				}
			},
			configFiles: {
				files: [ 'Gruntfile.js', 'config/*.js' ],
				options: {
					reload: true,
					spawn: false,
				}
			},
			public:{
				files : ['**/*.html','file_templates/**/*.html','!_release/**/*.html', '!node_modules/**/*.html','!bower_components/**/*.html','public/css/**/*.css','public/scripts/**/*.js', 'public/images/**/*'],
				options: {
					livereload: true,
					spawn: false,
				},
			}
		},

		open:{
			all : {
				path: 'http://localhost:9090/',
				app: 'Chrome',
				options:{
					delay:10000
				}
			}
		},

		parallel: {
			web: {
				options: {
					stream: true
				},
				tasks: [{
					grunt: true,
					args: ['watch:express']
				}, {
					grunt: true,
					args: ['watch:configFiles']
				}, {
					grunt: true,
					args: ['watch:public']
				}]
			}
		},
		ngconstant: {
			options: {
				space: '  ',
				wrap: '"use strict";\n\n {%= __ngModule %}',
				name: 'inspektorat.config',
				dest: 'public/scripts/config.js'
			},
			development: {
				constants: {
					ENV: {
						name: 'development',
						apiEndpoint: 'http://localhost:9090'
					}
				}
			},
			production: {
				constants: {
					ENV: {
						name: 'production',
						apiEndpoint: 'http://inspektorat-walmiki.rhcloud.com'
					}
				}
			}
		},

		clean:{
			// build : ['_build/*'],
			release : ['_release/*', '!_release/.git*', '!_release/.openshift*'],
			tmp:['.tmp']
		},

		/* Reads HTML for usemin blocks to enable smart builds that automatically
	    ** concat, minify and revision files. Creates configurations in memory so
	    ** additional tasks can operate on them
	    */
	    useminPrepare: {
	    	// release:{
	    	// 	public:{
	    	// 		dest: '_release/views',
	    	// 		src: ['views/**/*.html']
	    	// 	},
	    	// 	dashboard:{
	    	// 		dest: '_release/dashboard/views',
	    	// 		src: ['dashboard/views/**/*.html']
	    	// 	}
	    	// },
	    	public:{
	    		dest: '_release/views',
	    		src: ['views/**/*.html']
	    	},
	    	dashboard:{
	    		dest: '_release/dashboard/views',
	    		src: ['dashboard/views/**/*.html']
	    	}
	    	// build:{
	    	// 	public:{
	    	// 		dest: '_build/views',
	    	// 		src: ['views/**/*.html']
	    	// 	},
	    	// 	dashboard:{
	    	// 		dest: '_build/dashboard/views',
	    	// 		src: ['dashboard/views/**/*.html']
	    	// 	}
	    	// }
	    },

	    // Performs rewrites based on the useminPrepare configuration
	    usemin: {
	    	// release:{
	    		'public-html' :{
	    			options:{
	    				assetsDirs : ['_release/public'],
	    				type:'html'
	    			},
	    			files: {src: ['_release/views/**/*.html']}
	    		},
	    		'css':{
	    			options:{
	    				assetsDirs : ['_release/public'],
	    				type:'css'
	    			},
	    			files: {src: ['_release/public/**/*.css']}
	    		},
	    		'dashboard-html' :{
	    			options:{
	    				assetsDirs : ['_release/public'],
	    				type:'html'
	    			},
	    			files: {src: ['_release/dashboard/views/**/*.html']}
	    		},
	    	// },
	    	// build:{
	    	// 	'public-html' :{
	    	// 		options:{
	    	// 			assetsDirs : ['_build/public'],
	    	// 			type:'html'
	    	// 		},
	    	// 		files: {src: ['_build/views/**/*.html']}
	    	// 	},
	    	// 	'css':{
	    	// 		options:{
	    	// 			assetsDirs : ['_build/public'],
	    	// 			type:'css'
	    	// 		},
	    	// 		files: {src: ['_build/public/**/*.css']}
	    	// 	},
	    	// 	'dashboard-html' :{
	    	// 		options:{
	    	// 			assetsDirs : ['_build/public'],
	    	// 			type:'html'
	    	// 		},
	    	// 		files: {src: ['_build/dashboard/views/**/*.html']}
	    	// 	},
	    	// }
	    },


	    htmlmin: {
	    	dist: {
	    		options: {
	    			collapseWhitespace: true,
	    			collapseBooleanAttributes: true,
	    			removeCommentsFromCDATA: true,
	    			removeOptionalTags: true
	    		},
	    		files: [{
	    			expand: true,
	    			cwd: '_release/',
	    			src: ['*.html',
	    			'views/**/*.html',
	    			'dashboard/views/**/*.html',
	    			'public/templates/**/*.html'],
	    			dest: '_release'
	    		}]
	    	}
	    },

	    cssmin: {
	    	public: {
	    		files: [{
	    			expand: true,
	    			cwd: '.tmp/concat/public/css',
	    			src: ['*.css'],
	    			dest: '_release/public/css',
	    			ext: '.css'
	    		}]
	    	}
	    },

	    uglify: {
	    	public: {
	    		files: [{
	    			expand: true,
	    			cwd: '.tmp/concat/public/scripts',
	    			src: '*.js',
	    			dest: '_release/public/scripts'
	    		}]
	    	}
	    },

	    copy:{
	    	all:{
	    		expand:true,
	    		dest: '_release/',
	    		src: ['**',
	    		'!Gruntfile.js',
	    		'!bower_components/**',
	    		'!node_modules/**',
	    		'!public/scripts/**',
	    		'!public/css/**/*.css',
	    		'!public/uploads/**',
	    		'!_release/**'
	    		]
	    	},
	    	fonts:{
	    		expand:true,
	    		dest: '_release/public/fonts/',
	    		flatten:true,
	    		src:[
	    		'bower_components/components-font-awesome/fonts/**',
	    		'bower_components/bootstrap/fonts/**'
	    		]
	    	}
	    },
	    ngAnnotate: {
	    	options: {
	    		singleQuotes: true,
	    	},
	    	tmp:{
	    		files : [
	    		{
	    			expand: true,
	    			src: ['.tmp/concat/public/scripts/**/*.js'],
	    		},
	    		]
	    	}
	    }
	});

	//initialization
	grunt.registerTask('build',[
		'clean:release',
		'ngconstant:development',
		'useminPrepare',
		'copy:all',
		'copy:fonts',
		'concat',
		'ngAnnotate',
		'cssmin:public',
		'uglify:public',
		'usemin',
		'htmlmin',
		'clean:tmp',
		'open',
		'exec:run_server',
		]);

	grunt.registerTask('push','Push to production server if git exist', function(){
		if(fs.existsSync(path.join(__dirname,'_release/.git'))){
			// grunt.task.run(['exec:release_dir', 'exec:git_checkout','exec:git_add','exec:git_commit','exec:git_push','exec:root_dir']);
			grunt.task.run(['force:exec:git_push']);
		}
	});

	grunt.registerTask('deploy',[
		'clean:release',
		'ngconstant:production',
		'useminPrepare',
		'copy:all',
		'copy:fonts',
		'concat',
		'ngAnnotate',
		'cssmin:public',
		'uglify:public',
		'usemin',
		'htmlmin',
		'clean:tmp',
		'ngconstant:development',
		//'push'
		]);

	grunt.registerTask('serve',[
		'open',
		'parallel:web',
		]);
}