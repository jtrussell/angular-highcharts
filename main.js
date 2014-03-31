/*global angular */

(function(ng) {
  'use strict';

  var app = ng.module('demo', ['hc']);

  app.controller('MainCtrl', function($rootScope, $scope) {

    $scope.blargus = 5;

    var series1 = this.series1 = [
      {name: 'foo', y: 2},
      ['bar', 3],
      ['blargus', $scope.blargus]
    ];

    this.setFoo = function(val) {
      series1[0].y = val;
    };

    $scope.$watch('blargus', function(newVal) {
      series1[2].y = parseInt(newVal, 10);
    });

  });
}(angular));
