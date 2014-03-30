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
                    { "name": "+ (Plus)", "bind": "kp_plus" },
                    { "name": "Enter", "bind": "kp_enter" }
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
                    { "name": "SG 553 / AUG", "bind": "sg556,aug" },
                    { "name": "AWP", "bind": "awp" },
                    { "name": "G3SG1 / SCAR-20", "bind": "g3sg1,scar20" }
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
                    { "name": "Glock-18 / P2000 / USP-S", "bind": "glock,hkp2000" },
                    { "name": "Dual Berettas", "bind": "elite" }
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
                    { "name": "Kevlar Vest", "bind": "vest" },
                    { "name": "Kevlar + Helmet", "bind": "vesthelm" }
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
                    { "name": "Molotov / Incendiary", "bind": "molotov,incgrenade" },
                    { "name": "Decoy", "bind": "decoy" }
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
