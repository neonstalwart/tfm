var Sass = require('jsgi/sass').Sass,
	port = process.env.PORT || 8001,
	local = process.env.RACK_ENV !== 'production';

require('jsgi-node/jsgi-node').start(
	require("pintura/jsgi/cascade").Cascade([ 
		require("pintura/jsgi/static").Static({
			urls: [""],
			roots: ["public"]
		}),
		Sass()
	]), 
	{
		port: parseInt(port)
	}
);

// having a REPL is really helpful
if (local) {
	require("repl").start().scope.require = require;
}
