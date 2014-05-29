/*global angular */

angular.module('hc').provider('Highcharts', function() {
  'use strict';
  var Constructor = window.Highcharts;

  this.use = function(MyHighcharts) {
    Constructor = MyHighcharts;
  };

  this.$get = function() {
    return Constructor;
  };
});
