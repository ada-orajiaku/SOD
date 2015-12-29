var DtvView = function(adapter, template) {

	this.initialize = function () {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
      //  setSnap();
    };

    this.render = function() {
        this.el.html(template());
        return this;
    };

    this.initialize();
}
