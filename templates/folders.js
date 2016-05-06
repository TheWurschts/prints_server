module.exports = function(data){
	var html = '<h4>Vorhandene (Event)Tage</h4><ul class="ul">';
	data.dirs.forEach(function(item){
		html += '<li><a href="gettag/'+item+'">'+item+'</a></li>';
	})
	html += '</ul>';
	return html;
}
