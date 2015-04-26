module.exports = function(grunt) {
	
	require('load-grunt-tasks')(grunt); 

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
	  my_target:{
			files: {
			'script.js' : ['common.js']
			} //files
		},
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }		
    },
	sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'styles.css': ['commonsas.scss']
            }
        }
    },
	babel: {
		options: {
		  sourceMap: true
		},
		dist: {
		  files: {
			'es5.js': ['es6.js']
		  }
		}
  }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'sass', 'babel']);

  // A very basic default task.
  grunt.registerTask('default2', 'Log some stuff.', function() {
    grunt.log.write('------------------').ok();
  });
  
};