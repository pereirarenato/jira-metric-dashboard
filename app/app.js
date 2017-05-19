'use strict';
// Declare app level module which depends on templates, and components
angular.module('critical', [
    'ngRoute',
    'ngSanitize',
    'chart.js',
    'ngAnimate',
    'ui.bootstrap',
    'angularModalService',
    'critical.controllers.headerCtrl',
    'critical.controllers.homeCtrl',
    'critical.controllers.boardCtrl',
    'critical.controllers.loginCtrl'
]).config(
    [
        '$locationProvider',
        '$routeProvider',
        function ($locationProvider, $routeProvider) {

            $locationProvider.hashPrefix('!');

            $routeProvider.when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }).when('/board/:slug', {
                templateUrl: 'templates/board.html',
                controller: 'BoardCtrl'
            }).otherwise({redirectTo: '/home'});
        }
    ]
);
