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

    $scope.bindOptionsMap = {};
    $scope.buyBinds = [];

    $scope.hasKeyBindOptionsSaved = function (keyBind) {
        return keyBind in $scope.bindOptionsMap;
    };

    $scope.openKeyBindOptionsModal = function (keyBind) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/mkg-key-bind-options.phtml',
            controller: 'MultiKeyGenKeyBindOptionsCtrl',
            resolve: {
                bindOptions: function () {
                    var bindOptions;
                    if (keyBind in $scope.bindOptionsMap) {
                        bindOptions = $scope.bindOptionsMap[keyBind];
                    } else {
                        bindOptions = new buynds.BindOptions();
                        bindOptions.keyToBind = keyBind;
                    }
                    return bindOptions;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (result instanceof buynds.BindOptions) {
                $scope.bindOptionsMap[result.keyToBind] = result;
            } else if (result.hasOwnProperty('clear')) {
                delete $scope.bindOptionsMap[result.clear]
            }
        });
    };

    $scope.generateBinds = function () {
        $scope.buyBinds = [];
        for (var keyBind in $scope.bindOptionsMap) {
            var bindOptions = $scope.bindOptionsMap[keyBind];
            var buyBind = bindBuilder.build(bindOptions);
            $scope.buyBinds.push(buyBind);
        }
    };

    $scope.resetBinds = function () {
        $scope.bindOptionsMap = {};
        $scope.buyBinds = [];
    };

    $scope.getBuyBindsForCopy = function() {
        var buyBindsForCopy = '';
        for (var i = 0 ; i < $scope.buyBinds.length; i++) {
            buyBindsForCopy = buyBindsForCopy + $scope.buyBinds[i] + '\n';
        }
        return buyBindsForCopy.trim();
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

    $scope.clear = function () {
        $modalInstance.close({ 'clear': $scope.bindOptions.keyToBind });
    };
}]);
