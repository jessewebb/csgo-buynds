'use strict';

var buyndsControllers = angular.module('buyndsControllers', []);

buyndsControllers.controller('SingleKeyGenCtrl', ['$scope', '$http', 'bindBuilder', 'dataService', function ($scope, $http, bindBuilder, dataService) {

    dataService.getBindableKeysAsync().then(function(data) {
        $scope.bindableKeys = data;
    });
    dataService.getPrimaryWeaponsAsync().then(function(data) {
        $scope.primaryWeapons = data;
    });

    $http.get('data/secondary-weapons.json').success(function (data) {
        $scope.secondaryWeapons = data;
    });

    $http.get('data/gear.json').success(function (data) {
        $scope.gear = data;
    });

    $scope.bindOptions = new BindOptions();
    $scope.buyBind = '';
    $scope.submitted = false;

    // http://stackoverflow.com/a/14520103/346561
    $scope.toggleGearSelection = function (gearBind) {
        var idx = $scope.bindOptions.gear.indexOf(gearBind);

        // is currently selected
        if (idx > -1) {
            $scope.bindOptions.gear.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.bindOptions.gear.push(gearBind);
        }
    };

    $scope.generateBind = function (bindOptions) {
        $scope.submitted = true;
        if ($scope.skgForm.$valid) {
            $scope.buyBind = bindBuilder.build(bindOptions);
        }
    };

    $scope.resetBind = function () {
        $scope.bindOptions = new BindOptions();
        $scope.buyBind = '';
        $scope.submitted = false;
    };
}]);

buyndsControllers.controller('MultiKeyGenCtrl', ['$scope', function ($scope) {
}]);
