'use strict';

var buyndsApp = angular.module('buyndsApp', [
    'ngRoute',
    'ui.bootstrap',
    'ngClipboard',
    'buyndsControllers',
    'buyndsDirectives',
    'buyndsFilters',
    'buyndsServices'
]);

buyndsApp.config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("vendor/zeroclipboard-1.3.5/ZeroClipboard.swf");
}]);

buyndsApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'MultiKeyGenCtrl',
        templateUrl: 'partials/multi-key-generator.phtml',
        title: 'Multi-Key Generator'
    });
    $routeProvider.when('/skg', {
        controller: 'SingleKeyGenCtrl',
        templateUrl: 'partials/single-key-generator.phtml',
        title: 'Single-Key Generator'
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);

buyndsApp.run(['$rootScope', '$route', '$window', function ($rootScope, $route, $window) {
    $rootScope.$on("$routeChangeSuccess", function(){
        $rootScope.title = $route.current.title;
        $window.ga('send', 'screenview', { 'screenName': $route.current.title });
    });
}]);
