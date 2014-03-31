# !WORK IN PROGRESS

# Angular Highcharts

An AngularJS directive for creating Hightcharts charts.

# Usage

## With convenient config options...

```javascript
$scope.chartData = [
  ['foo', 1],
  ['bar', 2],
  ['wowza', 3]
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

*NOTE: The `renderTo` will always be overridden to reference the element the
`hc-chart` directive is attached to.

[Demo](#)

# Tests

_(coming soon)_

# License

[MIT](https://raw.github.com/jtrussell/angular-highcharts/master/LICENSE-MIT)
