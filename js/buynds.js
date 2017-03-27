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
                    var weaponBinds = weapon['bind'].split(',');
                    for (var k = 0; k < weaponBinds.length; k++) {
                        if (bind === weaponBinds[k]) {
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
                    var weaponBinds = weapon['bind'].split(',');
                    for (var k = 0; k < weaponBinds.length; k++) {
                        if (bind === weaponBinds[k]) {
                            return true;
                        }
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
                var grenadeBinds = grenade['bind'].split(',');
                for (var j = 0; j < grenadeBinds.length; j++) {
                    if (bind === grenadeBinds[j]) {
                        return true;
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
                        if (isBindForGearItem(equipmentToBuy)) {
                            bindOptions.gear.push(equipmentToBuy)
                        }
                        if (isBindForGrenade(equipmentToBuy)) {
                            if (equipmentToBuy === 'incgrenade') {
                                var lastGrenade = bindOptions.grenades.pop();
                                if (lastGrenade === 'molotov') {
                                    equipmentToBuy = lastGrenade + ',' + equipmentToBuy;
                                } else {
                                    bindOptions.push(lastGrenade);
                                }
                            }
                            bindOptions.grenades.push(equipmentToBuy);
                        }
                    }
                }
            }

            return bindOptions;
        };
    };

    buynds.BindRecord = function(id, name, bindString) {
        this.id = id;
        this.name = name;
        this.bindString = bindString;
    };

    buynds.BindRepository = function(bindStorage) {
        this.bindStorage = bindStorage;

        var RECORD_KEY_PREFIX = 'bind_id:';

        var self = this;

        var buildKey = function(id) {
            return RECORD_KEY_PREFIX + id
        };

        this.all = function () {
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

        this.get = function (id) {
            var key = buildKey(id);
            var bindRecordJson = self.bindStorage.getItem(key);
            return JSON.parse(bindRecordJson);
        };

        this.save = function (id, bindRecord) {
            var key = buildKey(id);
            var bindRecordJson = JSON.stringify(bindRecord);
            self.bindStorage.setItem(key, bindRecordJson);
        };

        this.delete = function (id) {
            var key = buildKey(id);
            self.bindStorage.removeItem(key);
        };

        this.empty = function () {
            self.bindStorage.clear();
        };
    };

}(window.buynds = window.buynds || {}));
