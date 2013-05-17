/*global angular, Highcharts */
(function(ng) {
  ng.module('hc', []);

  ng.module('hc').directive('hcChart', function() {
    return {
      restrict: 'A',
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

        // If scope.config... that's cool but we still want to renderTo *this*
        // element

        var chart = new Highcharts.Chart(scope.config || {
          chart: scope.chart || {
            renderTo: element[0]
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
            data: scope.data || []
          }]
        });

        scope.$watch('data', function(newData) {
          chart.series[0].setData(newData, true);
        }, true);
      }
    };
  });
}(angular));
