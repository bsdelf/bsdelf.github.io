$(function() {
    var $root = $("html, body");
    $("#backtop").click(function() {
        $root.animate( { scrollTop: 0 }, 400 );
        return false;
    });
});

var place_backtop = function() {
    var backtop = $("#backtop");
    var footer = $(".site-footer");
    //console.log(footer.offset().left);
    //console.log(footer.width());
    //console.log(backtop.width());
    var off = footer.offset().left + footer.width() - backtop.width();
    backtop.css("left", off);
};

var fade_backtop = function() {
    var backtop = $("#backtop");
    var offset = 400;
    ( $(this).scrollTop() > offset ) ? 
        backtop.addClass('bt-is-visible') : 
        backtop.removeClass('bt-is-visible');
};

jQuery(document).ready( function() {
    $(window).resize(place_backtop);
    $(window).scroll(fade_backtop);
    place_backtop();
} );
