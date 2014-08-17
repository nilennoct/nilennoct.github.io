require.config({
  paths: {
    jquery: '/lib/jquery/dist/jquery.min',
    zepto: '/lib/zeptojs/dist/zepto.min',
    underscore: '/lib/underscore-amd/underscore.min',
    backbone: '/lib/backbone-amd/backbone.min',
    'jquery.fancybox': '/lib/fancybox/source/jquery.fancybox.pack'
  },
  shim: {
    'zepto': {
      exports: '$'
    },
    'jquery.fancybox': {
      deps: ['jquery'],
      exports: 'jQuery.fn.fancybox'
    }
  }
});

(function() {
  var __$ = 'jquery';
  var __event = 'click';

  var isMobile = (function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  })();

  var isTouchable = (function canTouchable() {
    return 'ontouchend' in window;
  })();

  if (isMobile) {
  //  __$ = 'zepto';
    __event = 'touchend';
  }


  require([__$], function($) {
    $.fn.tap = function(selector, callback){
      if (typeof callback === 'undefined') {
        callback = selector;
        selector = undefined;
      }
//      console.log(callback, arguments);
      if (isTouchable) {
        var __touchStartPoint = null;
        var __touchStartTime = 0;
        this
          .on('touchstart', selector, function(event) {
            __touchStartPoint = event.originalEvent.touches[0];
            __touchStartTime = event.originalEvent.timestamp;
          })
          .on('touchend', selector, function(event) {
            var __touchEndPoint = event.originalEvent.changedTouches[0];
            if (event.originalEvent.timestamp - __touchStartTime >= 400) {
              return;
            }
            if (Math.max(Math.abs(__touchEndPoint.clientX - __touchStartPoint.clientX), Math.abs(__touchEndPoint.clientY - __touchStartPoint.clientY)) > 10) {
              return;
            }
            callback.call(this, event);
            event.preventDefault();
          })
          .on('click', selector, function(event) {
            event.preventDefault();
          });
      }
      else {
        this.on('click', selector, callback)
      }
    };
    $(document).ready(function() {
      var $main = $('#main');

      wrapImg('article');

      $('#header-control').tap(function() {
        $('#header').toggleClass('open');
      });

      $('#main-nav').tap('a', function() {
        $('#header').removeClass('open');
      });

      $('#logo').tap(function() {
        $main.scrollTop(0);
      });

      if (typeof history.pushState !== 'undefined') {
        var $mask = $('#loadingMask');
        var initState = {
          title: document.title,
          content: $main.html()
        };

        $('body').tap('a', function(event) {
          var url = '';
          if (event.target.tagName === 'A') {
            url = event.target.href;
          }
          else {
            url = $(event.target).parents('a')[0].href;
          }
          if ( ! new RegExp(location.host).test(url)) {
            return;
          }
          if (event.defaultPrevented) {
            return;
          }
          if (location.href !== url) {
            $mask.addClass('show');
            $.get(url)
              .done(function(html) {
                var $head = $(html.match(/<head[^>]*>[\s\S]*<\/head>/)[0]);
                var $body = $(html.match(/<body[^>]*>[\s\S]*<\/body>/)[0]);
                var state = {
                  title: $head.filter('title').text(),
                  content: $body.filter('#main').html()
                };
                history.pushState(state, state.title, url);
                console.log(document.location.href);
                $main.html(state.content).scrollTop(0);
                document.title = state.title;
              })
              .fail(function() {
                console.error('Network error >_<');
              })
              .always(function() {
                $mask.removeClass('show');
                wrapImg('article');
              });
          }
  //console.log(event);
          event.stopPropagation();
          event.preventDefault();
        });

        $(window).on('popstate', function(event) {
          var state = event.originalEvent.state || initState;
          $main.html(state.content).scrollTop(0);
          document.title = state.title;
        });
      }
    });
  });

  require(['jquery', 'jquery.fancybox'], function($) {
    $('.fancybox').fancybox();
  });

  function wrapImg(selector) {
//    if (isMobile) return;
    $(selector).find('img').each(function(index, element) {
      var $img = $(element);
      $img.wrap('<a class="fancybox" href="' + element.src + '" title="' + element.alt + '"></a>');
    });
  }
})();
