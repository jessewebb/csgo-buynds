'use strict';

// csgo-buynds angular services

var buyndsServices = angular.module('buyndsServices', []);

buyndsServices.value('version', '1.0.0-dev');

buyndsServices.factory('bindBuilder', function () {
    return new buynds.BindBuilder();
});

buyndsServices.factory('bindLoaderAsync', ['$q', 'dataService', function ($q, dataService) {
    var bindLoaderAsync = $q.defer();
    var dataPromises = [];
    dataPromises.push(dataService.getPrimaryWeaponsAsync());
    dataPromises.push(dataService.getSecondaryWeaponsAsync());
    dataPromises.push(dataService.getGearAsync());
    dataPromises.push(dataService.getGrenadesAsync());
    $q.all(dataPromises).then(function(values) {
        var primaryWeapons = values[0];
        var secondaryWeapons = values[1];
        var gear = values[2];
        var grenades = values[3];
        var bindLoader = new buynds.BindLoader(primaryWeapons, secondaryWeapons, gear, grenades);
        bindLoaderAsync.resolve(bindLoader);
    });
    return bindLoaderAsync.promise;
}]);

buyndsServices.factory('bindRepository', ['$window', function ($window) {
    var bindStorage = $window.localStorage;
    return new buynds.BindRepository(bindStorage);
}]);

buyndsServices.factory('totalPriceCalculatorAsync', ['$q', 'dataService', function ($q, dataService) {
    var bindOptionsTotalPriceCalculatorAsync = $q.defer();
    var dataPromises = [];
    dataPromises.push(dataService.getPrimaryWeaponsAsync());
    dataPromises.push(dataService.getSecondaryWeaponsAsync());
    dataPromises.push(dataService.getGearAsync());
    dataPromises.push(dataService.getGrenadesAsync());
    $q.all(dataPromises).then(function(values) {
        var primaryWeapons = values[0];
        var secondaryWeapons = values[1];
        var gear = values[2];
        var grenades = values[3];
        var calculator = new buynds.TotalPriceCalculator(primaryWeapons, secondaryWeapons, gear, grenades);
        bindOptionsTotalPriceCalculatorAsync.resolve(calculator);
    });
    return bindOptionsTotalPriceCalculatorAsync.promise;
}]);

buyndsServices.factory('itemImageServiceAsync', ['$q', 'dataService', function ($q, dataService) {
    var itemImageServiceAsync = $q.defer();
    var dataPromises = [];
    dataPromises.push(dataService.getItemImagesAsync());
    dataPromises.push(dataService.getPrimaryWeaponsAsync());
    dataPromises.push(dataService.getSecondaryWeaponsAsync());
    dataPromises.push(dataService.getGearAsync());
    dataPromises.push(dataService.getGrenadesAsync());
    $q.all(dataPromises).then(function(values) {
        var itemImages = values[0];
        var primaryWeapons = values[1];
        var secondaryWeapons = values[2];
        var gear = values[3];
        var grenades = values[4];
        var itemImageService = new buynds.ItemImageService(itemImages, primaryWeapons, secondaryWeapons, gear, grenades);
        itemImageServiceAsync.resolve(itemImageService);
    });
    return itemImageServiceAsync.promise;
}]);

buyndsServices.factory('dataService', ['$http', 'version', function ($http, version) {
    var bindPresetsDataPromise;
    var bindableKeysDataPromise;
    var primaryWeaponsDataPromise;
    var secondaryWeaponsDataPromise;
    var gearDataPromise;
    var grenadesDataPromise;
    var itemImagesDataPromise;

    var versionUrlParam = 'v=' + version;

    return {
        getBindPresetsAsync: function() {
            if (!bindPresetsDataPromise) {
                var url = 'data/bind-presets.json?' + versionUrlParam;
                bindPresetsDataPromise = $http.get(url).then(function (response) {
                    return response.data;
                });
            }
            return bindPresetsDataPromise;
        },

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
        },

        getItemImagesAsync: function() {
            if (!itemImagesDataPromise) {
                var url = 'data/item-images.json?' + versionUrlParam;
                itemImagesDataPromise = $http.get(url).then(function (response) {
                    return response.data;
                });
            }
            return itemImagesDataPromise;
        }
    };
}]);
