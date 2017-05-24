'use strict';
angular.module('critical.controllers.headerCtrl', ['ngRoute', 'ngAnimate', 'PubSub'])
    .controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = ['$scope', '$uibModal', 'PubSub', '$cookies', '$location'];

function HeaderCtrl($scope, $uibModal, PubSub, $cookies, $location) {
    $scope.username = $cookies.get('metricUsername');
    $scope.sessionId = $cookies.get('metricSessionId');
    $scope.logedIn = !($scope.sessionId == null);

    $scope.openLogin = function() {
        $uibModal.open({
            templateUrl: '../templates/popup/login.html',
            controller :'LoginCtrl'
        });
    };

    $scope.logout = function() {
        $cookies.remove('metricUsername');
        $cookies.remove('metricSessionId');
        $scope.username = undefined;
        $scope.sessionId = undefined;
        $scope.logedIn = false;
        $location.path('#!/home');
    };

    PubSub.subscribe('login-success', function (data) {
        $scope.logedIn = true;
        $scope.username = data.username;
        $scope.sessionId = data.sessionId;
    });
};