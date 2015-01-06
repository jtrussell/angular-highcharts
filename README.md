# !WORK IN PROGRESS

# Angular Highcharts

An AngularJS directive for creating Hightcharts charts.

# Installing

```
bower install --save jtrussell/angular-highcharts
```

# Usage

## Generalized config options

This module aims to be as declarative in nature as possible. Use the `highchart`
directive plus `hc-*` attributes to build your chart.

```html
<div highchart
  hc-title-text="'My Awesome Chart'"
  hc-series[0]-data="[[1,2],[3,4]]"
</div>
```

Strictly speaking the square brackets in `hc-series[0]-data` could get you into
trouble, so they're optional. This is also fine:

```html
<div highchart
  hc-title-text="'My Awesome Chart'"
  hc-series0-data="[[1,2],[3,4]]"
</div>
```

The element attributes are parsed dynamically and converted into a config object
to be passed to the `Highcarts.Chart` constructor. By default none of these
values are watched for changes. Watching these config attributes and
automatically updating the chart as needed is on the roadmap (PRs welcome!).

```html
<div highchart
  hc-title-text="'My Awesome Chart'"
  hc-series[0]-name="'My Data'"
  hc-series[0]-data="myData"
  hc-series[1]-data="myOtherData"
</div>
```

Attributes are converted to config obj properties by stripping away the `hc-`
prefix then using dashes to denote nesting. For example, the above snippet will
create a chart using the following config object:

```javascript
{
  title: {
    text: 'My Awesome Chart'
  },
  series: [{
    name: 'My Data',
    data: myData
  },{
    data: myOtherData
  }],
  chart: {
    renderTo: /* always the element the directive is attached to */
  }
}
```

## Default Options

Use `hcOptionsProvider` provider to set default options for charts in your app:

```javascript
angular.module('myApp').config(function(hcOptionsProvider) {
  hcOptionsProvider.set({
    credits: {
      enabled: false
    }
  });
});
```

## Extras

### Promises Promises

Often you'll want a reference to your chart in a controller or elsewhere. Use
the `highchart-deferred` attribute to provide a deferred object which this
directive will resolve to your chart object when it's ready:


```javascript
// E.g. In your controller
$scope.chartDeferred = $q.defer();

var chartPromise = $scope.chartDeferred.promise;
chartPromise.then(function(chart) {
  // Hooray the chart object!
});
```

```html
<!-- In your view -->
<div highchart highchart-deferred="chartDeferred"
  hc-series[0]-name="'Awesome'"
  hc-series[0]-data="[[1,2],[3,4]]"></div>
```

### Requesting a Resize

Highcharts charts need to be manually reflowed whenever their containers change
size. This directive will reflow charts whenever `'event_hcReflow'` event is
detected. So rather than worrying about all the charts you may have affected
just `$scope.$broadcast('event_hcReflow')`.


# Tests

Tests are run with grunt and karma. For a single test run make sure you have
grunt installed globally, checkout this repo and run:

```
npm install
npm test
```

To run tests continuously during development you'll need karma installed
globally, then run:

```
karma start karma.config.js
```

# License

[MIT](https://raw.github.com/jtrussell/angular-highcharts/master/LICENSE-MIT)
