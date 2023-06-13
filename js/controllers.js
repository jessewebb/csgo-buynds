'use strict';

// csgo-buynds angular controllers

var buyndsControllers = angular.module('buyndsControllers', []);

buyndsControllers.controller('SingleKeyGenCtrl', ['$scope', '$route', '$window', 'bindBuilder', 'dataService', 'itemImageServiceAsync', 'totalPriceCalculatorAsync', function ($scope, $route, $window, bindBuilder, dataService, itemImageServiceAsync, totalPriceCalculatorAsync) {

    $scope.game = 'csgo';

    var itemImageService = null;
    itemImageServiceAsync.then(function(resolvedItemImageService) {
        itemImageService = resolvedItemImageService;
    });

    var totalPriceCalculator = null;
    totalPriceCalculatorAsync.then(function(resolvedTotalPriceCalculator) {
        totalPriceCalculator = resolvedTotalPriceCalculator;
    });

    $scope.bindableKeys = [];
    dataService.getBindableKeysAsync().then(function(data) {
        var bindableKeys = [];
        for (var i = 0; i < data.keyGroups.length; i++) {
            var keyGroup = data.keyGroups[i];
            for (var j = 0; j < keyGroup.keys.length; j++) {
                var key = keyGroup.keys[j];
                if (!key.spacer && !key.disabled) {
                    key.keyGroup = keyGroup.name;
                    bindableKeys.push(key);
                }
            }
        }
        $scope.bindableKeys = bindableKeys;
    });
    $scope.primaryWeapons = [];
    dataService.getPrimaryWeaponsAsync().then(function(data) {
        var primaryWeapons = [];
        for (var i = 0; i < data.weaponGroups.length; i++) {
            var weaponGroup = data.weaponGroups[i];
            for (var j = 0; j < weaponGroup.weapons.length; j++) {
                var weapon = weaponGroup.weapons[j];
                weapon.weaponGroup = weaponGroup.name;
                primaryWeapons.push(weapon);
            }
        }
        $scope.primaryWeapons = primaryWeapons;
    });
    $scope.secondaryWeapons = [];
    dataService.getSecondaryWeaponsAsync().then(function(data) {
        var secondaryWeapons = [];
        for (var i = 0; i < data.weaponGroups.length; i++) {
            var weaponGroup = data.weaponGroups[i];
            for (var j = 0; j < weaponGroup.weapons.length; j++) {
                var weapon = weaponGroup.weapons[j];
                weapon.weaponGroup = weaponGroup.name;
                secondaryWeapons.push(weapon);
            }
        }
        $scope.secondaryWeapons = secondaryWeapons;
    });
    $scope.gear = [];
    dataService.getGearAsync().then(function(data) {
        $scope.gear = data;
    });
    $scope.grenades = [];
    dataService.getGrenadesAsync().then(function(data) {
        $scope.grenades = data;
    });

    $scope.bindOptions = new buynds.BindOptions();
    $scope.buyBind = '';
    $scope.submitted = false;

    var findBindableKeyByCode = function (keyCode) {
        for (var i = 0; i < $scope.bindableKeys.length; i++) {
            var key = $scope.bindableKeys[i];
            if (key.code === keyCode) {
                return key;
            }
        }
        return null;
    };

    var findBindableKeyByName = function (keyName, game = "") {
        for (var i = 0; i < $scope.bindableKeys.length; i++) {
            var key = $scope.bindableKeys[i];
            if (game == "csgo" && key.bind === keyName) return key
            else if (game == "cs2" && key.cs2bind === keyName) return key
            else if (game == "" ** (key.bind === keyName || key.cs2bind === keyName)) return key
        }
        return null;
    }

    $scope.setKeyToBindByCode = function (keyCode) {
        var bindableKey = findBindableKeyByCode(keyCode);
        if (bindableKey === null) {
            $window.alert('Unrecognized Key! (keyCode = ' + keyCode + ')');
        } else {
            $scope.bindOptions.keyToBind = bindableKey.bind;
            $scope.bindOptions.keyCodeToBind = keyCode;
        }
    };

    $scope.getItemTooltipImage = function (item, itemType) {
        if (!itemImageService) return null;
        return itemImageService.getItemImage(item.bind, itemType, itemImageService.IMG_TYPE_COLOR_3D);
    };

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

    $scope.allowExtraGrenade = function (grenadeBind) {
        return grenadeBind === 'flashbang';
    };

    $scope.hasExtraGrenadeSelection = function (grenadeBind) {
        var grenadeCount = $.grep($scope.bindOptions.grenades, function (g) { return g === grenadeBind }).length;
        return grenadeCount > 1;
    };

    $scope.toggleExtraGrenadeSelection = function (grenadeBind) {
        var grenadeCount = $.grep($scope.bindOptions.grenades, function (g) { return g === grenadeBind }).length;
        if (grenadeCount === 2) {
            var idx = $scope.bindOptions.grenades.lastIndexOf(grenadeBind);
            $scope.bindOptions.grenades.splice(idx, 1);
        } else if (grenadeCount === 1) {
            $scope.bindOptions.grenades.push(grenadeBind);
        } else {
            $scope.bindOptions.grenades.push(grenadeBind, grenadeBind);
        }
    };

    $scope.totalPrice = function () {
        if (!totalPriceCalculator) {
            return new buynds.BindOptionsTotalPrice(0, 0);
        }
        return totalPriceCalculator.calculateTotalPrice($scope.bindOptions);
    };

    $scope.generateBind = function () {
        $window.ga('send', 'event', 'button', 'click', 'generate', { page: $route.current.page });
        $scope.submitted = true;
        if ($scope.skgForm.$valid) {
            $scope.buyBind = bindBuilder.build($scope.bindOptions);
            $window.ga('send', 'event', 'bind builder', 'build', 'key bind', 1, { page: $route.current.page });
        }
    };

    $scope.resetBind = function () {
        $window.ga('send', 'event', 'button', 'click', 'reset', { page: $route.current.page });
        $scope.bindOptions = new buynds.BindOptions();
        $scope.buyBind = '';
        $scope.submitted = false;
        $scope.game = "csgo";
    };

    $scope.getBuyBindForCopy = function () {
        $window.ga('send', 'event', 'button', 'click', 'copy', { page: $route.current.page });
        return $scope.buyBind;
    };

    $scope.UpdateSelection = function () {
        if($scope.bindOptions.keyToBind) $scope.bindOptions.keyToBind = $scope.game == "csgo" ? findBindableKeyByName($scope.bindOptions.keyToBind).bind : findBindableKeyByName($scope.bindOptions.keyToBind).cs2bind;
    };
}]);

buyndsControllers.controller('MultiKeyGenCtrl', ['$scope', '$uibModal', '$route', '$window', 'bindBuilder', 'bindLoaderAsync', 'dataService', 'itemImageServiceAsync', function ($scope, $uibModal, $route, $window, bindBuilder, bindLoaderAsync, dataService, itemImageServiceAsync) {

    var bindLoader;
    bindLoaderAsync.then(function(resolvedBindLoader) {
        bindLoader = resolvedBindLoader;
    });

    $scope.bindableKeys = {keyGroups: []};
    dataService.getBindableKeysAsync().then(function(data) {
        $scope.bindableKeys = data;
    });

    var itemImageService = null;
    itemImageServiceAsync.then(function(resolvedItemImageService) {
        itemImageService = resolvedItemImageService;
    });

    $scope.bindOptionsMap = {};
    $scope.buyBinds = [];
    $scope.showNumpadKeypad = true;
    $scope.showNavKeysKeypad = false;
    $scope.showFuncKeysKeypad = false;
    $scope.showMouseButtons = false;
    $scope.autoGenerateBinds = false;
    $scope.loadedBindsId = null;
    $scope.loadedBindsName = null;

    $scope.generatedBuyBindsComment = '// buy binds generated by csgobuynds.com';

    $scope.hasAnyBindOptions = function () {
        return !jQuery.isEmptyObject($scope.bindOptionsMap);
    };

    $scope.hasKeyBindOptions = function (keyCode) {
        return keyCode in $scope.bindOptionsMap;
    };

    var getKeyGroupKeysByName = function (keyGroupName) {
        for (var i = 0; i < $scope.bindableKeys.keyGroups.length; i++) {
            var keyGroup = $scope.bindableKeys.keyGroups[i];
            if (keyGroup.name === keyGroupName) {
                return keyGroup.keys;
            }
        }
        return [];
    };

    $scope.getNumericKeypadKeys = function () {
        return getKeyGroupKeysByName('Numeric Keypad');
    };

    $scope.getNavigationKeys = function () {
        return getKeyGroupKeysByName('Navigation Keys');
    };

    $scope.getFunctionKeys = function () {
        return getKeyGroupKeysByName('Function Keys');
    };

    $scope.getMouseButtonKeys = function () {
        return getKeyGroupKeysByName('Mouse Buttons');
    };

    var hasKeyGroupKeypadKeyBindOptions = function (keyGroupName) {
        var keys = getKeyGroupKeysByName(keyGroupName);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.code in $scope.bindOptionsMap) {
                return true;
            }
        }
        return false;
    };

    $scope.hasNumpadKeypadKeyBindOptions = function () {
        return hasKeyGroupKeypadKeyBindOptions('Numeric Keypad');
    };

    $scope.hasNavKeysKeypadKeyBindOptions = function () {
        return hasKeyGroupKeypadKeyBindOptions('Navigation Keys');
    };

    $scope.hasFuncKeysKeypadKeyBindOptions = function () {
        return hasKeyGroupKeypadKeyBindOptions('Function Keys');
    };

    $scope.hasMouseButtonsKeyBindOptions = function () {
        return hasKeyGroupKeypadKeyBindOptions('Mouse Buttons');
    };

    $scope.hasGeneratedBuyBinds = function() {
        return $scope.buyBinds.length > 0;
    };

    $scope.getBindOptionsItemImagesForKey = function(key) {
        if (!itemImageService) return [];
        if (!(key.code in $scope.bindOptionsMap)) return [];
        var bindOptions = $scope.bindOptionsMap[key.code];
        return itemImageService.getItemImages(bindOptions, itemImageService.IMG_TYPE_WHITE_ICON);
    };

    $scope.isItemImageForSpecificTeam = function(image, team) {
        if (!image.itemBind) {
            return false;
        }
        return image.itemTeam === team;
    };

    var generateBinds = function () {
        var numBindsGenerated = 0;
        $scope.buyBinds = [];
        for (var keyCode in $scope.bindOptionsMap) {
            if ($scope.bindOptionsMap.hasOwnProperty(keyCode)) {
                var bindOptions = $scope.bindOptionsMap[keyCode];
                var buyBind = bindBuilder.build(bindOptions);
                $scope.buyBinds.push(buyBind);
                numBindsGenerated++;
            }
        }
        $window.ga('send', 'event', 'bind builder', 'build', 'key bind', numBindsGenerated, { page: $route.current.page });
    };

    $scope.openKeyBindOptionsModal = function (key) {
        var keyBind = $scope.game == 'csgo' ? key.bind : key.cs2bind;
        var modalInstance = $uibModal.open({
            templateUrl: 'partials/mkg-key-bind-options.html',
            controller: 'MultiKeyGenKeyBindOptionsCtrl',
            resolve: {
                bindOptions: function () {
                    var bindOptions;
                    if (key.code in $scope.bindOptionsMap) {
                        bindOptions = $scope.bindOptionsMap[key.code].clone();
                    } else {
                        bindOptions = new buynds.BindOptions();
                        bindOptions.keyToBind = keyBind;
                        bindOptions.keyCodeToBind = key.code;
                    }
                    return bindOptions;
                }
            }
        });

        modalInstance.result.then(function (result) {
            // Success
            if (result instanceof buynds.BindOptions) {
                $scope.bindOptionsMap[result.keyCodeToBind] = result.clone();
            } else if (result.hasOwnProperty('clear')) {
                delete $scope.bindOptionsMap[result.clear]
            }
            if ($scope.autoGenerateBinds) {
                generateBinds();
            }
        }, function () {
            // Cancel
        });
    };

    $scope.generateBinds = function () {
        $window.ga('send', 'event', 'button', 'click', 'generate', { page: $route.current.page });
        generateBinds();
    };

    $scope.resetBinds = function () {
        $window.ga('send', 'event', 'button', 'click', 'reset', { page: $route.current.page });
        $scope.bindOptionsMap = {};
        $scope.buyBinds = [];
        $scope.showNumpadKeypad = true;
        $scope.showNavKeysKeypad = false;
        $scope.showFuncKeysKeypad = false;
        $scope.showMouseButtons = false;
        $scope.loadedBindsId = null;
        $scope.loadedBindsName = null;
        $scope.game = 'csgo';
    };

    $scope.toggleAutoGenerateBinds = function () {
        $scope.autoGenerateBinds = !$scope.autoGenerateBinds;
        if ($scope.autoGenerateBinds) {
            generateBinds();
        }
    };

    $scope.openLoadBindsModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'partials/mkg-load-binds.html',
            controller: 'MultiKeyGenLoadBindsCtrl'
        });

        modalInstance.result.then(function (bindRecord) {
            // Success
            if (bindRecord) {
                if (!bindRecord.id.startsWith("preset")) {
                    $scope.loadedBindsId = bindRecord.id;
                }

                $scope.loadedBindsName = bindRecord.name;
                if (bindRecord.id.startsWith("preset")) {
                    $scope.loadedBindsName = "Copy of " + $scope.loadedBindsName;
                }

                var numBindsLoaded = 0;
                $scope.bindOptionsMap = {};
                var bindStrings = bindRecord.bindString.split('\n');
                for (var i = 0; i < bindStrings.length; i++) {
                    var bindOptions = bindLoader.load(bindStrings[i]);
                    $scope.bindOptionsMap[bindOptions.keyCodeToBind] = bindOptions;
                    numBindsLoaded++;
                }
                $scope.buyBinds = bindStrings;
                $window.ga('send', 'event', 'bind loader', 'load', 'key bind', numBindsLoaded, { page: $route.current.page });

                $scope.showNumpadKeypad = $scope.hasNumpadKeypadKeyBindOptions();
                $scope.showNavKeysKeypad = $scope.hasNavKeysKeypadKeyBindOptions();
                $scope.showFuncKeysKeypad = $scope.hasFuncKeysKeypadKeyBindOptions();
                $scope.showMouseButtons = $scope.hasMouseButtonsKeyBindOptions();
            }
        }, function () {
            // Cancel
        });
    };

    $scope.openSaveBindsModal = function (buyBinds) {
        var args = {
            buyBinds: function () {
                return buyBinds;
            },
            loadedBindsId: function () {
                return $scope.loadedBindsId;
            },
            loadedBindsName: function () {
                return $scope.loadedBindsName;
            }
        };
        var modalInstance = $uibModal.open({
            templateUrl: 'partials/mkg-save-binds.html',
            controller: 'MultiKeyGenSaveBindsCtrl',
            resolve: args
        });
        modalInstance.result.then(function (bindRecord) {
            // Success
            if (bindRecord) {
                $scope.loadedBindsId = bindRecord.id;
                $scope.loadedBindsName = bindRecord.name;
            }
        }, function () {
            // Cancel
        });
    };

    var getBuyBindsWithNewlines = function () {
        var buyBindsForCopy = '';
        for (var i = 0 ; i < $scope.buyBinds.length; i++) {
            buyBindsForCopy = buyBindsForCopy + $scope.buyBinds[i] + '\n';
        }
        return buyBindsForCopy.trim();
    };

    $scope.getBuyBindsForCopy = function () {
        $window.ga('send', 'event', 'button', 'click', 'copy', { page: $route.current.page });
        var buyBindsForCopy = $scope.generatedBuyBindsComment + '\n';
        buyBindsForCopy = buyBindsForCopy + getBuyBindsWithNewlines() + '\n';
        return buyBindsForCopy;
    };

    $scope.getBuyBindsForSave = function () {
        return getBuyBindsWithNewlines();
    };

    $scope.UpdateGame = function() {
        for(var keyCode in $scope.bindOptionsMap) {
            var key = findBindableKeyByCode(keyCode)
            $scope.bindOptionsMap[keyCode].keyToBind = $scope.game == "csgo" ? key.bind : key.cs2bind;
        }
        if($scope.autoGenerateBinds) $scope.generateBinds();
    };

    var findBindableKeyByCode = function (keyCode) {
        for(var keyGroup of $scope.bindableKeys.keyGroups) {
            for(var key of keyGroup.keys) {
                if(key.code == keyCode) {
                    return key;
                }
            }
        }
        return null;
    };
}]);

buyndsControllers.controller('MultiKeyGenKeyBindOptionsCtrl', ['$scope', '$uibModalInstance', 'bindOptions', 'dataService', 'itemImageServiceAsync', 'totalPriceCalculatorAsync', function ($scope, $uibModalInstance, bindOptions, dataService, itemImageServiceAsync, totalPriceCalculatorAsync) {

    var itemImageService = null;
    itemImageServiceAsync.then(function(resolvedItemImageService) {
        itemImageService = resolvedItemImageService;
    });

    var totalPriceCalculator = null;
    totalPriceCalculatorAsync.then(function(resolvedTotalPriceCalculator) {
        totalPriceCalculator = resolvedTotalPriceCalculator;
    });

    $scope.primaryWeapons = [];
    dataService.getPrimaryWeaponsAsync().then(function(data) {
        var primaryWeapons = [];
        for (var i = 0; i < data.weaponGroups.length; i++) {
            var weaponGroup = data.weaponGroups[i];
            for (var j = 0; j < weaponGroup.weapons.length; j++) {
                var weapon = weaponGroup.weapons[j];
                weapon.weaponGroup = weaponGroup.name;
                primaryWeapons.push(weapon);
            }
        }
        $scope.primaryWeapons = primaryWeapons;
    });
    $scope.secondaryWeapons = [];
    dataService.getSecondaryWeaponsAsync().then(function(data) {
        var secondaryWeapons = [];
        for (var i = 0; i < data.weaponGroups.length; i++) {
            var weaponGroup = data.weaponGroups[i];
            for (var j = 0; j < weaponGroup.weapons.length; j++) {
                var weapon = weaponGroup.weapons[j];
                weapon.weaponGroup = weaponGroup.name;
                secondaryWeapons.push(weapon);
            }
        }
        $scope.secondaryWeapons = secondaryWeapons;
    });
    $scope.gear = [];
    dataService.getGearAsync().then(function(data) {
        $scope.gear = data;
    });
    $scope.grenades = [];
    dataService.getGrenadesAsync().then(function(data) {
        $scope.grenades = data;
    });

    $scope.bindOptions = bindOptions;

    $scope.getItemTooltipImage = function (item, itemType) {
        if (!itemImageService) return null;
        return itemImageService.getItemImage(item.bind, itemType, itemImageService.IMG_TYPE_COLOR_3D);
    };

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

    $scope.allowExtraGrenade = function (grenadeBind) {
        return grenadeBind === 'flashbang';
    };

    $scope.hasExtraGrenadeSelection = function (grenadeBind) {
        var grenadeCount = $.grep($scope.bindOptions.grenades, function (g) { return g === grenadeBind }).length;
        return grenadeCount > 1;
    };

    $scope.toggleExtraGrenadeSelection = function (grenadeBind) {
        var grenadeCount = $.grep($scope.bindOptions.grenades, function (g) { return g === grenadeBind }).length;
        if (grenadeCount === 2) {
            var idx = $scope.bindOptions.grenades.lastIndexOf(grenadeBind);
            $scope.bindOptions.grenades.splice(idx, 1);
        } else if (grenadeCount === 1) {
            $scope.bindOptions.grenades.push(grenadeBind);
        } else {
            $scope.bindOptions.grenades.push(grenadeBind, grenadeBind);
        }
    };

    $scope.totalPrice = function () {
        if (!totalPriceCalculator) {
            return new buynds.BindOptionsTotalPrice(0, 0);
        }
        return totalPriceCalculator.calculateTotalPrice($scope.bindOptions);
    };

    $scope.save = function () {
        $uibModalInstance.close($scope.bindOptions);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.clear = function () {
        $uibModalInstance.close({ 'clear': $scope.bindOptions.keyCodeToBind});
    };
}]);

buyndsControllers.controller('MultiKeyGenLoadBindsCtrl', ['$scope', '$uibModalInstance', '$route', '$window', 'bindRepository', 'dataService', function ($scope, $uibModalInstance, $route, $window, bindRepository, dataService) {

    $scope.buyBindsBindPresets = [];
    dataService.getBindPresetsAsync().then(function(data) {
        $scope.buyBindsBindPresets = data;
    });

    $scope.buyBindsSavedBinds = [];
    $scope.buyBindsLoadBindId = '';
    $scope.submitted = false;

    function init() {
        $scope.getSavedBinds();
    }

    $scope.getSavedBinds = function () {
        var savedBinds = bindRepository.all();
        savedBinds.sort(function(a, b) {
            return a.id - b.id;
        });
        $scope.buyBindsSavedBinds = savedBinds;
    };

    $scope.hasSavedBuyBinds = function () {
        return $scope.buyBindsSavedBinds.length > 0;
    };

    $scope.load = function () {
        $window.ga('send', 'event', 'button', 'click', 'load', { page: $route.current.page });
        if ($scope.mkgLoadBindsForm.$valid) {
            var bindId = $scope.buyBindsLoadBindId;
            var bindRecord;
            if (bindId.startsWith("preset")) {
                for (var i = 0; i < $scope.buyBindsBindPresets.length; i++) {
                    if ($scope.buyBindsBindPresets[i].id === bindId) {
                        bindRecord = $scope.buyBindsBindPresets[i];
                        break;
                    }
                }
                $window.ga('send', 'event', 'bind presets', 'load', bindId, { page: $route.current.page });
            } else {
                bindRecord = bindRepository.get(bindId);
                $window.ga('send', 'event', 'bind repo', 'get by id', bindId, { page: $route.current.page });
            }
            $uibModalInstance.close(bindRecord);
        }
    };

    $scope.clear = function () {
        $window.ga('send', 'event', 'button', 'click', 'clear', { page: $route.current.page });
        bindRepository.empty();
        $window.ga('send', 'event', 'bind repo', 'delete all', { page: $route.current.page });
        $scope.getSavedBinds();
        $scope.buyBindsLoadBindId = '';
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    init();
}]);

buyndsControllers.controller('MultiKeyGenSaveBindsCtrl', ['$scope', '$uibModalInstance', '$route', '$window', 'buyBinds', 'bindRepository', 'loadedBindsId', 'loadedBindsName', function ($scope, $uibModalInstance, $route, $window, buyBinds, bindRepository, loadedBindsId, loadedBindsName) {

    // slots are used as IDs and limit the number of saved binds
    $scope.buyBindsSaveSlots = ['1', '2', '3', '4', '5'];

    $scope.buyBindsSavedBinds = [];

    $scope.buyBindsSaveAsName = "";
    $scope.buyBindsSaveInSlot = $scope.buyBindsSaveSlots[0];
    $scope.submitted = false;

    function init() {
        $scope.buyBindsSavedBinds = bindRepository.all();
        $scope.buyBindsSaveAsName = loadedBindsName;
        if (loadedBindsId !== null) {
            $scope.buyBindsSaveInSlot = $scope.buyBindsSaveSlots[$scope.buyBindsSaveSlots.indexOf(loadedBindsId)];
        }
    }

    $scope.slotInUse = function () {
        for (var i = 0; i < $scope.buyBindsSavedBinds.length; i++) {
            if ($scope.buyBindsSaveInSlot === $scope.buyBindsSavedBinds[i].id) {
                return true;
            }
        }
        return false;
    };

    $scope.save = function () {
        $window.ga('send', 'event', 'button', 'click', 'save', { page: $route.current.page });
        $scope.submitted = true;
        if ($scope.mkgSaveBindsForm.$valid) {
            var bindId = $scope.buyBindsSaveInSlot;
            var bindName = $scope.buyBindsSaveAsName;
            var bindRecord = new buynds.BindRecord(bindId, bindName, buyBinds);
            bindRepository.save(bindId, bindRecord);
            $window.ga('send', 'event', 'bind repo', 'save', bindId, { page: $route.current.page });
            $uibModalInstance.close(bindRecord);
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    init();
}]);
