var HomeView = function(adapter, template, listItemTemplate) {

	this.initialize = function () {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
    };

    this.render = function() {
    	var today = new Date();
    	var data = {'month':monthNames[today.getMonth()],'year':today.getFullYear()}
        this.el.html(template(data));
    	sod.load().done(function(sods) {
            $('#thelist').html(listItemTemplate(sods));
            $('#thelist').show();
            $('#intro').hide();
        });
        return this;
    };

    this.initialize();

}
