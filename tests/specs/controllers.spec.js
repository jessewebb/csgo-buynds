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
                window = {
                    alert: function(message) {}
                };
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
    });
});
