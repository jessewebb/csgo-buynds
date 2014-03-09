'use strict';

var buyndsServices = angular.module('buyndsServices', []);

buyndsServices.value('version', '0.1');

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

        bindString += 'buy vesthelm; buy vest;';
        bindString += '"';
        return bindString;
    };
});
