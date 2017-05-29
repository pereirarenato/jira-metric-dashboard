'use strict';
angular.module('critical.controllers.deleteCtrl', ['ngRoute', 'ngAnimate', 'PubSub'])
    .controller('DeleteCronCtrl', DeleteCronCtrl);

DeleteCronCtrl.$inject = ['$scope', '$uibModalInstance', '$uibModal', '$injector', '$location', 'PubSub'];

/**
 * Delete Cron Controller
 * @param $scope
 * @param $uibModal
 * @param $injector
 * @constructor
 */
function DeleteCronCtrl($scope, $uibModalInstance, $uibModal, $injector, $location, PubSub) {
    var metricService = $injector.get('metricService');

    $scope.cron = $scope.$resolve.cron;

    $scope.ok = function(){
        metricService.deleteCron($scope.cron.key).then(function (result) {
            $uibModalInstance.close('save');
            $location.path('#!/home');
            showMessagePopup('Cron ' + $scope.cron.key + ' deleted!!!', 'success');
            PubSub.publish('delete-cron-success');
        }, function (reject) {
            $uibModalInstance.close();
            showMessagePopup(reject, 'danger');
        });
    };

    $scope.cancelModal = function(){
        $uibModalInstance.dismiss('close');
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
    }
};