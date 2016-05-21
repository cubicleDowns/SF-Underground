cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.judax.cordova.plugin.gamepad/www/Gamepad.js",
        "id": "com.judax.cordova.plugin.gamepad.Gamepad",
        "clobbers": [
            "Gamepad"
        ]
    },
    {
        "file": "plugins/cordova-plugin-canvas-gamepad/www/CDVGamepad.js",
        "id": "cordova-plugin-canvas-gamepad.CDVGamepad",
        "clobbers": [
            "CDVGamepad"
        ]
    },
    {
        "file": "plugins/cordova-plugin-insomnia/www/Insomnia.js",
        "id": "cordova-plugin-insomnia.Insomnia",
        "clobbers": [
            "window.plugins.insomnia"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.judax.cordova.plugin.gamepad": "1.0.0",
    "cordova-plugin-canvas-gamepad": "0.1.1",
    "cordova-plugin-insomnia": "4.2.0",
    "cordova-plugin-ios-longpress-fix": "1.1.0"
};
// BOTTOM OF METADATA
});