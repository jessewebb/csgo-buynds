'use strict';

// csgo-buynds buy binds builder

(function(buynds) {

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position){
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }

    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(searchString, position) {
            var subjectString = this.toString();
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.lastIndexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }

    buynds.BindOptions = function() {
        var self = this;

        self.keyToBind = '';
        self.primaryWeapons = [];
        self.secondaryWeapons = [];
        self.gear = [];
        self.grenades = [];

        self.clone = function() {
            var clone = new buynds.BindOptions();
            clone.keyToBind = self.keyToBind;
            clone.primaryWeapons = self.primaryWeapons.slice();
            clone.secondaryWeapons = self.secondaryWeapons.slice();
            clone.gear = self.gear.slice();
            clone.grenades = self.grenades.slice();
            return clone;
        };
    };

    buynds.BindBuilder = function() {
        var self = this;

        self.build = function (bindOptions) {
            if (!bindOptions.keyToBind) throw new Error('bindOptions.keyToBind is required');

            var bindString = 'bind "' + bindOptions.keyToBind + '" "';

            if (bindOptions.primaryWeapons) {
                bindOptions.primaryWeapons.forEach(function (weapon) {
                    bindString += 'buy ' + weapon + '; ';
                });
            }

            if (bindOptions.secondaryWeapons) {
                bindOptions.secondaryWeapons.forEach(function (weapon) {
                    bindString += 'buy ' + weapon + '; ';
                });
            }

            if (bindOptions.gear) {
                bindOptions.gear.forEach(function (gearItem) {
                    bindString += 'buy ' + gearItem + '; ';
                });
            }

            if (bindOptions.grenades) {
                bindOptions.grenades.forEach(function (grenade) {
                    bindString += 'buy ' + grenade + '; ';
                });
            }

            bindString = bindString.trim() + '"';
            return bindString;
        };
    };

    buynds.BindLoader = function(primaryWeapons, secondaryWeapons, gear, grenades) {
        var self = this;

        self.primaryWeapons = primaryWeapons;
        self.secondaryWeapons = secondaryWeapons;
        self.gear = gear;
        self.grenades = grenades;

        var isBindForPrimaryWeapon = function (bind) {
            for (var i = 0; i < self.primaryWeapons['weaponGroups'].length; i++) {
                var weaponGroup = self.primaryWeapons['weaponGroups'][i];
                for (var j = 0; j < weaponGroup['weapons'].length; j++) {
                    var weapon = weaponGroup['weapons'][j];
                    if (bind === weapon['bind']) {
                        return true;
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
                    if (bind === weapon['bind']) {
                        return true;
                    }
                }
            }
            return false;
        };

        var isBindForGearItem = function (bind) {
            for (var i = 0; i < self.gear.length; i++) {
                var gearItem = self.gear[i];
                if (bind === gearItem['bind']) {
                    return true;
                }
            }
            return false;
        };

        var isBindForGrenade = function (bind) {
            for (var i = 0; i < self.grenades.length; i++) {
                var grenade = self.grenades[i];
                if (bind === grenade['bind']) {
                    return true;
                }
            }
            return false;
        };

        self.load = function (bindString) {
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
                            bindOptions.primaryWeapons.push(equipmentToBuy);
                        }
                        if (isBindForSecondaryWeapon(equipmentToBuy)) {
                            bindOptions.secondaryWeapons.push(equipmentToBuy);
                        }
                        if (isBindForGearItem(equipmentToBuy)) {
                            bindOptions.gear.push(equipmentToBuy)
                        }
                        if (isBindForGrenade(equipmentToBuy)) {
                            bindOptions.grenades.push(equipmentToBuy);
                        }
                    }
                }
            }

            return bindOptions;
        };
    };

    buynds.BindRecord = function(id, name, bindString) {
        var self = this;

        self.id = id;
        self.name = name;
        self.bindString = bindString;
    };

    buynds.BindRepository = function(bindStorage) {
        var self = this;

        self.bindStorage = bindStorage;

        var RECORD_KEY_PREFIX = 'bind_id:';

        var buildKey = function(id) {
            return RECORD_KEY_PREFIX + id
        };

        self.all = function () {
            var bindRecords = [];
            for (var i = 0; i < self.bindStorage.length; i++) {
                var key = self.bindStorage.key(i);
                if (key.startsWith(RECORD_KEY_PREFIX)) {
                    var bindRecordJson = self.bindStorage.getItem(key);
                    var bindRecord = JSON.parse(bindRecordJson);
                    bindRecords.push(bindRecord);
                }
            }
            return bindRecords;
        };

        self.get = function (id) {
            var key = buildKey(id);
            var bindRecordJson = self.bindStorage.getItem(key);
            return JSON.parse(bindRecordJson);
        };

        self.save = function (id, bindRecord) {
            var key = buildKey(id);
            var bindRecordJson = JSON.stringify(bindRecord);
            self.bindStorage.setItem(key, bindRecordJson);
        };

        self.delete = function (id) {
            var key = buildKey(id);
            self.bindStorage.removeItem(key);
        };

        self.empty = function () {
            self.bindStorage.clear();
        };
    };

    buynds.BuyableItem = function(name, bind, slot, price, team) {
        var self = this;

        self.name = name;
        self.bind = bind;
        self.slot = slot;
        self.price = price;
        self.team = team;
    };

    buynds.BindOptionsTotalPrice = function(ct, t) {
        var self = this;

        self.ct = ct;
        self.t = t;
    };

    buynds.TotalPriceCalculator = function(primaryWeapons, secondaryWeapons, gear, grenades) {
        var self = this;

        self.primaryWeapons = primaryWeapons;
        self.secondaryWeapons = secondaryWeapons;
        self.gear = gear;
        self.grenades = grenades;

        var findWeaponByBind = function (weaponBind, weaponsData) {
            for (var i = 0; i < weaponsData.weaponGroups.length; i++) {
                var weaponGroup = weaponsData.weaponGroups[i];
                for (var j = 0; j < weaponGroup.weapons.length; j++) {
                    var weapon = weaponGroup.weapons[j];
                    if (weapon.bind === weaponBind) {
                        return weapon;
                    }
                }
            }
            return null;
        };

        var findPrimaryWeaponByBind = function (primaryWeaponBind) {
            var weapon = findWeaponByBind(primaryWeaponBind, self.primaryWeapons);
            if (!weapon) throw new Error('unknown primaryWeaponBind: ' + primaryWeaponBind);
            return weapon;
        };

        var findSecondaryWeaponByBind = function (secondaryWeaponBind) {
            var weapon = findWeaponByBind(secondaryWeaponBind, self.secondaryWeapons);
            if (!weapon) throw new Error('unknown secondaryWeaponBind: ' + secondaryWeaponBind);
            return weapon;
        };

        var findGearByBind = function (gearBind) {
            for (var i = 0; i < self.gear.length; i++) {
                var gear = self.gear[i];
                if (gear.bind === gearBind) {
                    return gear;
                }
            }
            throw new Error('unknown gearBind: ' + gearBind);
        };

        var findGrenadeByBind = function (grenadeBind) {
            for (var i = 0; i < self.grenades.length; i++) {
                var grenade = self.grenades[i];
                if (grenade.bind === grenadeBind) {
                    return grenade;
                }
            }
            throw new Error('unknown grenadeBind: ' + grenadeBind);
        };

        var getItemPriceForTeam = function (item, team) {
            if (!item.hasOwnProperty('team') || item.team === team) {
                return item.price;
            }
            return 0;
        };

        var ctItemPrice = function (item) {
            return getItemPriceForTeam(item, 'ct');
        };

        var tItemPrice = function (item) {
            return getItemPriceForTeam(item, 't');
        };

        self.calculateTotalPrice = function (bindOptions) {
            var ct = 0;
            var t = 0;

            if (bindOptions.primaryWeapons) {
                bindOptions.primaryWeapons.forEach(function (weaponBind) {
                    var weapon = findPrimaryWeaponByBind(weaponBind);
                    ct += ctItemPrice(weapon);
                    t += tItemPrice(weapon);
                });
            }

            if (bindOptions.secondaryWeapons) {
                bindOptions.secondaryWeapons.forEach(function (weaponBind) {
                    var weapon = findSecondaryWeaponByBind(weaponBind);
                    ct += ctItemPrice(weapon);
                    t += tItemPrice(weapon);
                });
            }

            if (bindOptions.gear) {
                bindOptions.gear.forEach(function (gearBind) {
                    var gear = findGearByBind(gearBind);
                    ct += ctItemPrice(gear);
                    t += tItemPrice(gear);
                });
            }

            if (bindOptions.grenades) {
                bindOptions.grenades.forEach(function (grenadeBind) {
                    var grenade = findGrenadeByBind(grenadeBind);
                    ct += ctItemPrice(grenade);
                    t += tItemPrice(grenade);
                });
            }

            return new buynds.BindOptionsTotalPrice(ct, t);
        };
    };

}(window.buynds = window.buynds || {}));
