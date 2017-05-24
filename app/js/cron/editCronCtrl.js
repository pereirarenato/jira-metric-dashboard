'use strict';
angular.module('critical.controllers.editCtrl', ['ngRoute', 'ngAnimate', 'PubSub'])
    .controller('EditCronCtrl', EditCronCtrl);

EditCronCtrl.$inject = ['$scope', '$routeParams', '$uibModal', '$injector', 'PubSub'];

/**
 * Edit Cron Controller
 * @param $scope
 * @param $uibModal
 * @param $injector
 * @constructor
 */
function EditCronCtrl($scope, $routeParams, $uibModal, $injector, PubSub) {
    var metricService = $injector.get('metricService');

    $scope.cron = {
        key: $routeParams.cronKey
    };

    metricService.getCron($scope.cron.key).then(function (aCron) {
        $scope.cron = aCron;
        $scope.cron.keyToUpdate = aCron.key;
    });

    /**
     * Submit all cronForm
     */
    $scope.submit = function() {
        metricService.editCron($scope.cron).then(function (result) {
            showMessagePopup('Cron ' + result.key + ' created!!!', 'success');
        }, function (reject) {
            showMessagePopup(reject, 'danger');
        });
    };

    /**
     * Show Popup message
     * @param message
     * @param messageType
     */
    var showMessagePopup = function(message, messageType) {
        $uibModal.open({
            templateUrl: '../templates/popup/messages.html',
            controller :'MessagesCtrl',
            resolve: {
                message: function() {
                    return message
                },
                type: function () {
                    return messageType
                }
            }
        });
    };
};