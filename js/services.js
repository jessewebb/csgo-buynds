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

// http://stackoverflow.com/a/12513509/346561
buyndsServices.factory('dataService', ['$http', function ($http) {
    var bindableKeysDataPromise;
    var primaryWeaponsDataPromise;

    var dataService = {
        getBindableKeysAsync: function() {
            if (!bindableKeysDataPromise) {
                // $http.get() returns a promise, which has a then function, which also returns a promise
                bindableKeysDataPromise = $http.get('data/bindable-keys.json').then(function (response) {
                    // The return value gets picked up by the then in the controller.
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
        }
    };

    return dataService;
}]);
