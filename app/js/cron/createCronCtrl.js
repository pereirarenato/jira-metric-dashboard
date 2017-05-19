'use strict';
angular.module('critical.controllers.createCtrl', ['ngRoute'])
    .controller('CreateCronCtrl', CreateCronCtrl);

CreateCronCtrl.$inject = ['$scope', '$routeParams', '$injector'];

function CreateCronCtrl($scope, $routeParams, $injector) {
    var metricService = $injector.get('metricService');

    $scope.cron = {
        key: '',
        description: '',
        cron: '',
        jiraJQL: ''
    };

    $scope.submit = function() {
        metricService.createCron($scope.cron).then(function (result) {
            $scope.openLogin = function() {
                $uibModal.open({
                    templateUrl: '../templates/popup/login.html',
                    controller :'LoginCtrl',
                    message: result.cron.message
                });
            }
        })
    }
};