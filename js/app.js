require.config({
  paths: {
    jquery: '/lib/jquery/dist/jquery',
    underscore: '/lib/underscore-amd/underscore',
    backbone: '/lib/backbone-amd/backbone'
  }
});

require(['jquery'], function($) {
  $(function() {
    $('#header-control').on('click', function() {
      console.log('clicked');
      $('#header').toggleClass('open');
    });
  });
});

if (false) {
  require(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    console.log("All scripts loaded.");

  });
}
