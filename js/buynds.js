'use strict';

(function( buynds, $, undefined ) {
    buynds.BindOptions = function() {
        this.keyToBind = '';
        this.primaryWeapon = '';
        this.secondaryWeapon = '';
        this.gear = [];
        this.grenades = [];
    };

    buynds.BindBuilder = function() {
        this.build = function (bindOptions) {
            if (!bindOptions.keyToBind) throw new Error('bindOptions.keyToBind is required');

            var bindString = 'bind "' + bindOptions.keyToBind + '" "';

            if (bindOptions.primaryWeapon) {
                var primaryWeaponsArray = bindOptions.primaryWeapon.split(',');
                primaryWeaponsArray.forEach(function (weapon) {
                    bindString += 'buy ' + weapon + '; ';
                });
            }

            if (bindOptions.secondaryWeapon) {
                var secondaryWeaponsArray = bindOptions.secondaryWeapon.split(',');
                for (var i = 0; i < secondaryWeaponsArray.length; i++) {
                    bindString += 'buy ' + secondaryWeaponsArray[i] + '; ';
                }
            }

            if (bindOptions.gear) {
                bindOptions.gear.forEach(function (gearItem) {
                    bindString += 'buy ' + gearItem + '; ';
                });
            }

            if (bindOptions.grenades) {
                bindOptions.grenades.forEach(function (grenade) {
                    var grenadeArray = grenade.split(',');
                    grenadeArray.forEach(function (nade) {
                        bindString += 'buy ' + nade + '; ';
                    });
                });
            }

            bindString = bindString.trim() + '"';
            return bindString;
        };
    };
}( window.buynds = window.buynds || {}, jQuery ));
