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

    buynds.BindLoader = function(primaryWeapons, secondaryWeapons, gear, grenades) {
        this.primaryWeapons = primaryWeapons;
        this.secondaryWeapons = secondaryWeapons;
        this.gear = gear;
        this.grenades = grenades;

        var self = this;

        var isBindForPrimaryWeapon = function (bind) {
            for (var i = 0; i < self.primaryWeapons['weaponGroups'].length; i++) {
                var weaponGroup = self.primaryWeapons['weaponGroups'][i];
                for (var j = 0; j < weaponGroup['weapons'].length; j++) {
                    var weapon = weaponGroup['weapons'][j];
                    var weaponBinds = weapon["bind"].split(',');
                    for (var k = 0; k < weaponBinds.length; k++) {
                        if (bind == weaponBinds[k]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        var isBindForSecondaryWeapon = function (bind) {
            for (var i = 0; i < self.secondaryWeapons['weaponGroups'].length; i++) {
                var weaponGroup = self.secondaryWeapons['weaponGroups'][i];
                for (var j = 0; j < weaponGroup['weapons'].length; j++) {
                    var weapon = weaponGroup['weapons'][j];
                    var weaponBinds = weapon["bind"].split(',');
                    for (var k = 0; k < weaponBinds.length; k++) {
                        if (bind == weaponBinds[k]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

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
                    var buyCommand = buyCommands[i].trim();
                    if (buyCommand.startsWith('buy ')) {
                        var equipmentToBuy = buyCommand.substring(4);
                        if (isBindForPrimaryWeapon(equipmentToBuy)) {
                            if (bindOptions.primaryWeapon) {
                                bindOptions.primaryWeapon += ',' + equipmentToBuy;
                            } else {
                                bindOptions.primaryWeapon = equipmentToBuy;
                            }
                        }
                        if (isBindForSecondaryWeapon(equipmentToBuy)) {
                            if (bindOptions.secondaryWeapon) {
                                bindOptions.secondaryWeapon += ',' + equipmentToBuy;
                            } else {
                                bindOptions.secondaryWeapon = equipmentToBuy;
                            }
                        }
                    }
                }
            }

            return bindOptions;
        };
    };

}( window.buynds = window.buynds || {}, jQuery ));
