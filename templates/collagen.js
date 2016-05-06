const path = require('path');

module.exports = function (data) {
	var html = '<ul class="ul">';
	data.files.forEach(function (item) {
		html += genItem(item, data.tag);
	});
	html += '</ul>';
	return html;
};

var genItem = function (item, tag) {
	var html = '<li>';
	html += '<div class="flexbox">';
	html += '<div style="width: 50%;"><img class="collage" src="../pictures/' + tag + '/' + path.basename(item) + '"></div>';
	html += '<div style="width: 50%;">' + tag + '<br/><span>' + path.basename(item) + '</span><br /><br /> <span class="icon js-print glyphicon glyphicon-print" aria-hidden="true" data-tag="'+tag+'" data-filename="'+path.basename(item)+'"></span> </div>';
	html += '</div>';
	html += '</li>';
	return html;
};
