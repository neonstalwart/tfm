var port = process.env.PORT || 8001,
	local = process.env.RACK_ENV !== 'production',
	defer = require('promise').defer,
	when = require('promise').when,
	staticOptions = {
		urls: [''],
		roots: ['public']
	},
	staticModule = process.version < 'v0.1.99' ? 'jsgi/static' : 'pintura/jsgi/static';


require('jsgi-node/jsgi-node').start(
	function(request){
		var dfd = defer();

		require("pintura/jsgi/cascade").Cascade([
			require(staticModule).Static(staticOptions),
			require('jsgi/sass').Sass()
		])(request).then(function(response){
			response.headers['node-ver'] = process.version;
			dfd.resolve(response);
		});

		return dfd;
	},
	{
		port: parseInt(port)
	}
);

// having a REPL is really helpful
if (local) {
	require("repl").start().scope.require = require;
}

// this is only so that nodules gets the dependencies for the static module that ends up being used.
if (require.ensure) {
	require.ensure(staticModule);
}
