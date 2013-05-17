# !WORK IN PROGRESS

# Angular Highcharts

An AngularJS directive for creating Hightcharts charts.

# Usage

## With convenient config options...

```javascript
$scope.chartData = [
  ['foo': 1],
  ['bar': 2],
  ['wowza': 3]
];
```

```html
<div hc-chart
    title-text="'Awesome Chart!'"
    seriesType="'pie'"
    seriesName="'Slices of Pizza'"
    data="chartData"></div>
```

[Demo](#)

## ... with highcharts config options

```javascript
$scope.chartOptions = {/* ... */};
$scope.chartSeries = [/* ... */];
```

```html
<div hc-chart
    chart="chartOptions"
    series="chartSeries"></div>
```

[Demo](#)

## ... or an entire Highcharts config!

```javascript
$scope.chartConfig = {/* ... */};
```

```html
<div hc-chart="chartConfig"></div>
```

[Demo](#)

# Tests
