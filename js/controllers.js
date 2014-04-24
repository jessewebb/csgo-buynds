'use strict';

var buyndsControllers = angular.module('buyndsControllers', []);

buyndsControllers.controller('SingleKeyGenCtrl', ['$scope', 'bindBuilder', 'dataService', function ($scope, bindBuilder, dataService) {

    dataService.getBindableKeysAsync().then(function(data) {
        $scope.bindableKeys = data;
    });
    dataService.getPrimaryWeaponsAsync().then(function(data) {
        $scope.primaryWeapons = data;
    });
    dataService.getSecondaryWeaponsAsync().then(function(data) {
        $scope.secondaryWeapons = data;
    });
    dataService.getGearAsync().then(function(data) {
        $scope.gear = data;
    });
    dataService.getGrenadesAsync().then(function(data) {
        $scope.grenades = data;
    });

    $scope.bindOptions = new buynds.BindOptions();
    $scope.buyBind = '';
    $scope.submitted = false;

    $scope.toggleGearSelection = function (gearBind) {
        var idx = $scope.bindOptions.gear.indexOf(gearBind);
        if (idx > -1) {
            $scope.bindOptions.gear.splice(idx, 1);
        } else {
            $scope.bindOptions.gear.push(gearBind);
        }
    };

    $scope.toggleGrenadeSelection = function (grenadeBind) {
        var idx = $scope.bindOptions.grenades.indexOf(grenadeBind);
        if (idx > -1) {
            $scope.bindOptions.grenades.splice(idx, 1);
        } else {
            $scope.bindOptions.grenades.push(grenadeBind);
        }
    };

    $scope.generateBind = function (bindOptions) {
        $scope.submitted = true;
        if ($scope.skgForm.$valid) {
            $scope.buyBind = bindBuilder.build(bindOptions);
        }
    };

    $scope.resetBind = function () {
        $scope.bindOptions = new buynds.BindOptions();
        $scope.buyBind = '';
        $scope.submitted = false;
    };
}]);

buyndsControllers.controller('MultiKeyGenCtrl', ['$scope', '$modal', 'bindBuilder', function ($scope, $modal, bindBuilder) {

    $scope.bindOptionsList = [];
    $scope.buyBinds = [];

    $scope.openKeyBindOptionsModal = function (keyBind) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/mkg-key-bind-options.phtml',
            controller: 'MultiKeyGenKeyBindOptionsCtrl',
            resolve: {
                bindOptions: function () {
                    var bindOptions = new buynds.BindOptions();
                    bindOptions.keyToBind = keyBind;
                    return bindOptions;
                }
            }
        });

        modalInstance.result.then(function (bindOptions) {
            $scope.bindOptionsList.push(bindOptions);
        });
    };

    $scope.generateBinds = function () {
        $scope.bindOptionsList.forEach(function (bindOptions) {
            var buyBind = bindBuilder.build(bindOptions);
            $scope.buyBinds.push(buyBind);
        });
    };

    $scope.resetBinds = function () {
        $scope.bindOptionsList = [];
        $scope.buyBinds = [];
    };
}]);

buyndsControllers.controller('MultiKeyGenKeyBindOptionsCtrl', ['$scope', '$modalInstance', 'bindOptions', 'dataService', function ($scope, $modalInstance, bindOptions, dataService) {

    dataService.getPrimaryWeaponsAsync().then(function(data) {
        $scope.primaryWeapons = data;
    });
    dataService.getSecondaryWeaponsAsync().then(function(data) {
        $scope.secondaryWeapons = data;
    });
    dataService.getGearAsync().then(function(data) {
        $scope.gear = data;
    });
    dataService.getGrenadesAsync().then(function(data) {
        $scope.grenades = data;
    });

    $scope.bindOptions = bindOptions;

    $scope.toggleGearSelection = function (gearBind) {
        var idx = $scope.bindOptions.gear.indexOf(gearBind);
        if (idx > -1) {
            $scope.bindOptions.gear.splice(idx, 1);
        } else {
            $scope.bindOptions.gear.push(gearBind);
        }
    };

    $scope.toggleGrenadeSelection = function (grenadeBind) {
        var idx = $scope.bindOptions.grenades.indexOf(grenadeBind);
        if (idx > -1) {
            $scope.bindOptions.grenades.splice(idx, 1);
        } else {
            $scope.bindOptions.grenades.push(grenadeBind);
        }
    };

    $scope.save = function () {
        $modalInstance.close($scope.bindOptions);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
