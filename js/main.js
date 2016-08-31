function placeBacktop() {
    var off = $footer.offset().left + $footer.width() - $backtop.width();
    $backtop.css('left', off);
}

function fadeBacktop() {
    var offset = 400;
    var action = $(this).scrollTop() > offset ? 'addClass' : 'removeClass';
    $backtop[action]('bt-is-visible');
}

function setupBacktop() {
    $root = $('html, body');
    $footer = $('.site-footer');
    $backtop = $('#backtop');

    $backtop.click(function () {
        $root.animate( { scrollTop: 0 }, 400 );
        return false;
    });

    $(window).resize(placeBacktop);
    $(window).scroll(fadeBacktop);

    placeBacktop();
    fadeBacktop();
}

//----------------------------------------------------------------------------

function setupHrefJump() {
    $root = $('html, body');
    $('a[href*=#]').click(function () {
        var href = $.attr(this, 'href');
        var isfn = (href.substr(0, 4) === '#fn:') ? true : false;
        var id = href.replace(':', '\\:');

        var orig = $(id).css('color');
        if (isfn) {
            $(id).css('color', 'red');
        }

        $root.animate(
                { scrollTop: $(id).offset().top }, 
                400, 
                function () {
                    if (!isfn) return;
                    $(id).stop().animate({ color: orig }, 2000);
                });
        return false;
    });
}

//----------------------------------------------------------------------------

$(document).ready(function () {
    setupBacktop();
    setupHrefJump();
});
