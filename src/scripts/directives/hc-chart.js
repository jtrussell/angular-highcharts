/*global angular, Highcharts */

angular.module('hc').directive('hcChart', function() {
  'use strict';
  return {
    replace: true,
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
      xAxis: '=xAxis',
      yAxis: '=yAxis',

      // some handy shortcuts
      seriesData: '=seriesData',
      seriesName: '=seriesName',
      seriesType: '=seriesType',

      titleText: '=titleText',

      tooltipFormatter: '=tooltipFormatter'
    },
    template: [
      '<div class="hc-chart hc-pie">',
        '<span class="hc-chart-loading"></span>',
      '</div>'
    ].join(''),
    link: function(scope, element, attrs) {

      // Make sure we always render the chart to the element this directive is
      // attached to
      if(scope.config && scope.config.chart) {
        scope.config.chart.renderTo = element[0];
      }

      if(scope.chart) {
        scope.chart.renderTo = element[0];
      }

      var chart = new Highcharts.Chart(scope.config || {
        chart: scope.chart || {
          renderTo: element[0]
        },
        credits: scope.credits || {
          enabled: false
        },
        title: scope.title || {
          text: scope.titleText || 'Chart Title'
        },
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
          name: scope.seriesName || 'Data',
          data: scope.seriesData || []
        }]
      });

      scope.$watch('seriesData', function(newData) {
        chart.series[0].setData(newData, true);
      }, true);
    }
  };
});
