/*global angular, jasmine, describe, it, beforeEach, inject, expect */

describe('Directive: highchart', function() {
  'use strict';

  var scope, compile;
  var ChartSpy;
  var ng = angular;

  beforeEach(function() {
    ng.module('hc').config(function(HighchartsProvider) {
      ChartSpy = jasmine.createSpy('Chart').andCallFake(function(args) {
        return {
          options: args,
          destroy: ng.noop,
          reflow: ng.noop
        };
      });
      HighchartsProvider.use({
        Chart: ChartSpy
      });
    });
  });

  beforeEach(module('hc'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = function(tpl, scp) {
      var $el = $compile(ng.element(tpl))(scp);
      scp.$apply();
      return $el;
    };
  }));

  describe('basics', function() {
    var el, tpl = [
      '<div highchart',
        'hc-title-text="null"',
        'hc-series[0]-data="[[1,2],[3,4]]"',
      '</div>'
    ].join('\n');

    it('should create a chart using attributes', function() {
      el = compile(tpl, scope);
      expect(ChartSpy).toHaveBeenCalledWith({
        chart: {
          renderTo: el[0]
        },
        title: {
          text: null
        },
        series: [{
          data: [[1,2],[3,4]]
        }]
      });
    });
  });
});
