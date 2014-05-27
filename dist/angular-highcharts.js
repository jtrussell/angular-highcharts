angular.module('hc', []);

angular.module('hc').directive('highchart', ['hcOptions', function(hcSettings) {
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
        if(key.indexOf('hc') === 0 && key.length > 2 && val) {
          // Oh snap! It's a highcharts config item!
          var keyParts = attrs
            .$attr[key] // raw attribute name
            .replace(/^((data|x)-)?hc[:-]/, '') // remove hc- prefix
            .split('-');

          chartOpts.push({
            attr: key,
            path: keyParts,
            pathDepth: keyParts.length,
            val: val
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

      var buildConfig = function() {

        // We're going to do mean things to this array
        var chartOpt = angular.copy(chartOpt);

        // The config object we'll ultimately hand off to the constructor, we
        // may have been handed a top level config object but if not just start
        // with an empty object
        var config = chartOpts.length && chartOpts[0].pathDepth === 0 ?
          scope.$eval(chartOpts.shift()) : {};

        // Apply config options in order of specificity, most general to most
        // specific
        angular.forEach(chartOpts, function(opt) {
          var ix, pathPart, arrayPos, config = this;
          for(ix = 0; ix < opt.pathDepth; ix++) {
            pathPart = opt.path[ix];

            // Could be part of an array...
            if(/(\w+)\[(\d+)\]$/.exec(pathPart)) {
              pathPart = RegExp.$1;
              arrayPos = +RegExp.$2;
              config[pathPart] = config[pathPart] || [];
              while(config[pathPart].length > arrayPos) {
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
      var chart = new Highcharts.Chart(buildConfig());

      /**
       * @todo Step through chartOpts and watch opt.attr redraw whenever
       * something changes.
       */

    }
  };
}]);

angular.module('hc').provider('hcOptions', function() {
  'use strict';

  var options = {};

  this.set = function(userOpts) {
    angular.extend(options, userOpts);
  };

  this.$get = function() {
    return {
      get: function() {
        return angular.copy(options);
      }
    };
  };
});
