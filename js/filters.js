'use strict';

var buyndsFilters = angular.module('buyndsFilters', []);
buyndsFilters.filter('interpolate', ['version', function (version) {
    return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    }
}]);
