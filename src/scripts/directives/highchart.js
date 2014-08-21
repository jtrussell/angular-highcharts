/*global angular, Highcharts */

angular.module('hc').directive('highchart', ['$timeout', 'Highcharts', 'hcNormalizeOption', function($timeout, Highcharts, hcNormalizeOption) {
  'use strict';
  return {
    restrict: 'EA',
    template: [
      '<div class="hc-chart">',
        '<div class="hc-chart-loading"></div>',
      '</div>'
    ].join(''),
    link: function(scope, element, attrs) {

      var chartOpts = [];

      angular.forEach(attrs, function(val, key) {
        if(key.indexOf('hc') === 0 && val) {
          // Oh snap! It's a highcharts config item!
          var keyParts = attrs
            .$attr[key] // raw attribute name
            .replace(/^((data|x)-)?hc(-watch)?[:-]/, '') // remove hc- prefix
            .split('-');

          var keyPartsNorm = [];
          angular.forEach(keyParts, function(part) {
            keyPartsNorm.push(hcNormalizeOption(part));
          });

          chartOpts.push({
            path: keyPartsNorm,
            pathDepth: keyPartsNorm.length,
            val: val,
            watch: /hcWatch/.test(key), // Watch these only
            recreate: keyPartsNorm.length === 0 // Options that require a completely new chart when they change
          });
        }
      });

      // Make sure the most general config opts are handled first
      chartOpts.sort(function(a, b) {
        if(a.pathDepth === b.pathDepth) {
          return 0;
        }
        return a.pathDepth < b.pathDepth ? -1 : 1;
      });

      var buildConfig = function(opts) {

        // We're going to do mean things to this array
        opts = angular.copy(opts);

        // The config object we'll ultimately hand off to the constructor, we
        // may have been handed a top level config object but if not just start
        // with an empty object
        var config = opts.length && opts[0].pathDepth === 0 ?
          scope.$eval(opts.shift()) : {};

        // Apply config options in order of specificity, most general to most
        // specific
        angular.forEach(opts, function(opt) {
          var ix, pathPart, arrayPos, config = this;
          for(ix = 0; ix < opt.pathDepth; ix++) {
            pathPart = opt.path[ix];

            // Could be part of an array...
            if(/([a-zA-z]+)\[?(\d+)\]?$/.exec(pathPart)) {
              pathPart = RegExp.$1;
              arrayPos = +RegExp.$2;
              config[pathPart] = config[pathPart] || [];
              while(config[pathPart].length < arrayPos) {
                /**
                 * @todo peek ahead to see if this should be an array... could
                 * that even happen? I guess it's possible to just list out your
                 * data...
                 */
                config[pathPart].push({});
              }
              config = config[pathPart];
              pathPart = arrayPos;
            }

            if(ix === opt.pathDepth - 1) {
              config[pathPart] = scope.$eval(opt.val);
            } else {
              config[pathPart] = config[pathPart] || {};
            }

            config = config[pathPart];
          }
        }.bind(config));

        // Now... force the chart container to *this* element
        config.chart = config.chart || {};
        config.chart.renderTo = element[0];

        return config;
      };

      /**
       * Use the `highchart-deferred` attribute to provide a deferred we should
       * resolve to the chart.
       */
      var done = angular.noop;
      if(attrs.highchartDeferred) {
        var chartDeferred = scope.$eval(attrs.highchartDeferred);
        done = function(chart) {
          $timeout(function() {
            chartDeferred.resolve(chart);
          });
        };
      }

      // Boom.
      var chart = new Highcharts.Chart(buildConfig(chartOpts), done);

      // Resize the chart after container sizes are set.
      $timeout(function() {
        chart.reflow();
      });

      scope.$on('event_hcReflow', function() {
        chart.reflow();
      });

      /**
       * @todo Setup watchers for dynamic hc-* attrs
       * We'll need to inspect the attribute being updated and take appropriate
       * action:
       *  - addSeries / updateSeries
       *  - setTitle
       *  - ...
       */
      
      // angular.forEach(chartOpts, function(opt) {
      //   if(!opt.watch) { return; }
      //   scope.$watch(opt.val, function(newVal) {
      //     if(!newVal) { return; }
      //     if(opt.recreate === 0) {
      //       chart.destroy();
      //       chart = new Highcharts.Chart(buildConfig(chartOpts));
      //       return;
      //     } else {
      //       var opts = chart.options
      //         , obj = opts
      //         , ix, p, pIx;
      //       for(ix = 0; ix < opt.pathDepth; ix++) {
      //         p = opt.path[ix];
      //         if(/(\w+)\[(\d+)\]$/.exec(p)) {
      //           p = RegExp.$1;
      //           pIx = +RegExp.$2;
      //           if(ix === opt.pathDepth - 1) {
      //             //if(p === 'series') {
      //             //  obj[p][pIx].update(scope.$eval(opt.val));
      //             //} else {
      //             obj[p][pIx] = scope.$eval(opt.val);
      //             //}
      //           } else {
      //             obj = obj[p][pIx];
      //           }
      //         } else {
      //           if(ix === opt.pathDepth - 1) {
      //             obj[p] = scope.$eval(opt.val);
      //           } else {
      //             obj = obj[p];
      //           }
      //         }
      //       }
      //       /**
      //        * @todo How can we handle this better?
      //        * - Take different action on series changes?
      //        * - Series data changes...
      //        * - Other items that require more than a redraw?
      //        */
      //       chart.destroy();
      //       chart = new Highcharts.Chart(opts);
      //     }

      //   }, true);
      // });

    }
  };
}]);
