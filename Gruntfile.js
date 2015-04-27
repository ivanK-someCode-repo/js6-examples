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
                'prod/styles.css': ['dev/input.scss']
            }
        }
    },
	babel: {
		options: {
		  sourceMap: true
		},
		dist: {
		  files: {
			'prod/scripts.js': ['dev/input.js']
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