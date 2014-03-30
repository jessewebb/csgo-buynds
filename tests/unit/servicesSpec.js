'use strict';

describe('buyndsServices', function() {
    beforeEach(module('buyndsServices'));

    describe('bindBuilder', function() {
        var bindBuilder, bindOptions, defaultKeyBind;

        beforeEach(inject(function(_bindBuilder_) {
            bindBuilder = _bindBuilder_;
            bindOptions = new BindOptions();
            bindOptions.keyToBind = 'kp_5';
            defaultKeyBind = 'bind "kp_5" ';
        }));

        describe('build(bindOptions)', function() {

            it('should throw Error when keyToBind is not set', function() {
                bindOptions.keyToBind = '';
                expect(function() { bindBuilder.build(bindOptions); }).
                    toThrowError("bindOptions.keyToBind is required")
            });

            it('should bind any key string', function() {
                bindOptions.keyToBind = 'kp_slash';
                var expectedBind = 'bind "kp_slash" ""';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind single primary weapon', function() {
                bindOptions.primaryWeapon = 'awp';
                var expectedBind = defaultKeyBind + '"buy awp;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind comma-separated primary weapon', function() {
                bindOptions.primaryWeapon = 'ak47,m4a1';
                var expectedBind = defaultKeyBind + '"buy ak47; buy m4a1;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind single secondary weapon', function() {
                bindOptions.secondaryWeapon = 'p250';
                var expectedBind = defaultKeyBind + '"buy p250;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });

            it('should bind comma-separated secondary weapon', function() {
                bindOptions.secondaryWeapon = 'glock,hkp2000';
                var expectedBind = defaultKeyBind + '"buy glock; buy hkp2000;"';
                var result = bindBuilder.build(bindOptions);
                expect(result).toEqual(expectedBind);
            });
        });
    });
});
