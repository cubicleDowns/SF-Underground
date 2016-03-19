
angular.module('SFUnderground.controllers', [
    'SFUnderground.controller.main'
]);

angular.module('SFUnderground.services', [
    'SFUnderground.service.api'
]);

angular.module('SFUnderground.3D', [
    'SFUnderground.3D.scene'
]);

angular.module( 'SFUnderground', [
    'ngMaterial',
    'SFUnderground.constants',
    'SFUnderground.controllers',
    'SFUnderground.services',
    'SFUnderground.3D',
    'firebase'
] );
