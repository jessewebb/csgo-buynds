'use strict';

// csgo-buynds buynds module tests

describe('buynds', function() {

    describe('BindBuilder', function() {
        var bindBuilder, bindOptions, defaultKeyBind;

        beforeEach(function() {
            bindBuilder = new buynds.BindBuilder();
            bindOptions = new buynds.BindOptions();
            bindOptions.keyToBind = 'kp_5';
            defaultKeyBind = 'bind "kp_5" ';
        });

        describe('build(bindOptions)', function() {

            it('should throw Error when keyToBind is not set', function() {
                bindOptions.keyToBind = '';
                expect(function() { bindBuilder.build(bindOptions); }).
                    toThrowError("bindOptions.keyToBind is required");
            });

            it('should bind any key string', function() {
                bindOptions.keyToBind = 'kp_slash';
                var expectedBind = 'bind "kp_slash" "";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind single primary weapon', function() {
                bindOptions.primaryWeapon = 'awp';
                var expectedBind = defaultKeyBind + '"buy awp;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind comma-separated primary weapon', function() {
                bindOptions.primaryWeapon = 'ak47,m4a1';
                var expectedBind = defaultKeyBind + '"buy ak47; buy m4a1;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind single secondary weapon', function() {
                bindOptions.secondaryWeapon = 'p250';
                var expectedBind = defaultKeyBind + '"buy p250;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind comma-separated secondary weapon', function() {
                bindOptions.secondaryWeapon = 'glock,hkp2000';
                var expectedBind = defaultKeyBind + '"buy glock; buy hkp2000;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind single gear item', function() {
                bindOptions.gear = ['vest'];
                var expectedBind = defaultKeyBind + '"buy vest;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind list of gear items', function() {
                bindOptions.gear = ['vesthelm', 'defuser'];
                var expectedBind = defaultKeyBind + '"buy vesthelm; buy defuser;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind single grenade', function() {
                bindOptions.grenades = ['decoy'];
                var expectedBind = defaultKeyBind + '"buy decoy;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind single comma-separated grenade', function() {
                bindOptions.grenades = ['molotov,incgrenade'];
                var expectedBind = defaultKeyBind + '"buy molotov; buy incgrenade;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind list of grenades', function() {
                bindOptions.grenades = ['smokegrenade', 'hegrenade', 'flashbang'];
                var expectedBind = defaultKeyBind + '"buy smokegrenade; buy hegrenade; buy flashbang;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind items in the expected order', function() {
                // order: primary, secondary, gear, grenades
                bindOptions.primaryWeapon = 'sawedoff,mag7';
                bindOptions.secondaryWeapon = 'deagle';
                bindOptions.gear = ['vesthelm', 'vest', 'defuser'];
                bindOptions.grenades = ['hegrenade', 'molotov,incgrenade'];
                var expectedBind = defaultKeyBind + '"buy sawedoff; buy mag7; buy deagle; buy vesthelm; buy vest; ' +
                    'buy defuser; buy hegrenade; buy molotov; buy incgrenade;";';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });
        });
    });
});
