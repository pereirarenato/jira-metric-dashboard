'use strict';
angular.module('critical.controllers.createCtrl', ['ngRoute', 'ngAnimate'])
    .controller('CreateCronCtrl', CreateCronCtrl);

CreateCronCtrl.$inject = ['$scope', '$uibModal', '$injector'];

/**
 * Create Cron Controller
 * @param $scope
 * @param $uibModal
 * @param $injector
 * @constructor
 */
function CreateCronCtrl($scope, $uibModal, $injector) {
    var metricService = $injector.get('metricService');

    /**
     * Cron object
     * @type {{key: string, description: string, cron: string, jiraJQL: string}}
     */
    $scope.cron = {
        key: '',
        description: '',
        cron: '',
        jiraJQL: ''
    };

    /**
     * Submit all form
     */
    $scope.submit = function() {
        metricService.createCron($scope.cron).then(function (result) {
            showMessagePopup('Cron ' + result.key + ' created!!!', 'success');
        }, function (reject) {
            showMessagePopup(reject, 'danger');
        });
    }

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