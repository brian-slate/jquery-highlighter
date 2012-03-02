/*
 * jQuery highlighter plugin
 *
 * version 1.1 (2/29/2012)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * The highlighter() method provides a simple way of highlighting DOM elements.  
 *
 * For more details see: https://github.com/unknpwn/jquery-highlighter
 *
 *
 * @example $('.a').highlighter();
 * @desc Highlights all links with the default yellow color.
 *
 * @example $('.a').highlighter({color: 'blue'});
 * @desc Highlights all links with the blue color.
 * 
 * @example $('.a').highlighter('destroy');
 * @desc Will remove any highlights applied to the selected elements.
 * 
 * @name highlighter
 * @type jQuery
 * @param Object literal options. See above.
 * @cat Plugins/Highlighter
 * @return jQuery
 * @author Brian Herold (bmherold@gmail.com)
 */
(function( $ ) {
    
    var opts ={
          debug         : false,                    // enable to display debug in console
          wrapperClass  : 'highlighter-wrap',       // class name for highlighter wrapper
          className     : 'highlighter',            // className for highlighter elements
          color         : 'yellow',                 // yellow|red|blue|green
          glow          : false,                    // adds glow to stripes if true
          speed         : 500,                      // animation speed (for fades)
          opacity       : 0.4,                      // initial opacity (fadein)
          height        : false,                    // fixed stripe height if set (px)
          overlap       : 2,                        // amount for stripes to overlap (px)
          overhang      : 5,                        // amount for highlight to overhang (px)
          hoffset       : .05,                      // random horizontal variation (decimal % of object width)
          rotation      : 0.75,                     // random amount of rotation (deg)
          stripes       : 3,                        // number of stripes per element (will adjust for overlap)
          remove        : true,                     // highlight is removed on click/focus
          focus         : true                      // focus highlighted element when clicked
        }
        
    var methods = {
        init        : function ( options ) {
            this.each(function() {
                methods.highlight.call(this);
            });
            
            if (opts.focus || opts.remove) {
                
                if (opts.remove) { 
                    this.bind('focus.highlighter', function() {
                        $(this).unbind('focus.highlighter'); //unbind the focus event
                        methods.destroy.call($(this));  
                    });
                }
                $('div.'+opts.className).live('click.highlighter', function() {
                    var $obj = $(this).data('highlighted');
                    $obj.unbind('focus.highlighter');
                    if (opts.remove) { methods.destroy.call($obj); }
                    if (opts.focus) { $obj.focus(); }
                });
            }
            
            $(window).bind('resize.highlighter', methods.reposition);
            return this;
        },
        highlight   : function() {
            var $obj = $(this);
            if ($obj.data('highlights')) {
                methods.destroy.call($obj);
            }
            
            var arr_highlights = [],
                iheight = $obj.outerHeight(true)
                iwidth = $obj.outerWidth(true)
                pos = $obj.position(),
                newiHeight = (iheight + opts.overhang*2),
                htop = pos.top - opts.overhang,
                dynamic_height = Math.round(newiHeight/opts.stripes), //total height div by # stripes
                stripeHeight = (opts.height == false) ? dynamic_height : opts.height, // use fixed height if specified
                hnum = Math.round(newiHeight/(stripeHeight-opts.overlap)), //new total # of stripes (different if height set)
                $highlighterWrap = $('<div class="'+opts.wrapperClass+'"/>').data('highlighted', $obj);
            $highlighterWrap.css({
                top                 : (pos.top-opts.overhang)+'px', 
                left                : pos.left+'px', 
                height              : iheight+'px', 
                width               : iwidth+'px'});
            $obj.after($highlighterWrap);
            
            if (opts.debug) {
                console.log("Stripes:"+opts.stripes+", \
                    HeightToHighlight:"+newiHeight+" \
                    StripeHeight:"+stripeHeight+" \
                    NewStripeNumber(overlapping "+opts.overlap+"px):"+hnum);
            }
            
            for (var highlighted=0; highlighted < hnum; highlighted++) {
                var glowClass = opts.glow ? opts.color+'Glow' : '',
                    $highlight = $('<div class="'+opts.className+' '+opts.color+' '+glowClass+'"/>')
                        .data('highlighted', $obj),
                    curtop = ((highlighted*stripeHeight))-(opts.overlap*highlighted),
                    hoffset = Math.round(iwidth*opts.hoffset),
                    curleft = methods.random(-hoffset, hoffset),
                    rotation = methods.random(-opts.rotation, opts.rotation);

                $highlight.css({
                    top                 : curtop+'px', 
                    left                : curleft+'px', 
                    height              : stripeHeight, 
                    width               : iwidth+'px',
                    '-moz-transform'    : 'rotate(' + rotation + 'deg)',
                    '-ms-transform'     : 'rotate(' + rotation + 'deg)',
                    '-o-transform'      : 'rotate(' + rotation + 'deg)',
                    '-webkit-transform' : 'rotate(' + rotation + 'deg)',
                    'transform'         : 'rotate(' + rotation + 'deg)'});
                    
                $highlighterWrap.append($highlight);
                arr_highlights.push($highlight);
            }
            
            $obj.data('highlights', arr_highlights).data('highlighterWrap', $highlighterWrap);
        },
        reposition  : function() {
            $('div.'+opts.wrapperClass).each(function() {
                var $obj = $(this).data('highlighted'),
                    pos = $obj.position();
                $(this).css({top: (pos.top-opts.overhang)+'px', left: pos.left+'px'});
            });
        },
        destroy     : function() {
            var $obj = this,
                $wrapper = this.data('highlighterWrap');
            if (!$wrapper) return;
            $obj.removeData('highlights').removeData('highlighterWrap');
            $wrapper.fadeOut(opts.speed, function() { $(this).remove(); });
        },
        random      : function( min, max ) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
    
    $.highlighter = function( options ) {
        opts = $.extend( opts, options );
    }
    $.fn.highlighter = function( method ) {
        opts = $.extend( opts, method );
        
        if ( methods[method] ) {
          return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.highlighter' );
        } 
    };
})( jQuery );