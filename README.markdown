#tfm
sometimes when someone asks a basic question you'll see 'RTFM' as a response.  it's a harsh response but for a laugh and to save myself writing documentation i figured i'd just label the code as `tfm` - all your questions about what the code is capable of will be answered by reading `tfm`.

##lib/
the interesting code.  this is where you'll find the code that does stuff.

###lib/jsgi/
jsgi applications and middleware

####lib/jsgi/sass.js
`exports.Sass` implements a constructor for a jsgi application that wraps [sass.js] [1].  the constructor takes an optional `options` object.  `options` can have the following properties:

* `extension` - the file extension of files to be parsed as sass.  by default this is `'.sass'`
* `root` - the path to the root directory where sass files are located.  by default this is `'sass'`

these options can also be defined by providing them as the `sass` property of _local.json_

	{
		"sass": {
			"extension": ".sass",
			"root": "sass"
		}
	}
	
if no options are defined via the constructor or via _local.json_ then the defaults will be used.
	
###lib/index.js
kind of a demo server to demonstrate the code being used.

##public/
the root directory of the static files served by the demo server.

##sass/
some raw sass files.  _comment.sass_, _continuation.sass_ and _properties.nested.invalid.sass_ are test fixtures from [sass.js] [1]

##local.json
an application configuration file.  you can access the contents of this file as an object via

	settings = require('commonjs-utils/settings');

##package.json
a commonjs package descriptor file.  this file is used by [nodules] [2] to find the mappings for all the dependencies of this package.

 [1]: http://github.com/visionmedia/sass.js	"sass.js"
 [2]: http://github.com/kriszyp/nodules		"nodules"
