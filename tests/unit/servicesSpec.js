'use strict';

describe('services', function() {
    beforeEach(module('buyndsServices'));

    describe('dataService', function() {
        var dataService, $httpBackend;

        beforeEach(inject(function(_dataService_, _$httpBackend_) {
            dataService = _dataService_;
            $httpBackend = _$httpBackend_;
        }));

        describe('getBindableKeysAsync()', function() {
            it('should request bindable keys data and return promise', function() {
                var expectedBindableKeys = [
                    { "name": "Bindable Key 1", "bind": "bk_1" },
                    { "name": "Bindable Key 2", "bind": "bk_2" }
                ];
                $httpBackend.expectGET('data/bindable-keys.json').respond(expectedBindableKeys);

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
                var expectedPrimaryWeapons = [
                    { "name": "Primary Weapon 1", "bind": "pw1,pw1alt" },
                    { "name": "Primary Weapon 2", "bind": "pw2" },
                    { "name": "Primary Weapon 3", "bind": "pweap3,pw3b" }
                ];
                $httpBackend.expectGET('data/primary-weapons.json').respond(expectedPrimaryWeapons);

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
                var expectedSecondaryWeapons = [
                    { "name": "Secondary Weapon 1", "bind": "sweap1,sweap1b" },
                    { "name": "Secondary Weapon 2", "bind": "sw2" }
                ];
                $httpBackend.expectGET('data/secondary-weapons.json').respond(expectedSecondaryWeapons);

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
                $httpBackend.expectGET('data/gear.json').respond(expectedGear);

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
                $httpBackend.expectGET('data/grenades.json').respond(expectedGrenades);

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
