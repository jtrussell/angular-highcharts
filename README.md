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

The element attributes are parsed dynamically and converted into a config object
to be passed to the `Highcarts.Chart` constructor. By default none of these
values are watched for changes. If you'd like a particular attribute to be
watched use `hc-watch-*` instead of `hc-*`.

```html
<!-- 
  The hc-watch-* causes the 0th series data object to $watched for changes.
-->
<div highchart
  hc-title-text="'My Awesome Chart'"
  hc-series[0]-data="myData"
  hc-series[1]-data="myOtherData"
</div>
```

Attributes are converted to config obj properties by stripping away the `hc-[static-]`
prefix then using dashes to denote nesting, for example:

`hc-series[0]-data="myData"`

Becomes:

```javascript
{
  series: [{
    data: myData
  ]]
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

# Tests

Tests are run with grunt and karma. For a single test run make sure you have grunt
installed globally, checkout this repo and run:

```
npm install
npm test
```

To run tests continuously during development you'll need karma installed globally,
then run:

```
karma start karma.config.js
```

# License

[MIT](https://raw.github.com/jtrussell/angular-highcharts/master/LICENSE-MIT)
