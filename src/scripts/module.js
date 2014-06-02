/*global angular */

angular.module('hc', []);

angular.module('hc').run(['Highcharts', 'hcOptions', function(Highcharts, hcOptions) {
  'use strict';
  Highcharts.setOptions(hcOptions.get());
}]);
