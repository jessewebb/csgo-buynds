'use strict';

// csgo-buynds angular directives

var buyndsDirectives = angular.module('buyndsDirectives', []);

buyndsDirectives.directive('appVersion', ['version', function (version) {
    return function (scope, element) {
        element.text(version);
    };
}]);

buyndsDirectives.directive('activeTabClass', ['$location', function($location) {
    return function (scope, element, attrs) {
        var clazz = attrs.activeTabClass;
        var linkElement = element.children().eq(0); // assume 'a' element is first child
        var linkHref = linkElement.attr('href');
        linkHref = linkHref.substring(1); // remove leading hash character
        scope.location = $location;
        scope.$watch('location.path()', function(newPath) {
            if (linkHref === newPath) {
                element.addClass(clazz);
            } else {
                element.removeClass(clazz);
            }
        });
    };
}]);

buyndsDirectives.directive('pressAnyKeyButton', ['$window', function($window) {
    return {
        scope: {
            onKeyPress: '&'
        },
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.keyRecognitionActivated = false;
            var domElement = element.get(0);

            function isPointerLockActivated() {
                return $window.document.pointerLockElement === domElement ||
                    $window.document.mozPointerLockElement === domElement ||
                    $window.document.webkitPointerLockElement === domElement;
            }

            function onKeyPress(keyPressEvent) {
                if (scope.keyRecognitionActivated) {
                    scope.keyRecognitionActivated = false;
                    jQuery($window.document).off('keydown');
                    disablePointerLock();
                    var keyCode = keyPressEvent.which;
                    scope.onKeyPress()(keyCode);
                    scope.$apply();
                    keyPressEvent.preventDefault();
                }
            }

            function onPointerLockChange() {
                if(isPointerLockActivated()) {
                    if (!scope.keyRecognitionActivated) {
                        scope.keyRecognitionActivated = true;
                        jQuery($window.document).on('keydown', onKeyPress);
                        scope.$apply();
                    }
                } else {
                    if (scope.keyRecognitionActivated) {
                        scope.keyRecognitionActivated = false;
                        jQuery($window.document).off('keydown');
                        disablePointerLock();
                        scope.$apply();
                    }
                }
            }

            function onPointerLockError() {
                $window.console.error('Pointer lock failed');
                scope.keyRecognitionActivated = false;
                jQuery($window.document).off('keydown');
                disablePointerLock();
                scope.$apply();
            }

            function setupPointerLock() {
                $window.document.addEventListener('pointerlockchange', onPointerLockChange);
                $window.document.addEventListener('mozpointerlockchange', onPointerLockChange);
                $window.document.addEventListener('webkitpointerlockchange', onPointerLockChange);

                $window.document.addEventListener('pointerlockerror', onPointerLockError);
                $window.document.addEventListener('mozpointerlockerror', onPointerLockError);
                $window.document.addEventListener('webkitpointerlockerror', onPointerLockError);

                domElement.requestPointerLock = domElement.requestPointerLock ||
                    domElement.mozRequestPointerLock || domElement.webkitRequestPointerLock;
                domElement.requestPointerLock();
            }

            function disablePointerLock() {
                $window.document.removeEventListener('pointerlockchange', onPointerLockChange);
                $window.document.removeEventListener('mozpointerlockchange', onPointerLockChange);
                $window.document.removeEventListener('webkitpointerlockchange', onPointerLockChange);

                $window.document.removeEventListener('pointerlockerror', onPointerLockError);
                $window.document.removeEventListener('mozpointerlockerror', onPointerLockError);
                $window.document.removeEventListener('webkitpointerlockerror', onPointerLockError);

                if(isPointerLockActivated()) {
                    $window.document.exitPointerLock = $window.document.exitPointerLock ||
                        $window.document.mozExitPointerLock || $window.document.webkitExitPointerLock;
                    $window.document.exitPointerLock();
                }
            }

            function activateKeyRecognition() {
                setupPointerLock();
            }

            scope.$watch('keyRecognitionActivated', function(value) {
                if (value) {
                    element.removeClass(attrs.inactiveClass);
                    element.addClass(attrs.activeClass);
                } else {
                    element.removeClass(attrs.activeClass);
                    element.addClass(attrs.inactiveClass);
                }
            });

            element.on('click', function() {
                if (!scope.keyRecognitionActivated) {
                    activateKeyRecognition();
                }
            });

            element.on('$destroy', function() {
                jQuery($window.document).off('keydown');
                disablePointerLock();
            });
        }
    };
}]);
