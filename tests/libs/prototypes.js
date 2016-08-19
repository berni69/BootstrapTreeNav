//Prototypes for Phantomjs
if (!String.prototype.includes) {
	String.prototype.includes = function () {
		'use strict';
		return String.prototype.indexOf.apply(this, arguments) !== -1;
	};
}
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (searchString, position) {
		'use strict';
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};
}
