angular.module('SFUnderground.controller.main', ['SFUnderground.3D'])
    .controller('MainController', [
        '$scope',
        'ThreeScene',
        function ($scope, ThreeScene) {
            $scope.test = 'working';
            ThreeScene.init();
        }
    ]);