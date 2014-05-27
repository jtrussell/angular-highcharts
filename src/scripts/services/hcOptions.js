/*global angular */

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
