angular.module('SFUnderground.controller.main', ['SFUnderground.3D'])
    .controller('MainController', [
        '$location',
        'ThreeScene',
        function ($location, ThreeScene) {

            var main = this;

            main.time = 2;

            main.changeTime = function (number) {
                ThreeScene.setMultiplier(number);
            };

            main.init = function () {
                ThreeScene.init();
                main.changeTime();
            };

            main.prevent = function(e){
                e.preventDefault();
            }
        }
    ]);
