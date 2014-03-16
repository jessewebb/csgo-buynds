'use strict';

var buyndsServices = angular.module('buyndsServices', []);

buyndsServices.value('version', '0.2');

buyndsServices.service('bindBuilder', function () {
    this.build = function (bindOptions) {
        var bindString = 'bind "' + bindOptions.keyToBind + '" "';

        if (bindOptions.primaryWeapon) {
            var primaryWeaponsArray = bindOptions.primaryWeapon.split(",");
            primaryWeaponsArray.forEach(function (weapon) {
                bindString += 'buy ' + weapon + '; ';
            });
        }

        if (bindOptions.secondaryWeapon) {
            var secondaryWeaponsArray = bindOptions.secondaryWeapon.split(",");
            for (var i = 0; i < secondaryWeaponsArray.length; i++) {
                bindString += 'buy ' + secondaryWeaponsArray[i] + '; ';
            }
        }

        if (bindOptions.gear) {
            bindOptions.gear.forEach(function (gearItem) {
                bindString += 'buy ' + gearItem + '; ';
            });
        }

        bindString += 'buy incgrenade; buy molotov;';
        bindString += '"';
        return bindString;
    };
});

buyndsServices.factory('dataService', ['$http', function ($http) {
    var bindableKeysDataPromise;
    var primaryWeaponsDataPromise;
    var secondaryWeaponsDataPromise;
    var gearDataPromise;

    return {
        getBindableKeysAsync: function() {
            if (!bindableKeysDataPromise) {
                bindableKeysDataPromise = $http.get('data/bindable-keys.json').then(function (response) {
                    return response.data;
                });
            }
            return bindableKeysDataPromise;
        },

        getPrimaryWeaponsAsync: function() {
            if (!primaryWeaponsDataPromise) {
                primaryWeaponsDataPromise = $http.get('data/primary-weapons.json').then(function (response) {
                    return response.data;
                });
            }
            return primaryWeaponsDataPromise;
        },

        getSecondaryWeaponsAsync: function() {
            if (!secondaryWeaponsDataPromise) {
                secondaryWeaponsDataPromise = $http.get('data/secondary-weapons.json').then(function (response) {
                    return response.data;
                });
            }
            return secondaryWeaponsDataPromise;
        },

        getGearAsync: function() {
            if (!gearDataPromise) {
                gearDataPromise = $http.get('data/gear.json').then(function (response) {
                    return response.data;
                });
            }
            return gearDataPromise;
        }
    };
}]);
