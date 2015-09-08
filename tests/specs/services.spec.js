'use strict';

// csgo-buynds services module tests

describe('services', function() {
    beforeEach(module('buyndsServices'));

    describe('dataService', function() {
        var dataService, $httpBackend, version;

        beforeEach(inject(function(_dataService_, _$httpBackend_, _version_) {
            dataService = _dataService_;
            $httpBackend = _$httpBackend_;
            version = _version_;
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('getBindableKeysAsync()', function() {
            it('should request bindable keys data and return promise', function() {
                var expectedBindableKeys = { "keyGroups": [
                    { "name": "Bindable Key Group 1",
                        "keys": [
                            { "name": "Bindable Key 1", "bind": "bk_1" },
                            { "name": "Bindable Key 2", "bind": "bk_2" }
                        ]
                    }
                ]};
                var bindableKeysUrl = 'data/bindable-keys.json';
                var versionUrlParam = 'v=' + version;
                var expectedUrl = bindableKeysUrl + '?' + versionUrlParam;
                $httpBackend.expectGET(expectedUrl).respond(expectedBindableKeys);

                var bindableKeys;
                dataService.getBindableKeysAsync().then(function(data) {
                    bindableKeys = data;
                });

                expect(bindableKeys).toBeUndefined();
                $httpBackend.flush();
                expect(bindableKeys).toEqual(expectedBindableKeys);
            });
        });

        describe('getPrimaryWeaponsAsync()', function() {
            it('should request primary weapons data and return promise', function() {
                var expectedPrimaryWeapons = { "weaponGroups": [
                    { "name": "Primary Weapon Group #1",
                        "weapons": [
                            { "name": "Primary Weapon 1", "bind": "pw1,pw1alt" },
                            { "name": "Primary Weapon 2", "bind": "pw2" },
                            { "name": "Primary Weapon 3", "bind": "pweap3,pw3b" }
                        ]
                    },
                    { "name": "Primary Weapon Group Two",
                        "weapons": [
                            { "name": "Primary Weapon 4", "bind": "pw4,pweap4" },
                            { "name": "Primary Weapon 5", "bind": "pweap5,pweap5b" }
                        ]
                    }
                ]};
                var primaryWeaponsUrl = 'data/primary-weapons.json';
                var versionUrlParam = 'v=' + version;
                var expectedUrl = primaryWeaponsUrl + '?' + versionUrlParam;
                $httpBackend.expectGET(expectedUrl).respond(expectedPrimaryWeapons);

                var primaryWeapons;
                dataService.getPrimaryWeaponsAsync().then(function(data) {
                    primaryWeapons = data;
                });

                expect(primaryWeapons).toBeUndefined();
                $httpBackend.flush();
                expect(primaryWeapons).toEqual(expectedPrimaryWeapons);
            });
        });

        describe('getSecondaryWeaponsAsync()', function() {
            it('should request secondary weapons data and return promise', function() {
                var expectedSecondaryWeapons = { "weaponGroups": [
                    { "name": "Secondary Weapon Group 1",
                        "weapons": [
                            { "name": "Secondary Weapon 1", "bind": "sweap1,sweap1b" },
                            { "name": "Secondary Weapon 2", "bind": "sw2" }
                        ]
                    }
                ]};
                var secondaryWeaponsUrl = 'data/secondary-weapons.json';
                var versionUrlParam = 'v=' + version;
                var expectedUrl = secondaryWeaponsUrl + '?' + versionUrlParam;
                $httpBackend.expectGET(expectedUrl).respond(expectedSecondaryWeapons);

                var secondaryWeapons;
                dataService.getSecondaryWeaponsAsync().then(function(data) {
                    secondaryWeapons = data;
                });

                expect(secondaryWeapons).toBeUndefined();
                $httpBackend.flush();
                expect(secondaryWeapons).toEqual(expectedSecondaryWeapons);
            });
        });

        describe('getGearAsync()', function() {
            it('should request gear data and return promise', function() {
                var expectedGear = [
                    { "name": "Gear 1", "bind": "gear" },
                    { "name": "Gear Item 2", "bind": "gear2" }
                ];
                var gearUrl = 'data/gear.json';
                var versionUrlParam = 'v=' + version;
                var expectedUrl = gearUrl + '?' + versionUrlParam;
                $httpBackend.expectGET(expectedUrl).respond(expectedGear);

                var gear;
                dataService.getGearAsync().then(function(data) {
                    gear = data;
                });

                expect(gear).toBeUndefined();
                $httpBackend.flush();
                expect(gear).toEqual(expectedGear);
            });
        });

        describe('getGrenadesAsync()', function() {
            it('should request grenades data and return promise', function() {
                var expectedGrenades = [
                    { "name": "Grenade #1", "bind": "nade1" },
                    { "name": "Grenade 2", "bind": "grenade2" }
                ];
                var grenadesUrl = 'data/grenades.json';
                var versionUrlParam = 'v=' + version;
                var expectedUrl = grenadesUrl + '?' + versionUrlParam;
                $httpBackend.expectGET(expectedUrl).respond(expectedGrenades);

                var grenades;
                dataService.getGrenadesAsync().then(function(data) {
                    grenades = data;
                });

                expect(grenades).toBeUndefined();
                $httpBackend.flush();
                expect(grenades).toEqual(expectedGrenades);
            });
        });
    });
});
