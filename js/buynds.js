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

            var granadeStringArray = [];
            var count = 0;


            if (bindOptions.grenades) {
                bindOptions.grenades.forEach(function (grenade) {
                    var grenadeArray = grenade.split(',');
                    grenadeArray.forEach(function (nade) {
                        granadeStringArray[count] = 'buy ' + nade + '; ';
                        count++;
                    });
                });
            }
            var granadeString ="";

            granadeStringArray.forEach(function(buyString){
                if(buyString.indexOf("flash") != -1){
                    granadeString = granadeString + buyString;
                }else{
                    granadeString = buyString + granadeString;
                }
            });

            bindString += granadeString;

            bindString = bindString.trim() + '";';
            return bindString;
        };
    };

}( window.buynds = window.buynds || {}, jQuery ));
