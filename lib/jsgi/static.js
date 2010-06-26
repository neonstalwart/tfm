var when = require('promise').when,
	defer = require('promise').defer,
	sys = require('sys'),
	fs = require('fs-promise'),
	mime = require("jack/mime");

exports.Static = function(options){
	options = options || {};

	var urls = options["urls"] || ["/favicon.ico"],
		index = options.index || 'index.html',
		roots = options["roots"] || [""];

	return function(request){
		var path = request.pathInfo;

		for (var i = 0; i < urls.length; i++) {
			if (path.indexOf(urls[i]) === 0) {
				var rootIndex = 0;
				var dfd = defer();
				checkNextRoot();
				return dfd.promise;
			}
		}
		return {
			status: 404,
			headers: {},
			body: [path + " not found"]
		};
		function checkNextRoot(){
			if (rootIndex >= roots.length) {
				dfd.resolve({
					status: 404,
					headers: {},
					body: [path + " not found"]
				});
				return;
			}
			
			// automatically defualt to index option for filename if no filename is provided
			path = path.replace(/\/$/, '/' + index);
			
			var file = roots[rootIndex] + path;

			rootIndex++;
			fs.stat(file).then(function(stat){
				if (stat.isFile()) {
					// file exists.

					fs.readFile(file, 'binary').then(function(contents){
						var extension = path.match(/\.[^\.]+$/);
						extension = extension && extension[0];
						dfd.resolve({
							status: 200,
							headers: {
								'content-length': stat.size,
								'content-type': extension && mime.mimeType(extension)
							},
							body: [contents]
						});
					}, checkNextRoot);
				}
				else {
					checkNextRoot();
				}

			}, checkNextRoot);
		}
	};
};
