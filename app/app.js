'use strict';
// Declare app level module which depends on templates, and components
angular.module('critical', [
    'ngRoute',
    'ngSanitize',
    'chart.js',
    'ngAnimate',
    'ngCookies',
    'ui.bootstrap',
    'PubSub',
    'angularModalService',
    'critical.controllers.headerCtrl',
    'critical.controllers.homeCtrl',
    'critical.controllers.boardCtrl',
    'critical.controllers.loginCtrl',
    'critical.controllers.messagesCtrl',
    'critical.controllers.createCtrl',
    'critical.controllers.editCtrl',
    'critical.controllers.deleteCtrl',
    'critical.services.metricService'
]).config(
    [
        '$locationProvider',
        '$routeProvider',
        function ($locationProvider, $routeProvider) {

            $locationProvider.hashPrefix('!');

            $routeProvider.when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }).when('/board/:cronKey', {
                templateUrl: 'templates/board.html',
                controller: 'BoardCtrl'
            }).when('/cron/create', {
                templateUrl: 'templates/cron/create-cron.html',
                controller: 'CreateCronCtrl'
            }).when('/cron/edit/:cronKey', {
                templateUrl: 'templates/cron/edit-cron.html',
                controller: 'EditCronCtrl'
            }).otherwise({redirectTo: '/home'});
        }
    ]
);
