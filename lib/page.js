const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const async = require('async');
const folders = require('../templates/folders.js');
const collagen = require('../templates/collagen.js');

function getDirectories (srcpath) {
	return fs.readdirSync(srcpath).filter(function (file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
}

var out = {};
out.collagen = function (path, tag, cb) {
	glob(path + '/**/collage_mini_*.jpg', {}, function (err, files) {
		// files is an array of filenames.
		// If the `nonull` option is set, and nothing
		// was found, then files is ["**/*.js"]
		// er is an error object or null.
		if (err) {
			cb(err);
		} else {
			var html = collagen({files: files, tag: tag});
			out.addHeadFoot(html, function(err, result){
				cb(null, result);
			})
		}
	});
};
out.folder = function (path, cb) {
	var dirs = getDirectories(path);
	var html = folders({dirs: dirs});
	out.addHeadFoot(html, function(err, result){
		cb(null, result);
	})

};

out.addHeadFoot = function (html, cb) {
	async.parallel({
		head: function (callback) {
			fs.readFile(path.join(__dirname, '../templates/global_header.html'), callback);
		},
		foot: function (callback) {
			fs.readFile(path.join(__dirname, '../templates/global_footer.html'), callback);
		}
	}, function (err, result) {
		if (err) {
			cb(err);
		} else {
			cb(null, result.head + html + result.foot);
		}
	});

};
module.exports = out;
