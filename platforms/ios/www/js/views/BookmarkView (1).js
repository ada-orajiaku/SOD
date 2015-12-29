var BookmarkView = function(adapter, template, listItemTemplate) {
    
	this.initialize = function () {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
    };

    this.render = function() {
        this.el.html(template());
    	sod.loadBookmark().done(function(sods) {
            $('#bookmark-list').html(listItemTemplate(sods));
        });
        return this;
    };

    this.initialize();

}
