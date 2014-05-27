# !WORK IN PROGRESS

# Angular Highcharts

An AngularJS directive for creating Hightcharts charts.

# Installing

```
bower install --save jtrusell/angular-highcharts
```

# Usage

## Generalized config options

*(hang on... stuff is changing!)*

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
