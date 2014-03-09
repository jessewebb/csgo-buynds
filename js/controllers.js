'use strict';

var buyndsControllers = angular.module('buyndsControllers', []);

buyndsControllers.controller('SingleKeyGenCtrl', ['$scope', '$http', 'bindBuilder', function ($scope, $http, bindBuilder) {
    $http.get('data/bindable-keys.json').success(function (data) {
        $scope.bindableKeys = data;
    });

    $http.get('data/primary-weapons.json').success(function (data) {
        $scope.primaryWeapons = data;
    });

    $http.get('data/secondary-weapons.json').success(function (data) {
        $scope.secondaryWeapons = data;
    });

    $scope.buyBind = '';
    $scope.submitted = false;

    $scope.generateBind = function (bindOptions) {
        $scope.submitted = true;
        if ($scope.skgForm.$valid) {
            $scope.buyBind = bindBuilder.build(bindOptions);
        }
    };

    $scope.resetBind = function () {
        $scope.buyBind = '';
        $scope.submitted = false;
    };
}]);

buyndsControllers.controller('MultiKeyGenCtrl', ['$scope', function ($scope) {
}]);
