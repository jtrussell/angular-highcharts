angular.module('hc', []);

angular.module('hc').directive('hcChart', function($rootScope) {
  'use strict';
  return {
    restrict: 'EA',
    scope: {
      // whole config
      config: '=hcChart',

      // top level highcharts opts
      chart: '=chart',
      colors: '=colors',
      credits: '=credits',
      exporting: '=exporting',
      labels: '=labels',
      loading: '=loading',
      legend: '=legend',
      navigation: '=navigation',
      pane: '=pane',
      plotOptions: '=plotOptions',
      series: '=series',
      subtitle: '=subtitle',
      title: '=title',
      tooltip: '=tooltip',
      xAxis: '=xAxis',
      yAxis: '=yAxis',

      // some handy shortcuts
      chartBackgroundColor: '=chartBackgroundColor',

      seriesData: '=seriesData',
      seriesName: '=seriesName',
      seriesType: '=seriesType',

      subtitleText: '=subtitleText',
      titleText: '=titleText',

      // [implement /]
      tooltipFormatter: '=tooltipFormatter'
    },
    template: [
      '<div class="hc-chart">',
        '<span class="hc-chart-loading"></span>',
      '</div>'
    ].join(''),
    link: function(scope, element, attrs) {

      // Make sure we always render the chart to the element this directive is
      // attached to
      if(scope.config) {
        scope.config.chart = scope.config.chart || {};
        scope.config.chart.renderTo = element[0];
      }

      if(scope.chart) {
        scope.chart.renderTo = element[0];
      }

      var chart = new Highcharts.Chart(scope.config || {
        chart: scope.chart || {
          renderTo: element[0],
          backgroundColor: scope.chartBackgroundColor || 'transparent'
        },
        credits: scope.credits || { enabled: false },
        plotOptions: scope.plotOptions || {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return '<b>' + this.point.name + '</b>: ' +
                    Math.round(this.percentage) + ' %';
              }
            }
          }
        },
        series: scope.series || [{
          type: scope.seriesType || 'pie',
          name: scope.seriesName || null,
          data: scope.seriesData || []
        }],
        subtitle: scope.subtitle || {
          text: scope.subtitleText || null
        },
        title: scope.title || {
          text: scope.titleText || null
        },
        tooltip: scope.tooltip || {
          formatter: scope.tooltipFormatter || null
        }
      });

      // -----------------------------------------------------
      // Watch grand ol' config
      // -----------------------------------------------------

      scope.$watch('config', function(newVal) {
        if(!newVal) { return; }
        chart.destroy();
        chart = new Highcharts.Chart(newVal);
      });

      // -----------------------------------------------------
      // Watch top level options
      // -----------------------------------------------------

      scope.$watch('chart', function(newVal) {
        if(!newVal) { return; }
        chart.chart = newVal;
        chart.redraw();
      });

      scope.$watch('colors', function(newVal) {
        if(!newVal) { return; }
        chart.colors = newVal;
        chart.redraw();
      });

      scope.$watch('credits', function(newVal) {
        if(!newVal) { return; }
        chart.credits = newVal;
        chart.redraw();
      });

      scope.$watch('exporting', function(newVal) {
        if(!newVal) { return; }
        chart.exporting = newVal;
        chart.redraw();
      });

      scope.$watch('labels', function(newVal) {
        if(!newVal) { return; }
        chart.labels = newVal;
        chart.redraw();
      });

      scope.$watch('loading', function(newVal) {
        if(!newVal) { return; }
        chart.loading = newVal;
        chart.redraw();
      });

      scope.$watch('legend', function(newVal) {
        if(!newVal) { return; }
        chart.legend = newVal;
        chart.redraw();
      });

      scope.$watch('navigation', function(newVal) {
        if(!newVal) { return; }
        chart.navigation = newVal;
        chart.redraw();
      });

      scope.$watch('pane', function(newVal) {
        if(!newVal) { return; }
        chart.pane = newVal;
        chart.redraw();
      });

      scope.$watch('plotOptions', function(newVal) {
        if(!newVal) { return; }
        chart.plotOptions = newVal;
        chart.redraw();
      });

      scope.$watch('series', function(newVal) {
        if(!newVal) { return; }
        chart.series = newVal;
        chart.redraw();
      });

      scope.$watch('subtitle', function(newVal) {
        if(!newVal) { return; }
        chart.subtitle = newVal;
        chart.redraw();
      });

      scope.$watch('title', function(newVal) {
        if(!newVal) { return; }
        chart.title = newVal;
        chart.redraw();
      });

      scope.$watch('xAxis', function(newVal) {
        if(!newVal) { return; }
        chart.xAxis = newVal;
        chart.redraw();
      });

      scope.$watch('xAxis', function(newVal) {
        if(!newVal) { return; }
        chart.xAxis = newVal;
        chart.redraw();
      });

      scope.$watch('yAxis', function(newVal) {
        if(!newVal) { return; }
        chart.yAxis = newVal;
        chart.redraw();
      });

      // -----------------------------------------------------
      // Watch the convenience options
      // -----------------------------------------------------

      scope.$watch('chartBackgroundColor', function(newVal) {
        if(!newVal) { return; }
        chart.backgroundColor = newVal;
        chart.redraw();
      });

      // Used when we have a single series
      scope.$watch('seriesData', function(newVal) {
        if(!newVal) { return; }
        chart.series[0].setData(newVal);
      }, true);

      // Used when we have a single series
      scope.$watch('seriesName', function(newVal) {
        if(!newVal) { return; }
        chart.series[0].update('name', newVal);
      });

      // Used when we have a single series
      scope.$watch('seriesType', function(newVal) {
        if(!newVal) { return; }
        chart.series[0].update('type', newVal);
      });

      scope.$watch('subtitleText', function(newVal) {
        if(!newVal) { return; }
        chart.setTitle({text: (chart.title || {}).text || ''}, {text: newVal});
      });

      scope.$watch('titleText', function(newVal) {
        if(!newVal) { return; }
        chart.setTitle({text: newVal}, {text: (chart.subtitle || {}).text || ''});
      });

      scope.$watch('tooltipFormatter', function(newVal) {
        if(!newVal) { return; }
        chart.tooltipFormatter = newVal;
        chart.redraw();
      });

    }
  };
});
