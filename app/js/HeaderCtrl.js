'use strict';
angular.module('critical.controllers.headerCtrl', ['ngRoute', 'ngAnimate', 'PubSub'])
    .controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = ['$scope', '$uibModal', 'PubSub', '$cookies', '$location', '$injector'];

function HeaderCtrl($scope, $uibModal, PubSub, $cookies, $location, $injector) {
    var metricService = $injector.get('metricService');

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
        var session = $cookies.get('metricSessionId')
        metricService.logout(session).then(function (result) {
            $cookies.remove('metricUsername');
            $cookies.remove('metricSessionId');
            $scope.username = undefined;
            $scope.sessionId = undefined;
            $scope.logedIn = false;
            $location.path('#!/home');

            PubSub.publish('logout-success');
        });
    };

    PubSub.subscribe('login-success', function (data) {
        $scope.logedIn = true;
        $scope.username = data.username;
        $scope.sessionId = data.sessionId;
    });
};