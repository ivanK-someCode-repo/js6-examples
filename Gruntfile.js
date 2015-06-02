module.exports = function(grunt) {
	
	require('load-grunt-tasks')(grunt); 

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // uglify: {
      // options: {
        // banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      // },
	  // my_target:{
			// files: {
			// 'script.js' : ['common.js']
			// } //files
		// },
      // build: {
        // src: 'src/<%= pkg.name %>.js',
        // dest: 'build/<%= pkg.name %>.min.js'
      // }		
    // },
	sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'prod/input_styles.css': ['dev/input.scss'],
				'prod/scroll_styles.css': ['dev/scroll.scss']
            }
        }
    },
	babel: {
		options: {
		  sourceMap: true,
		  modules: "amdStrict"
		},
		dist: {
		  files: {
			'prod/domAssistant.js': ['dev/domAssistant.es6'],
			'prod/input_scripts.js': ['dev/input.es6'],
			'prod/scroll_scripts.js': ['dev/scroll.es6']
			//expand: true,
			//cwd: 'dev/',
			//src: ['**/*.es6'],
			//dest: 'prod/',
		  }
		}
  }

  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-babel');

  // Default task(s).
  grunt.registerTask('default', ['sass', 'babel']);

  // A very basic default task.
  grunt.registerTask('default2', 'Log some stuff.', function() {
    grunt.log.write('------------------').ok();
  });
  
};