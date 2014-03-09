'use strict';

var buyndsDirectives = angular.module('buyndsDirectives', []);

buyndsDirectives.directive('appVersion', ['version', function (version) {
    return function (scope, element) {
        element.text(version);
    };
}]);

buyndsDirectives.directive('activeClass', ['$location', function($location) {
    return function (scope, element, attrs) {
        var clazz = attrs.activeClass;
        var linkElement = element.children().eq(0); // assume 'a' element is first child
        var linkHref = linkElement.attr('href');
        linkHref = linkHref.substring(1); // remove leading hash character
        scope.location = $location;
        scope.$watch('location.path()', function(newPath) {
            if (linkHref === newPath) {
                element.addClass(clazz);
            } else {
                element.removeClass(clazz);
            }
        });
    };
}]);
