var sass = require('sass.js/sass'),
	when = require('promise').when,
	defer = require('promise').defer,
	sys = require('sys'),
	fs = require('fs-promise'),
	settings;

	try{
		settings = require('commonjs-utils/settings').sass;
	}
	catch(e){
		settings = {};
	}


exports.Sass = function(options){
	// setup the options
	options = options || {};
	// options can be passed in, set in local.json or default
	var ext = options.extension || settings.extension || '.sass',
		root = options.root || settings.root || 'sass';

	return function(request){
		var path = request.pathInfo,
			length = path.length,
			dfd = defer();

		function notFound(error){
			error = error || '';
			dfd.resolve({
				status: 404,
				headers: {},
				body: [path + ' not found\n' + error]
			});
		}

		function error(error){
			error = error || '';
			dfd.resolve({
				status: 500,
				headers: {},
				body: ['error reading file ' + path + '\n' + error]
			});
		}

		// see if the extension matches
		if(path.lastIndexOf(ext) === length - ext.length){
			// point the path to the static sass file
			path = root + path;
			// see if the path exists
			fs.stat(path).then(function(stat){
				// if the path points to a file
				if(stat.isFile()){
					// grab the contents of the file
					fs.readFile(path, 'utf8').then(function(contents){
						// try to return the rendered contents
						try {
							dfd.resolve({
								status: 200,
								headers: {
									'content-type': 'text/css; charset=UTF-8'
								},
								body: [sass.render(contents)]
							});
						}
						// catch any parsing errors
						catch(e) {
							error(e);
						}
					}, error);
				}
				else {
					notFound();
				}
			}, notFound);
		}
		else {
			notFound();
		}
		return dfd.promise;
	};
};