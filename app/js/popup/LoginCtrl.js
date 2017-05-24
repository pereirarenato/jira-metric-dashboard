'use strict';
angular.module('critical.controllers.loginCtrl', ['ngRoute', 'ngAnimate', 'PubSub'])
    .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$uibModalInstance', '$injector', '$cookies', 'PubSub', '$timeout'];

function LoginCtrl($scope, $uibModalInstance, $injector, $cookies, PubSub, $timeout) {
    var metricService = $injector.get('metricService');

    $scope.username = $cookies.get('metricUsername');
    $scope.sessionId = $cookies.get('metricSessionId');
    $scope.password;
    $scope.errorMessages;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    };

    $scope.ok = function () {
        metricService.login({
            username: $scope.username,
            password: $scope.password
        }).then(function (response) {
            if (response.status === 200 && !response.data.errorMessages) {
                $scope.sessionId = response.data.session.value;
                $cookies.put('metricUsername', $scope.username);
                $cookies.put('metricSessionId', $scope.sessionId);
                delete $scope.errorMessages;

                PubSub.publish('login-success', {
                    username: $scope.username,
                    session: $scope.sessionId
                });

                $uibModalInstance.close('save');
            } else {
                $scope.errorMessages = response.data.errorMessages[0];
                $timeout(function () {
                    $scope.errorMessages = undefined;
                }, 3000);
            }
        });
    };
}