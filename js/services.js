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
