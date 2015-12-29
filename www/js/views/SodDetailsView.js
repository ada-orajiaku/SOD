var SodDetailsView = function(adapter, template,sod) {

	this.initialize = function () {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
    };

    this.render = function() {
        this.el.html(template(sod));
        return this;
    };

    this.initialize();
}
