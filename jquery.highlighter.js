/*
 * jQuery highlighter plugin
 *
 * version 1.0 (2/29/2012)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * The highlighter() method provides a simple way of highlighting DOM elements.  
 *
 * highlighter takes the following {} options
 *
 *   color:  The name of the color to apply. 
 *           yellow (default) | red | blue | green
 *
 *   class:  The class name to use for the highlighter
 *           highlighter (default)
 *
 *   focus:  When enabled, highlights will disappear when clicked or focused. 
 *           false (default) | true
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
 * @name highlighter
 * @type jQuery
 * @param Object literal options. See above.
 * @cat Plugins/Highlighter
 * @return jQuery
 * @author Brian Herold (bmherold@gmail.com)
 */
(function( $ ) {
    var settings;
    var methods = {
        init    : function ( options ) {
            if (settings.debug) { console.log('calling init'); }
            this.each(function() {
                var $highlight = $('<div class="'+settings['class']+' '+settings['color']+'"/>').data('highlighted', $(this));
                $(this).after($highlight).data('highlight', $highlight);
                $highlight.animate({'opacity': .7}, settings.speed);
                methods.reposition();
            }).focus(function() {
                if (!settings.focus) return;
                var $highlight = $(this).data('highlight');
                if ($highlight) { $highlight.fadeOut(settings.speed, function() { $(this).remove(); }); }
            });
            $(window).bind('resize.highlighter', methods.reposition);
            $('div.'+settings['class']).live('click.highlighter', function() {
                $(this).fadeOut(settings.speed, function() { $(this).remove(); }).prev().focus();
            });
            
            return this;
        }, 
        reposition  : function() {
            if (settings.debug) { console.log('calling reposition'); }
            $('div.'+settings['class']).each(function() {
                var $obj = $(this).data('highlighted');
                var iheight = $obj.outerHeight(true);
                var iwidth = $obj.outerWidth(true);
                var pos = $obj.position();
                $(this).css({top: pos.top+'px', left: pos.left+'px', height: iheight+'px', width: iwidth+'px'});
            });
        }
    };
    
    $.fn.highlighter = function( options ) {
        
        settings = $.extend( {
          'debug'   : false,
          'focus'   : false,
          'class'   : 'highlighter',
          'color'   : 'yellow',
          'speed'   : 400,
          'opacity' : 0.7
        }, options);
        
        return methods.init.apply( this, arguments );
    };
})( jQuery );