'use strict';

// csgo-buynds angular services

var buyndsServices = angular.module('buyndsServices', []);

buyndsServices.value('version', '0.8.1');

buyndsServices.factory('bindBuilder', function () {
    return new buynds.BindBuilder();
});

buyndsServices.factory('dataService', ['$http', 'version', function ($http, version) {
    var bindableKeysDataPromise;
    var primaryWeaponsDataPromise;
    var secondaryWeaponsDataPromise;
    var gearDataPromise;
    var grenadesDataPromise;

    var versionUrlParam = 'v=' + version;

    return {
        getBindableKeysAsync: function() {
            if (!bindableKeysDataPromise) {
                var url = 'data/bindable-keys.json?' + versionUrlParam;
                bindableKeysDataPromise = $http.get(url).then(function (response) {
                    return response.data;
                });
            }
            return bindableKeysDataPromise;
        },

        getPrimaryWeaponsAsync: function() {
            if (!primaryWeaponsDataPromise) {
                var url = 'data/primary-weapons.json?' + versionUrlParam;
                primaryWeaponsDataPromise = $http.get(url).then(function (response) {
                    return response.data;
                });
            }
            return primaryWeaponsDataPromise;
        },

        getSecondaryWeaponsAsync: function() {
            if (!secondaryWeaponsDataPromise) {
                var url = 'data/secondary-weapons.json?' + versionUrlParam;
                secondaryWeaponsDataPromise = $http.get(url).then(function (response) {
                    return response.data;
                });
            }
            return secondaryWeaponsDataPromise;
        },

        getGearAsync: function() {
            if (!gearDataPromise) {
                var url = 'data/gear.json?' + versionUrlParam;
                gearDataPromise = $http.get(url).then(function (response) {
                    return response.data;
                });
            }
            return gearDataPromise;
        },

        getGrenadesAsync: function() {
            if (!grenadesDataPromise) {
                var url = 'data/grenades.json?' + versionUrlParam;
                grenadesDataPromise = $http.get(url).then(function (response) {
                    return response.data;
                });
            }
            return grenadesDataPromise;
        }
    };
}]);
