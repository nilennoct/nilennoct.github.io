require.config({
  paths: {
    jquery: '/lib/jquery/dist/jquery',
    underscore: '/lib/underscore-amd/underscore',
    backbone: '/lib/backbone-amd/backbone'
  }
});

require(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
  console.log("All scripts loaded.");

});
