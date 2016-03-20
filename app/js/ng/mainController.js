angular.module('SFUnderground.controller.main', ['SFUnderground.3D'])
    .controller('MainController', [
        '$scope',
        '$location',
        '$firebaseObject',
        'ThreeScene',
        function ($scope, $location, $firebaseObject, ThreeScene) {

            var main = this;

            var fb = new Firebase("https://sf-noise.firebaseio.com");
            var syncObject = $firebaseObject(fb);
            syncObject.$bindTo($scope, "main.data");


            main.time = 1;

            main.changeTime = changeTime;

            /**
             * Change the train speed scaler.
             */
            function changeTime() {
                ThreeScene.setMultiplier(main.time);
            }


            /**
             * Initialize the 3D scene
             */
            main.init = function () {
                ThreeScene.init();
            };
        }
    ]);
