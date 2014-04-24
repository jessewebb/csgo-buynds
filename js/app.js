'use strict';

var buyndsApp = angular.module('buyndsApp', [
    'ngRoute',
    'ui.bootstrap',
    'buyndsControllers',
    'buyndsDirectives',
    'buyndsFilters',
    'buyndsServices'
]);

buyndsApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'SingleKeyGenCtrl',
        templateUrl: 'partials/single-key-generator.phtml'
    });
    $routeProvider.when('/mkg', {
        controller: 'MultiKeyGenCtrl',
        templateUrl: 'partials/multi-key-generator.phtml'
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);
