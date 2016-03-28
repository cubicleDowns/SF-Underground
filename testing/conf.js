/**
 * Documentation
 * @see https://github.com/angular/protractor/blob/master/docs/referenceConf.js
 */
//var params = require('./params.js').params;

exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e/**/*.spec.js'],
    allScriptsTimeout: 11000,
    getPageTimeout: 10000,
    params: {
        delay: 5000,
        url: 'http://localhost:' + process.env.MAP_SERVER_PORT + '/',
        title: 'Sounds of the SF Underground'
    },
    restartBrowserBetweenTests: false,
    capabilities: {
        browserName: 'chrome'
    },
    onPrepare: function () {
        browser.driver.manage().window().maximize();
    }
};