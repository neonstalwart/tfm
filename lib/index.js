var Sass;
require.reloadable(function(){
	Sass = require('./jsgi/sass').Sass;
});

require("jsgi-node").start(
	require("pintura/jsgi/cascade").Cascade([ 
		require("pintura/jsgi/static").Static({
			urls: [""],
			roots: ["public"]
		}),
		Sass()
	])
);

// having a REPL is really helpful
require("repl").start().scope.require = require;
