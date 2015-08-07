var place_backtop = function() {
    var off = $footer.offset().left + $footer.width() - $backtop.width();
    $backtop.css("left", off);
};

var fade_backtop = function() {
    var offset = 400;
    ( $(this).scrollTop() > offset ) ? 
        $backtop.addClass('bt-is-visible') : 
        $backtop.removeClass('bt-is-visible');
};

var setup_backtop = function() {
    $root = $("html, body");
    $footer = $(".site-footer");
    $backtop = $("#backtop");

    $backtop.click(function() {
        $root.animate( { scrollTop: 0 }, 400 );
        return false;
    });


    $(window).resize(place_backtop);
    $(window).scroll(fade_backtop);

    place_backtop();
};

//----------------------------------------------------------------------------

var setup_hrefjmp = function() {
    $root = $("html, body");
    $("a[href*=#]").click(function() {
        var href = $.attr(this, 'href');
        var isfn = (href.substr(0, 4) === "#fn:") ? true : false;
        var id = href.replace(":", "\\:");

        var orig = $(id).css("color");
        if (isfn) {
            $(id).css("color", "red");
        }

        $root.animate(
                { scrollTop: $(id).offset().top }, 
                400, 
                function() { 
                    if (!isfn) return;
                    $(id).stop().animate({ color: orig }, 2000);
                });
        return false;
    });
};

//----------------------------------------------------------------------------

$(document).ready( function() {
    setup_backtop();
    setup_hrefjmp();
} );
