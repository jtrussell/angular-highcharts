/*global angular, Highcharts */

angular.module('hc').directive('highchart', ['Highcharts', 'hcOptions', 'hcNormalizeOption', function(Highcharts, hcSettings, hcNormalizeOption) {
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
            .replace(/^((data|x)-)?hc[:-]/, '') // remove hc- prefix
            .split('-');

          var keyPartsNorm = [];
          angular.forEach(keyParts, function(part) {
            keyPartsNorm.push(hcNormalizeOption(part));
          });

          chartOpts.push({
            path: keyPartsNorm,
            pathDepth: keyPartsNorm.length,
            val: val,
            // Don't bother watching literals
            watch: !(/^\d/.test(val) || /^['"].*['"]$/.test(val))
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
            if(/(\w+)\[(\d+)\]$/.exec(pathPart)) {
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

        // Underlay our default settings
        config = angular.extend(hcSettings.get(), config);

        // Now... force the chart container to *this* element
        config.chart = config.chart || {};
        config.chart.renderTo = element[0];

        return config;
      };

      // Boom.
      var chart = new Highcharts.Chart(buildConfig(chartOpts));

      // Resize the chart after container sizes are set.
      setTimeout(function() {
        chart.reflow();
      });

      // Setup watchers for all hcd attrs
      angular.forEach(chartOpts, function(opt) {
        if(!opt.watch) { return; }
        scope.$watch(opt.val, function(newVal) {
          if(!newVal) { return; }
          var opts = chart.options, obj = opts, ix, p;
          if(opt.pathDepth === 0) {
            chart.destroy();
            chart = new Highcharts.Chart(buildConfig(chartOpts));
            return;
          } else {
            for(ix = 0; ix < opt.pathDepth; ix++) {
              p = opt.path[ix];
              if(/(\w+)\[(\d+)\]$/.exec(p)) {
                if(ix === opt.pathDepth - 1) {
                  //if(RegExp.$1 === 'series') {
                  //  obj[RegExp.$1][RegExp.$2].update(scope.$eval(opt.val));
                  //} else {
                    obj[RegExp.$1][RegExp.$2] = scope.$eval(opt.val);
                  //}
                } else {
                  obj = obj[RegExp.$1][+RegExp.$2];
                }
              } else {
                if(ix === opt.pathDepth - 1) {
                  obj[p] = scope.$eval(opt.val);
                } else {
                  obj = obj[p];
                }
              }
            }

          }

          //chart.destroy();
          //chart = new Highcharts.Chart(buildConfig(chartOpts));
          chart.destroy();
          chart = new Highcharts.Chart(opts);
        }, true);
      });

    }
  };
}]);