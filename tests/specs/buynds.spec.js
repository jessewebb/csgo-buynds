'use strict';

// csgo-buynds buynds module tests

var bindOptionsEqualityTester = function(first, second) {
    if (first instanceof buynds.BindOptions && second instanceof buynds.BindOptions) {
        return first.keyToBind == second.keyToBind &&
            first.primaryWeapon == second.primaryWeapon &&
            first.secondaryWeapon == second.secondaryWeapon &&
            angular.equals(first.gear, second.gear) &&
            angular.equals(first.grenades, second.grenades);
    }
};

describe('buynds', function() {

    describe('BindOptions', function() {

        describe('clone()', function () {
            var bindOptions;

            beforeEach(function () {
                jasmine.addCustomEqualityTester(bindOptionsEqualityTester);
                bindOptions = new buynds.BindOptions();
            });

            it('should return copy of default/empty BindOptions instance', function () {
                var result = bindOptions.clone();
                expect(result).toEqual(bindOptions);
                expect(result.keyToBind).toEqual('');
                expect(result.primaryWeapon).toEqual('');
                expect(result.secondaryWeapon).toEqual('');
                expect(result.gear).toEqual([]);
                expect(result.grenades).toEqual([]);
            });

            it('should return copy of BindOptions instance with keyToBind', function () {
                bindOptions.keyToBind = 'kp_multiply';
                var result = bindOptions.clone();
                expect(result).toEqual(bindOptions);
                expect(result.keyToBind).toEqual('kp_multiply');
            });

            it('should return copy of BindOptions instance with primaryWeapon', function () {
                bindOptions.primaryWeapon = 'ak47,m4a1';
                var result = bindOptions.clone();
                expect(result).toEqual(bindOptions);
                expect(result.primaryWeapon).toEqual('ak47,m4a1');
            });

            it('should return copy of BindOptions instance with secondaryWeapon', function () {
                bindOptions.secondaryWeapon = 'deagle';
                var result = bindOptions.clone();
                expect(result).toEqual(bindOptions);
                expect(result.secondaryWeapon).toEqual('deagle');
            });

            it('should return copy of BindOptions instance with gear', function () {
                bindOptions.gear = ['vesthelm', 'defuser'];
                var result = bindOptions.clone();
                expect(result).toEqual(bindOptions);
                expect(result.gear).toEqual(['vesthelm', 'defuser']);
            });

            it('should return copy of BindOptions instance with grenades', function () {
                bindOptions.grenades = ['molotov,incgrenade', 'flashbang', 'smokegrenade'];
                var result = bindOptions.clone();
                expect(result).toEqual(bindOptions);
                expect(result.grenades).toEqual(['molotov,incgrenade', 'flashbang', 'smokegrenade']);
            });

            it('should return copy of default/empty BindOptions instance', function () {
                bindOptions.keyToBind = 'kp_enter';
                bindOptions.primaryWeapon = 'ssg08';
                bindOptions.secondaryWeapon = 'tec9,fiveseven';
                bindOptions.gear = ['vest'];
                bindOptions.grenades = ['hegrenade', 'decoy'];
                var result = bindOptions.clone();
                expect(result).toEqual(bindOptions);
                expect(result.keyToBind).toEqual('kp_enter');
                expect(result.primaryWeapon).toEqual('ssg08');
                expect(result.secondaryWeapon).toEqual('tec9,fiveseven');
                expect(result.gear).toEqual(['vest']);
                expect(result.grenades).toEqual(['hegrenade', 'decoy']);
            });

            it('should return copy of BindOptions instance that can be mutated independently', function () {
                bindOptions.keyToBind = 'kp_end';
                bindOptions.primaryWeapon = 'awp';
                bindOptions.secondaryWeapon = 'p250';
                bindOptions.gear = ['vest'];
                bindOptions.grenades = ['flashbang', 'hegrenade'];
                var result = bindOptions.clone();
                expect(result).toEqual(bindOptions);
                result.keyToBind = 'kp_uparrow';
                result.primaryWeapon = 'g3sg1,scar20';
                result.secondaryWeapon = 'elite';
                result.gear.push('Taser');
                result.grenades.splice(1, 1);
                expect(result).not.toEqual(bindOptions);
                expect(result.keyToBind).toEqual('kp_uparrow');
                expect(result.primaryWeapon).toEqual('g3sg1,scar20');
                expect(result.secondaryWeapon).toEqual('elite');
                expect(result.gear).toEqual(['vest', 'Taser']);
                expect(result.grenades).toEqual(['flashbang']);
                expect(bindOptions.keyToBind).toEqual('kp_end');
                expect(bindOptions.primaryWeapon).toEqual('awp');
                expect(bindOptions.secondaryWeapon).toEqual('p250');
                expect(bindOptions.gear).toEqual(['vest']);
                expect(bindOptions.grenades).toEqual(['flashbang', 'hegrenade']);
            });
        });
    });

    describe('BindBuilder', function() {

        describe('build(bindOptions)', function () {
            var bindBuilder, bindOptions, defaultKeyBind;

            beforeEach(function () {
                bindBuilder = new buynds.BindBuilder();
                bindOptions = new buynds.BindOptions();
                bindOptions.keyToBind = 'kp_5';
                defaultKeyBind = 'bind "kp_5" ';
            });

            it('should throw Error when keyToBind is empty string', function () {
                bindOptions.keyToBind = '';
                expect(function () { bindBuilder.build(bindOptions); }).
                toThrowError("bindOptions.keyToBind is required");
            });

            it('should build bind for specified keyToBind', function () {
                bindOptions.keyToBind = 'kp_slash';
                var expectedBind = 'bind "kp_slash" ""';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind for single primary weapon', function () {
                bindOptions.primaryWeapon = 'awp';
                var expectedBind = defaultKeyBind + '"buy awp;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind for comma-separated primary weapon', function () {
                bindOptions.primaryWeapon = 'ak47,m4a1';
                var expectedBind = defaultKeyBind + '"buy ak47; buy m4a1;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind for single secondary weapon', function () {
                bindOptions.secondaryWeapon = 'p250';
                var expectedBind = defaultKeyBind + '"buy p250;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind for comma-separated secondary weapon', function () {
                bindOptions.secondaryWeapon = 'glock,hkp2000';
                var expectedBind = defaultKeyBind + '"buy glock; buy hkp2000;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind for single gear item', function () {
                bindOptions.gear = ['vest'];
                var expectedBind = defaultKeyBind + '"buy vest;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind for list of gear items', function () {
                bindOptions.gear = ['vesthelm', 'defuser'];
                var expectedBind = defaultKeyBind + '"buy vesthelm; buy defuser;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind for single grenade', function () {
                bindOptions.grenades = ['decoy'];
                var expectedBind = defaultKeyBind + '"buy decoy;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind for single comma-separated grenade', function () {
                bindOptions.grenades = ['molotov,incgrenade'];
                var expectedBind = defaultKeyBind + '"buy molotov; buy incgrenade;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind for list of grenades', function () {
                bindOptions.grenades = ['smokegrenade', 'hegrenade', 'flashbang'];
                var expectedBind = defaultKeyBind + '"buy smokegrenade; buy hegrenade; buy flashbang;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should build bind with items in the expected order', function () {
                // order: primary, secondary, gear, grenades
                bindOptions.primaryWeapon = 'sawedoff,mag7';
                bindOptions.secondaryWeapon = 'deagle';
                bindOptions.gear = ['vesthelm', 'vest', 'defuser'];
                bindOptions.grenades = ['flashbang', 'hegrenade', 'molotov,incgrenade', 'flashbang'];
                var expectedBind = defaultKeyBind + '"buy sawedoff; buy mag7; buy deagle; buy vesthelm; buy vest; ' +
                    'buy defuser; buy flashbang; buy hegrenade; buy molotov; buy incgrenade; buy flashbang;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });
        });
    });

    describe('BindLoader', function() {

        describe('load(bindString)', function() {
            var primaryWeapons, secondaryWeapons, gear, grenades;

            beforeAll(function(done) {
                var signalDone = function () {
                    if (primaryWeapons && secondaryWeapons && gear && grenades) {
                        done();
                    }
                };

                $.getJSON("../data/primary-weapons.json", function(primaryWeaponsJson) {
                    primaryWeapons = primaryWeaponsJson;
                    signalDone();
                });

                $.getJSON("../data/secondary-weapons.json", function(secondaryWeaponsJson) {
                    secondaryWeapons = secondaryWeaponsJson;
                    signalDone();
                });

                $.getJSON("../data/gear.json", function(gearJson) {
                    gear = gearJson;
                    signalDone();
                });

                $.getJSON("../data/grenades.json", function(grenadesJson) {
                    grenades = grenadesJson;
                    signalDone();
                });
            });

            var bindLoader, bindString, defaultKeyBind, expectedBindOptions;

            beforeEach(function() {
                bindLoader = new buynds.BindLoader(primaryWeapons, secondaryWeapons, gear, grenades);
                jasmine.addCustomEqualityTester(bindOptionsEqualityTester);

                defaultKeyBind = 'bind "kp_ins" ';
                expectedBindOptions = new buynds.BindOptions();
                expectedBindOptions.keyToBind = 'kp_ins';
            });

            it('should throw Error when keyToBind is empty string', function() {
                bindString = '';
                expect(function() { bindLoader.load(bindString); }).
                toThrowError("bindString is required");
            });

            it('should load bind options for key bind with empty action', function() {
                bindString = 'bind "kp_enter" ""';
                expectedBindOptions.keyToBind = 'kp_enter';
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for key bind without double quotes', function() {
                bindString = 'bind kp_enter ""';
                expectedBindOptions.keyToBind = 'kp_enter';
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for single primary weapon', function() {
                bindString = defaultKeyBind + '"buy ssg08;"';
                expectedBindOptions.primaryWeapon = 'ssg08';
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for multiple primary weapons', function() {
                bindString = defaultKeyBind + '"buy galilar; buy famas;"';
                expectedBindOptions.primaryWeapon = 'galilar,famas';
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for single secondary weapon', function() {
                bindString = defaultKeyBind + '"buy deagle;"';
                expectedBindOptions.secondaryWeapon = 'deagle';
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for multiple secondary weapons', function() {
                bindString = defaultKeyBind + '"buy tec9; buy fiveseven;"';
                expectedBindOptions.secondaryWeapon = 'tec9,fiveseven';
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for single gear item', function() {
                bindString = defaultKeyBind + '"buy defuser;"';
                expectedBindOptions.gear = ['defuser'];
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for multiple gear items', function() {
                bindString = defaultKeyBind + '"buy vest; buy vesthelm;"';
                expectedBindOptions.gear = ['vest', 'vesthelm'];
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for single grenade', function() {
                bindString = defaultKeyBind + '"buy hegrenade;"';
                expectedBindOptions.grenades = ['hegrenade'];
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for multiple grenades', function() {
                bindString = defaultKeyBind + '"buy smokegrenade; buy flashbang;"';
                expectedBindOptions.grenades = ['smokegrenade', 'flashbang'];
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });

            it('should load bind options for multiple grenades combining "molotov,incgrenade"', function() {
                bindString = defaultKeyBind + '"buy flashbang; buy molotov; buy incgrenade; buy flashbang;"';
                expectedBindOptions.grenades = ['flashbang', 'molotov,incgrenade', 'flashbang'];
                var result = bindLoader.load(bindString);
                expect(result).toEqual(expectedBindOptions);
            });
        });
    });
});
