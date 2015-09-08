function MediaStore () {
	this.items = [];
}
MediaStore.prototype.formatDate = function(){
	//var itemArray = res.body.results.map(r => r);

	// Post processing of the data
	this.items.forEach((item, i) => {
		item.id = i;
		item.releaseDate = item.releaseDate.substring(0,10); // Format the date to just show the date itself instead of GMT
	})
	return this.items;
}
module.exports = MediaStore
