'use strict';

// csgo-buynds buy binds builder

(function( buynds, $, undefined ) {

    buynds.BindOptions = function() {
        this.keyToBind = '';
        this.primaryWeapon = '';
        this.secondaryWeapon = '';
        this.gear = [];
        this.grenades = [];

        this.clone = function() {
            var clone = new buynds.BindOptions();
            clone.keyToBind = this.keyToBind;
            clone.primaryWeapon = this.primaryWeapon;
            clone.secondaryWeapon = this.secondaryWeapon;
            clone.gear = this.gear.slice();
            clone.grenades = this.grenades.slice();
            return clone;
        };
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

    buynds.BindLoader = function() {
        this.load = function (bindString) {
            if (!bindString) throw new Error('bindString is required');

            var bindOptions = new buynds.BindOptions();

            if (bindString.startsWith('bind ')) {
                bindString = bindString.substring(5)
            }

            if (bindString.startsWith('"')) {
                bindOptions.keyToBind = bindString.substring(1, bindString.indexOf('"', 1));
            } else {
                bindOptions.keyToBind = bindString.substring(0, bindString.indexOf(' '));
            }
            bindString = bindString.substring(bindString.indexOf(' ') + 1);

            if (bindString.startsWith('"') && bindString.endsWith('"')) {
                bindString = bindString.substring(1, bindString.length - 1);
                var buyCommands = bindString.split(';');
                for (var i = 0; i < buyCommands.length; i++) {
                    var buyCommand = buyCommands[i];
                    if (buyCommand.startsWith('buy ')) {
                        bindOptions.primaryWeapon = buyCommand.substring(4);
                    }
                }
            }

            return bindOptions;
        };
    };

}( window.buynds = window.buynds || {}, jQuery ));
