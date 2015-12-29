// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    homeTpl = Handlebars.compile($("#home-tpl").html());
    sodLiTpl = Handlebars.compile($("#sod-li-tpl").html());
    sodDetailsTpl = Handlebars.compile($("#sod-details-tpl").html());
    contactTpl = Handlebars.compile($("#contact-tpl").html());
    dtvTpl = Handlebars.compile($("#dtv-tpl").html());

    homeURL = /^#home/;
    sodDetailsURL = /^#sod-(\d{1,})/;
    contactURL = /^#contact/;
    dtvURL = /^#dtv/;


    adapter = new WebSqlAdapter();
    adapter.initialize().done(function () {
        route();
    });


    /* --------------------------------- Event Registration -------------------------------- */
    $(window).on('hashchange', route);

    document.addEventListener('deviceready', function () {
        FastClick.attach(document.body);
    }, false);


	snapper = new Snap({
		element: document.getElementById('content'),
   		disable: 'right'
	});

    /* ---------------------------------- Local Functions ---------------------------------- */
    function route() {
        var hash = window.location.hash;

        var match = hash.match(homeURL);
        if (!hash || match) {
            $('body #content').html(new HomeView(adapter,homeTpl,sodLiTpl).render().el);
            snapper.close();
            return;
        }

        //#Sod details page
        var match = hash.match(sodDetailsURL);
        if (match) {
            sod.read(Number(match[1])).done(function(s) {
                $('body #content').html(new SodDetailsView(adapter,sodDetailsTpl,s).render().el);
            });
        }
        //#Contact page
		var match = hash.match(contactURL);
        if (match) {
        	$('body #content').html(new ContactView(adapter,contactTpl).render().el);
        }

        //#Dunamis TV page
		var match = hash.match(dtvURL);
        if (match) {
        	$('body #content').html(new DtvView(adapter,dtvTpl).render().el);
        }

        snapper.close();

    }



}());

