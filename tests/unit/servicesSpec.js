'use strict';

describe('buynds services', function() {
    beforeEach(module('buyndsServices'));

    describe('bindBuilder', function() {
        var bindBuilder, bindOptions, defaultKeyBind;

        beforeEach(inject(function(_bindBuilder_) {
            bindBuilder = _bindBuilder_;
            bindOptions = new BindOptions();
            bindOptions.keyToBind = 'kp_5';
            defaultKeyBind = 'bind "kp_5" ';
        }));

        it('should bind single primary weapon', inject(function(bindBuilder) {
            bindOptions.primaryWeapon = 'awp';
            var expectedBind = defaultKeyBind + '"buy awp;"';
            var result = bindBuilder.build(bindOptions);
            expect(result).toEqual(expectedBind);
        }));

        it('should bind comma-separated primary weapon', inject(function(bindBuilder) {
            bindOptions.primaryWeapon = 'ak47,m4a1';
            var expectedBind = defaultKeyBind + '"buy ak47; buy m4a1;"';
            var result = bindBuilder.build(bindOptions);
            expect(result).toEqual(expectedBind);
        }));
    });
});
