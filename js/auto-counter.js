/** 
 *  Licenses: BSD2CLAUSE
 *
 *  If U really need this piece of code.
 *  Well, read it, take it, whatever.
 *  -- by Yanhui Shen, @bsdelf 
 */

var postcontent = document.getElementById("post-content");
var sections = postcontent.querySelectorAll("h1, h2, h3, h4, h5, h6");

var minl = 1;
var maxl = 99; 
var start = 1;

var prev = maxl;
var levels = null;

Array.prototype.forEach.call(sections, function(section) {
    var tag = section.tagName.toLowerCase();
    var crnt = parseInt(tag.charAt(1));

    if (levels != null) {
        while (prev > crnt) { // dec level, optimized
            levels.pop();
            --prev;
        }   
        if (crnt == prev) {   // same level
            ++levels[levels.length-1];
        } else {                // inc level
            levels.push(start);
        }   
    } else {                    // init
        if (crnt > minl) return;
        levels = [ start ];
    }   

    prev = crnt;

    if (levels != null) {
        pre = ""; 
        levels.forEach( function( level ) { 
            pre += level + "." 
        } );

        section.innerHTML = pre + " " + section.innerHTML;
    }   
} );
