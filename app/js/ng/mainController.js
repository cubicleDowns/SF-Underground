angular.module('SFUnderground.controller.main', ['SFUnderground.3D'])
    .controller('MainController', [
        '$scope',
        '$location',
        '$firebaseObject',
        'ThreeScene',
        'SETUP',
        function ($scope, $location, $firebaseObject, ThreeScene, SETUP) {

            var main = this;

            var fb = new Firebase("https://sf-noise.firebaseio.com");
            var syncObject = $firebaseObject(fb);
            syncObject.$bindTo($scope, "main.data");

            /**
             * @type {number}
             */
            main.time = SETUP.MULTIPLIER || 1;
            main.constants = SETUP;
            main.changeTime = changeTime;
            main.init = init;

            main.testFB = testFB;

            function testFB(str) {
                if (this.data.alerts) {
                    this.data.alerts.push(str);
                } else {
                    this.data.alerts = [];
                }
            }

            /**
             * Change the train speed scaler.
             */
            function changeTime() {
                ThreeScene.setMultiplier(main.time);
            }

            /**
             * Initialize the 3D scene
             */
            function init() {
                ThreeScene.init();
            }
        }
    ]);
