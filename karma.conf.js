'use strict';

// Karma configuration
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'vendor/jquery-3.2.1/jquery-3.2.1.min.js',
            'vendor/angular-1.6.6/angular.min.js',
            'vendor/angular-1.6.6/angular-mocks.js',
            'js/*.js',
            'tests/specs/*.spec.js',
            // fixtures
            {
                pattern: 'data/*.json',
                watched: false,
                served: true,
                included: false
            }
        ],
        proxies: {
            "/data/": "/base/data/"
        },
        logLevel: config.LOG_INFO,
        browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        reporters: ['dots', 'coverage'],
        preprocessors: {
            'js/*.js': ['coverage']
        }
    })
};
