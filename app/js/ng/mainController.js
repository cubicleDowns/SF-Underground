angular.module('SFUnderground.controller.main', ['SFUnderground.3D'])
    .controller('MainController', [
        '$scope',
        '$location',
        '$firebaseObject',
        'ThreeScene',
        'SETUP',
        'ALERTS',
        'BART',
        function ($scope, $location, $firebaseObject, ThreeScene, SETUP, ALERTS, BART) {

            var main = this;

            var fb = new Firebase("https://sf-noise.firebaseio.com");
            var syncObject = $firebaseObject(fb);
            syncObject.$bindTo($scope, "main.data");

            /**
             * @type {number}
             */
            main.time = SETUP.MULTIPLIER || 1;
            main.constants = SETUP;
            main.alert_types = ALERTS;
            main.routes = BART.routes;
            main.selected = {
                'event': '',
                'route': -1
            };


            /**
             * Bound functions
             */
            main.sendAlert = sendAlert;
            main.changeTime = changeTime;
            main.init = init;

            /**
             * Send and alert containing the route ID and alert type.
             */
            function sendAlert() {

                /**
                 * If the data structure doesn't exist, go ahead and create it.
                 */
                if (!this.data.alerts) {
                    this.data.alerts = [];
                }

                if (main.selected.event && main.selected.route > -1) {
                    this.data.alerts.push(main.selected);
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
