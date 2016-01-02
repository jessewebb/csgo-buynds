'use strict';

// csgo-buynds controllers module tests

describe('controllers', function() {
    beforeEach(module('buyndsServices'));
    beforeEach(module('buyndsControllers'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('SingleKeyGenCtrl', function() {
        var scope, route, window, bindBuilder, dataService, controller, $httpBackend, createController,
            getBindableKeysHandler, getPrimaryWeaponsHandler, getSecondaryWeaponsHandler, getGearHandler,
            getGrenadesHandler;

        beforeEach(inject(function(_$rootScope_, _dataService_, _$httpBackend_) {
            scope = _$rootScope_.$new();
            dataService = _dataService_;
            $httpBackend = _$httpBackend_;

            getBindableKeysHandler = $httpBackend.whenGET(/data\/bindable-keys\.json.*/).respond({});
            getPrimaryWeaponsHandler = $httpBackend.whenGET(/data\/primary-weapons\.json.*/).respond({});
            getSecondaryWeaponsHandler = $httpBackend.whenGET(/data\/secondary-weapons\.json.*/).respond({});
            getGearHandler = $httpBackend.whenGET(/data\/gear\.json.*/).respond([]);
            getGrenadesHandler = $httpBackend.whenGET(/data\/grenades\.json.*/).respond([]);

            route = {};
            window = {};
            bindBuilder = {};

            createController = function() {
                var skgController = $controller('SingleKeyGenCtrl', {
                    $scope: scope, $route: route, $window: window,
                    bindBuilder: bindBuilder, dataService: dataService
                });
                $httpBackend.flush();
                return skgController;
            };
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('setKeyToBindByCode(keyCode)', function () {

            beforeEach(function() {
                var bindableKeys = {
                    "keyGroups": [
                        {
                            "name": "Numeric Keypad",
                            "keys": [
                                {
                                    "name": "1 / End",
                                    "bind": "kp_end",
                                    "code": 97
                                },
                                {
                                    "name": "2 / Down Arrow",
                                    "bind": "kp_downarrow",
                                    "code": 98
                                },
                                {
                                    "name": "3 / Page Down",
                                    "bind": "kp_pgdn",
                                    "code": 99
                                }
                            ]
                        }
                    ]
                };
                getBindableKeysHandler.respond(bindableKeys);
                window.alert = function(message) {};
                controller = createController();
            });

            it('should update the key to bind on the bind options', function() {
                var keyCode = 97;
                var expectedKeyBind = 'kp_end';
                scope.setKeyToBindByCode(keyCode);
                expect(scope.bindOptions.keyToBind).toEqual(expectedKeyBind);
            });

            it('should update the key to bind on the bind options with the correct bindable key', function() {
                var keyCode = 99;
                var expectedKeyBind = 'kp_pgdn';
                scope.setKeyToBindByCode(keyCode);
                expect(scope.bindOptions.keyToBind).toEqual(expectedKeyBind);
            });

            it('should alert user of error when given an unrecognized key code', function() {
                var keyCode = 93;
                var expectedErrorMessage = 'Unrecognized Key! (keyCode = 93)';
                spyOn(window, 'alert');
                scope.setKeyToBindByCode(keyCode);
                expect(window.alert).toHaveBeenCalledWith(expectedErrorMessage);
            });
        });

        describe('toggleGearSelection(gearBind)', function () {

            beforeEach(function() {
                controller = createController();
            });

            it('should add the gear bind to the bind options when the gear is not currently bound', function() {
                scope.toggleGearSelection('vest');
                expect(scope.bindOptions.gear).toEqual(['vest']);
            });

            it('should add the gear bind to the bind options even when other gear is already bound', function() {
                scope.bindOptions.gear = ['vesthelm', 'vest'];
                scope.toggleGearSelection('defuser');
                expect(scope.bindOptions.gear).toEqual(['vesthelm', 'vest', 'defuser']);
            });

            it('should remove the gear bind from the bind options when the gear is currently bound', function() {
                scope.bindOptions.gear = ['vesthelm'];
                scope.toggleGearSelection('vesthelm');
                expect(scope.bindOptions.gear).toEqual([]);
            });

            it('should remove the gear bind from the bind options even when other gear is also bound', function() {
                scope.bindOptions.gear = ['vesthelm', 'vest', 'Taser', 'defuser'];
                scope.toggleGearSelection('Taser');
                expect(scope.bindOptions.gear).toEqual(['vesthelm', 'vest', 'defuser']);
            });
        });

        describe('toggleGrenadeSelection(grenadeBind)', function () {

            beforeEach(function() {
                controller = createController();
            });

            it('should add the grenade bind to the bind options when the grenade is not currently bound', function() {
                scope.toggleGrenadeSelection('hegrenade');
                expect(scope.bindOptions.grenades).toEqual(['hegrenade']);
            });

            it('should add the grenade bind to the bind options even when other grenades are already bound', function() {
                scope.bindOptions.grenades = ['flashbang'];
                scope.toggleGrenadeSelection('decoy');
                expect(scope.bindOptions.grenades).toEqual(['flashbang', 'decoy']);
            });

            it('should remove the grenade bind from the bind options when the grenade is currently bound', function() {
                scope.bindOptions.grenades = ['smokegrenade'];
                scope.toggleGrenadeSelection('smokegrenade');
                expect(scope.bindOptions.grenades).toEqual([]);
            });

            it('should remove the grenade bind from the bind options even when other grenades are also bound', function() {
                scope.bindOptions.grenades = ['molotov,incgrenade', 'hegrenade', 'flashbang'];
                scope.toggleGrenadeSelection('molotov,incgrenade');
                expect(scope.bindOptions.grenades).toEqual(['hegrenade', 'flashbang']);
            });
        });

        describe('allowExtraGrenade(grenadeBind)', function () {

            beforeEach(function() {
                controller = createController();
            });

            it('should return true for the Flashbang grenade bind', function() {
                expect(scope.allowExtraGrenade('flashbang')).toEqual(true);
            });

            it('should return false for the Molotov / Incendiary grenade bind', function() {
                expect(scope.allowExtraGrenade('molotov,incgrenade')).toEqual(false);
            });

            it('should return false for the Decoy grenade bind', function() {
                expect(scope.allowExtraGrenade('decoy')).toEqual(false);
            });

            it('should return false for the High Explosive grenade bind', function() {
                expect(scope.allowExtraGrenade('hegrenade')).toEqual(false);
            });

            it('should return false for the Smoke grenade bind', function() {
                expect(scope.allowExtraGrenade('smokegrenade')).toEqual(false);
            });
        });

        describe('hasExtraGrenadeSelection(grenadeBind)', function () {

            beforeEach(function() {
                controller = createController();
            });

            it('should return true when the grenade bind is bound twice', function() {
                scope.bindOptions.grenades = ['flashbang', 'flashbang'];
                expect(scope.hasExtraGrenadeSelection('flashbang')).toEqual(true);
            });

            it('should return true when the grenade bind is bound twice along with other grenades', function() {
                scope.bindOptions.grenades = ['smokegrenade', 'flashbang', 'hegrenade', 'flashbang'];
                expect(scope.hasExtraGrenadeSelection('flashbang')).toEqual(true);
            });

            it('should return false when the grenade bind is not bound', function() {
                scope.bindOptions.grenades = ['decoy'];
                expect(scope.hasExtraGrenadeSelection('flashbang')).toEqual(false);
            });

            it('should return false when the grenade bind is only bound once', function() {
                scope.bindOptions.grenades = ['flashbang', 'molotov,incgrenade', 'smokegrenade'];
                expect(scope.hasExtraGrenadeSelection('flashbang')).toEqual(false);
            });
        });

        describe('toggleExtraGrenadeSelection(grenadeBind)', function () {

            beforeEach(function() {
                controller = createController();
            });

            it('should add the grenade bind to the bind options twice when the grenade is not currently bound', function() {
                scope.toggleExtraGrenadeSelection('flashbang');
                expect(scope.bindOptions.grenades).toEqual(['flashbang', 'flashbang']);
            });

            it('should add the grenade bind to the bind options twice even when other grenades are already bound', function() {
                scope.bindOptions.grenades = ['smokegrenade', 'molotov,incgrenade'];
                scope.toggleExtraGrenadeSelection('flashbang');
                expect(scope.bindOptions.grenades).toEqual(['smokegrenade', 'molotov,incgrenade', 'flashbang', 'flashbang']);
            });

            it('should add the grenade bind to the bind options once when the grenade bind is currently bound once', function() {
                scope.bindOptions.grenades = ['flashbang'];
                scope.toggleExtraGrenadeSelection('flashbang');
                expect(scope.bindOptions.grenades).toEqual(['flashbang', 'flashbang']);
            });

            it('should add the grenade bind to the bind options once even when other grenades are already bound', function() {
                scope.bindOptions.grenades = ['flashbang', 'decoy', 'hegrenade'];
                scope.toggleExtraGrenadeSelection('flashbang');
                expect(scope.bindOptions.grenades).toEqual(['flashbang', 'decoy', 'hegrenade', 'flashbang']);
            });

            it('should remove the grenade bind from the bind options once when the grenade is currently bound twice', function() {
                scope.bindOptions.grenades = ['flashbang', 'flashbang'];
                scope.toggleExtraGrenadeSelection('flashbang');
                expect(scope.bindOptions.grenades).toEqual(['flashbang']);
            });

            it('should remove the grenade bind from the bind options once even when other grenades are also bound', function() {
                scope.bindOptions.grenades = ['hegrenade', 'flashbang', 'molotov,incgrenade', 'flashbang'];
                scope.toggleExtraGrenadeSelection('flashbang');
                expect(scope.bindOptions.grenades).toEqual(['hegrenade', 'flashbang', 'molotov,incgrenade']);
            });
        });

        describe('generateBind()', function () {

            beforeEach(function() {
                window.ga = function() {};
                route.current = { page : '/buy-binds-generator.html' };
                scope.skgForm = { $valid: true };
                bindBuilder.build = function() { return 'test bind'; };
                controller = createController();
            });

            it('should mark the form as submitted', function() {
                scope.generateBind();
                expect(scope.submitted).toEqual(true);
            });

            it('should build the bind from the bind options', function() {
                spyOn(bindBuilder, 'build');
                scope.generateBind();
                expect(bindBuilder.build).toHaveBeenCalledWith(scope.bindOptions);
            });

            it('should update the buy bind when the form is valid', function() {
                scope.generateBind();
                expect(scope.buyBind).toEqual('test bind');
            });

            it('should update the buy bind to be the bind that was built', function() {
                bindBuilder.build = function() { return 'the built bind'; };
                scope.generateBind();
                expect(scope.buyBind).toEqual('the built bind');
            });

            it('should not build or update the buy bind when the form is invalid', function() {
                spyOn(bindBuilder, 'build');
                scope.skgForm = { $valid: false };
                scope.generateBind();
                expect(bindBuilder.build).not.toHaveBeenCalled();
                expect(scope.buyBind).toEqual('');
            });

            it('should track the button click event analytics data', function() {
                spyOn(window, 'ga');
                scope.generateBind();
                expect(window.ga).toHaveBeenCalledWith(
                    'send', 'event', 'button', 'click', 'generate',
                    { page: '/buy-binds-generator.html' });
            });

            it('should track the bind build event analytics data when the form is valid', function() {
                spyOn(window, 'ga');
                scope.generateBind();
                expect(window.ga).toHaveBeenCalledWith(
                    'send', 'event', 'bind builder', 'build', 'key bind', 1,
                    { page: '/buy-binds-generator.html' });
            });
        });

        describe('resetBind()', function () {

            beforeEach(function() {
                window.ga = function() {};
                route.current = { page : '/buy-binds-generator.html' };
                controller = createController();
            });

            it('should re-initialize the bind options', function() {
                scope.bindOptions.keyToBind = 'ktb';
                scope.bindOptions.primaryWeapon = 'pw';
                scope.bindOptions.secondaryWeapon = 'sw';
                scope.bindOptions.gear = ['gear'];
                scope.bindOptions.grenades = ['nades'];
                scope.resetBind();
                expect(scope.bindOptions.keyToBind).toEqual('');
                expect(scope.bindOptions.primaryWeapon).toEqual('');
                expect(scope.bindOptions.secondaryWeapon).toEqual('');
                expect(scope.bindOptions.gear).toEqual([]);
                expect(scope.bindOptions.grenades).toEqual([]);
            });

            it('should set the buy bind to empty string', function() {
                scope.resetBind();
                expect(scope.buyBind).toEqual('');
            });

            it('should mark the form as not submitted', function() {
                scope.resetBind();
                expect(scope.submitted).toEqual(false);
            });

            it('should track the button click event analytics data', function() {
                spyOn(window, 'ga');
                scope.resetBind();
                expect(window.ga).toHaveBeenCalledWith(
                    'send', 'event', 'button', 'click', 'reset',
                    { page: '/buy-binds-generator.html' });
            });
        });
    });
});
