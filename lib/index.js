var port = process.env.PORT || 8001,
	local = process.env.RACK_ENV !== 'production',
	defer = require('promise').defer,
	when = require('promise').when;

require('jsgi-node/jsgi-node').start(
	function(request){
		var dfd = defer(),
			staticOptions = {
				urls: [''],
				roots: ['public']
			},
			staticModule = process.version < '0.1.95' ? 'jsgi/static' : 'pintura/jsgi/static';

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
