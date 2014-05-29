angular.module('hc', []);

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
            .replace(/^((data|x)-)?hc(-static)?[:-]/, '') // remove hc- prefix
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
            watch: !(/^\d/.test(val) ||
              /^['"].*['"]$/.test(val) ||
              /true|false|null|undefined/.test(val) ||
              /hcStatic/.test(key)),
            // Options that require a completely new chart when they change
            recreate: keyPartsNorm.length === 0
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
          if(opt.recreate === 0) {
            chart.destroy();
            chart = new Highcharts.Chart(buildConfig(chartOpts));
            return;
          } else {
            var opts = chart.options
              , obj = opts
              , ix, p, pIx;
            for(ix = 0; ix < opt.pathDepth; ix++) {
              p = opt.path[ix];
              if(/(\w+)\[(\d+)\]$/.exec(p)) {
                p = RegExp.$1;
                pIx = +RegExp.$2;
                if(ix === opt.pathDepth - 1) {
                  //if(p === 'series') {
                  //  obj[p][pIx].update(scope.$eval(opt.val));
                  //} else {
                  obj[p][pIx] = scope.$eval(opt.val);
                  //}
                } else {
                  obj = obj[p][pIx];
                }
              } else {
                if(ix === opt.pathDepth - 1) {
                  obj[p] = scope.$eval(opt.val);
                } else {
                  obj = obj[p];
                }
              }
            }
            /**
             * @todo How can we handle this better?
             * - Take different action on series changes?
             * - Series data changes...
             * - Other items that require more than a redraw?
             */
            chart.destroy();
            chart = new Highcharts.Chart(opts);
          }

        }, true);
      });

    }
  };
}]);

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

angular.module('hc').factory('hcNormalizeOption', function() {
  'use strict';

  var map = {
    activeaxislabelstyle: 'activeAxisLabelStyle',
    activecolor: 'activeColor',
    activedatalabelstyle: 'activeDataLabelStyle',
    addseries: 'addSeries',
    afteranimate: 'afterAnimate',
    aftersetextremes: 'afterSetExtremes',
    alignticks: 'alignTicks',
    allowdecimals: 'allowDecimals',
    allowpointselect: 'allowPointSelect',
    alternategridcolor: 'alternateGridColor',
    arrowsize: 'arrowSize',
    backgroundcolor: 'backgroundColor',
    bordercolor: 'borderColor',
    borderradius: 'borderRadius',
    borderwidth: 'borderWidth',
    buttonoptions: 'buttonOptions',
    chartoptions: 'chartOptions',
    checkboxclick: 'checkboxClick',
    classname: 'className',
    connectends: 'connectEnds',
    connectnulls: 'connectNulls',
    contextbutton: 'contextButton',
    cropthreshold: 'cropThreshold',
    dashstyle: 'dashStyle',
    datalabels: 'dataLabels',
    dataparser: 'dataParser',
    dataurl: 'dataURL',
    datetimelabelformats: 'dateTimeLabelFormats',
    defaultseriestype: 'defaultSeriesType',
    drillupbutton: 'drillUpButton',
    enablemousetracking: 'enableMouseTracking',
    endangle: 'endAngle',
    endontick: 'endOnTick',
    fillcolor: 'fillColor',
    fillopacity: 'fillOpacity',
    followpointer: 'followPointer',
    followtouchmove: 'followTouchMove',
    footerformat: 'footerFormat',
    formattributes: 'formAttributes',
    gridlinecolor: 'gridLineColor',
    gridlinedashstyle: 'gridLineDashStyle',
    gridlineinterpolation: 'gridLineInterpolation',
    gridlinewidth: 'gridLineWidth',
    gridzindex: 'gridZIndex',
    headerformat: 'headerFormat',
    hidedelay: 'hideDelay',
    hideduration: 'hideDuration',
    ignorehiddenseries: 'ignoreHiddenSeries',
    inactivecolor: 'inactiveColor',
    innerradius: 'innerRadius',
    itemdistance: 'itemDistance',
    itemhiddenstyle: 'itemHiddenStyle',
    itemhoverstyle: 'itemHoverStyle',
    itemmarginbottom: 'itemMarginBottom',
    itemmargintop: 'itemMarginTop',
    itemstyle: 'itemStyle',
    itemwidth: 'itemWidth',
    labelformat: 'labelFormat',
    labelformatter: 'labelFormatter',
    labelstyle: 'labelStyle',
    legendindex: 'legendIndex',
    legenditemclick: 'legendItemClick',
    linecolor: 'lineColor',
    lineheight: 'lineHeight',
    linewidth: 'lineWidth',
    linkedto: 'linkedTo',
    marginbottom: 'marginBottom',
    marginleft: 'marginLeft',
    marginright: 'marginRight',
    margintop: 'marginTop',
    maxcolor: 'maxColor',
    maxheight: 'maxHeight',
    maxpadding: 'maxPadding',
    maxstaggerlines: 'maxStaggerLines',
    maxzoom: 'maxZoom',
    menuitemhoverstyle: 'menuItemHoverStyle',
    menuitemstyle: 'menuItemStyle',
    menustyle: 'menuStyle',
    mincolor: 'minColor',
    minpadding: 'minPadding',
    minrange: 'minRange',
    mintickinterval: 'minTickInterval',
    minorgridlinecolor: 'minorGridLineColor',
    minorgridlinedashstyle: 'minorGridLineDashStyle',
    minorgridlinewidth: 'minorGridLineWidth',
    minortickcolor: 'minorTickColor',
    minortickinterval: 'minorTickInterval',
    minorticklength: 'minorTickLength',
    minortickposition: 'minorTickPosition',
    minortickwidth: 'minorTickWidth',
    mouseout: 'mouseOut',
    mouseover: 'mouseOver',
    negativecolor: 'negativeColor',
    negativefillcolor: 'negativeFillColor',
    nodata: 'noData',
    outerradius: 'outerRadius',
    pinchtype: 'pinchType',
    plotbackgroundcolor: 'plotBackgroundColor',
    plotbackgroundimage: 'plotBackgroundImage',
    plotbands: 'plotBands',
    plotbordercolor: 'plotBorderColor',
    plotborderwidth: 'plotBorderWidth',
    plotlines: 'plotLines',
    plotoptions: 'plotOptions',
    plotshadow: 'plotShadow',
    pointformat: 'pointFormat',
    pointinterval: 'pointInterval',
    pointplacement: 'pointPlacement',
    pointstart: 'pointStart',
    relativeto: 'relativeTo',
    renderto: 'renderTo',
    resetzoombutton: 'resetZoomButton',
    reversedstacks: 'reversedStacks',
    selectionmarkerfill: 'selectionMarkerFill',
    setextremes: 'setExtremes',
    showaxes: 'showAxes',
    showcheckbox: 'showCheckbox',
    showduration: 'showDuration',
    showempty: 'showEmpty',
    showfirstlabel: 'showFirstLabel',
    showinlegend: 'showInLegend',
    showlastlabel: 'showLastLabel',
    sourceheight: 'sourceHeight',
    sourcewidth: 'sourceWidth',
    spacingbottom: 'spacingBottom',
    spacingleft: 'spacingLeft',
    spacingright: 'spacingRight',
    spacingtop: 'spacingTop',
    stacklabels: 'stackLabels',
    staggerlines: 'staggerLines',
    startangle: 'startAngle',
    startofweek: 'startOfWeek',
    startontick: 'startOnTick',
    stickytracking: 'stickyTracking',
    symbolfill: 'symbolFill',
    symbolheight: 'symbolHeight',
    symbolpadding: 'symbolPadding',
    symbolradius: 'symbolRadius',
    symbolsize: 'symbolSize',
    symbolstroke: 'symbolStroke',
    symbolstrokewidth: 'symbolStrokeWidth',
    symbolwidth: 'symbolWidth',
    symbolx: 'symbolX',
    symboly: 'symbolY',
    textalign: 'textAlign',
    tickcolor: 'tickColor',
    tickinterval: 'tickInterval',
    ticklength: 'tickLength',
    tickpixelinterval: 'tickPixelInterval',
    tickposition: 'tickPosition',
    tickpositioner: 'tickPositioner',
    tickpositions: 'tickPositions',
    tickwidth: 'tickWidth',
    tickmarkplacement: 'tickmarkPlacement',
    trackbyarea: 'trackByArea',
    turbothreshold: 'turboThreshold',
    usehtml: 'useHTML',
    valuedecimals: 'valueDecimals',
    valueprefix: 'valuePrefix',
    valuesuffix: 'valueSuffix',
    verticalalign: 'verticalAlign',
    xaxis: 'xAxis',
    xdateformat: 'xDateFormat',
    yaxis: 'yAxis',
    zindex: 'zIndex',
    zoomtype: 'zoomType'
  };

  return function(optIn) {
    return map.hasOwnProperty(optIn) ? map[optIn] : optIn;
  };
});

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
