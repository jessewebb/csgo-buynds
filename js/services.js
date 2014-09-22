'use strict';

var buyndsServices = angular.module('buyndsServices', []);

buyndsServices.value('version', '0.7');

buyndsServices.factory('bindBuilder', function () {
    return new buynds.BindBuilder();
});

buyndsServices.factory('dataService', ['$http', function ($http) {
    var bindableKeysDataPromise;
    var primaryWeaponsDataPromise;
    var secondaryWeaponsDataPromise;
    var gearDataPromise;
    var grenadesDataPromise;

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
        },

        getGrenadesAsync: function() {
            if (!grenadesDataPromise) {
                grenadesDataPromise = $http.get('data/grenades.json').then(function (response) {
                    return response.data;
                });
            }
            return grenadesDataPromise;
        }
    };
}]);
