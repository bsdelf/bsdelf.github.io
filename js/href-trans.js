$(function() {
    var $root = $("html, body");
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
});
