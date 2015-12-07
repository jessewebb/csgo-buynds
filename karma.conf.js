'use strict';

// Karma configuration
// http://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'vendor/jquery-2.1.3/jquery.min.js',
            'vendor/angular-1.3.12/angular.min.js',
            'vendor/angular-1.3.12/angular-mocks.js',
            'js/*.js',
            'tests/specs/*.spec.js'
        ],
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Firefox'],
        singleRun: true,
        reporters: ['dots']
    })
};
