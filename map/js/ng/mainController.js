angular.module('SFUnderground.controller.main', ['SFUnderground.3D'])
    .controller('MainController', [
        '$scope',
        '$location',
        '$firebaseObject',
        'ThreeScene',
        'SETUP',
        'BART',
        function ($scope, $location, $firebaseObject, ThreeScene, SETUP, BART) {

            var main = this;

            var fb = new Firebase("https://sf-noise.firebaseio.com");
            var syncObject = $firebaseObject(fb);
            syncObject.$bindTo($scope, "main.data");

            $scope.$watch('main.data', function () {
                if (main.data) {
//                    ThreeScene.addReports(JSON.parse(reports));
                }
            });

            var stop = ThreeScene.stop;
            /**
             * @type {number}
             */
            main.time = SETUP.MULTIPLIER || 1;
            main.constants = SETUP;
            main.sidebar = true;
            main.active = 0;
            main.lines = [];
            main.showSidebar = true;
            main.showFirebaseData = true;

            main.changeTime = changeTime;
            main.showLine = showLine;

            /**
             * Show active line.
             * @param {number} active
             */
            function showLine(active) {
                main.active = active;
            }

            /**
             * Change the train speed scaler.
             */
            function changeTime() {
                ThreeScene.setMultiplier(main.time);
            }

            /**
             * Bound DOM functions.  I forget why I do this.
             */
            main.init = init;

            /**
             * Initialize the 3D scene
             */
            function init() {
                main.lines = BART.routes;
                ThreeScene.init();
            }
        }
    ]);
