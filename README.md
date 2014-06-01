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
to be passed to the `Highcarts.Chart` constructor. Variable values are watched
for changes while literals are not explicitly watched. You may also use the attribute
prefix `hc-static-*` to block watching:

```html
<!-- 
  The hc-static-* forces the the series object to not be watched
  even though it is a variable.
  
  hc-title-text has a string literal value and will not be watched
  for changes automatically.
  
  The hc-series[1]-data value myOtherData will be watched for changes.
-->
<div highchart
  hc-title-text="'My Awesome Chart'"
  hc-static-series[0]-data="myData"
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

_(coming soon)_

# License

[MIT](https://raw.github.com/jtrussell/angular-highcharts/master/LICENSE-MIT)
