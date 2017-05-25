'use strict';
angular.module('critical.controllers.createCtrl', ['ngRoute', 'ngAnimate'])
    .controller('CreateCronCtrl', CreateCronCtrl);

CreateCronCtrl.$inject = ['$scope', '$uibModal', '$injector', '$cookies'];

/**
 * Create Cron Controller
 * @param $scope
 * @param $uibModal
 * @param $injector
 * @constructor
 */
function CreateCronCtrl($scope, $uibModal, $injector, $cookies) {
    var metricService = $injector.get('metricService');

    $scope.username = $cookies.get('metricUsername');
    $scope.kindOptions = ['COUNT', 'AVERAGE'];
    $scope.fieldOptions = ['created', 'resolutiondate'];
    $scope.selectedField;
    
    /**
     * Cron object
     * @type {{key: string, description: string, cron: string, jiraJQL: string}}
     */
    $scope.cron = {
        key: '',
        kind: 'COUNT', // default
        fields: [],
        visibility: false,
        username: $scope.username,
        description: '',
        cron: '',
        jiraJQL: ''
    };

    $scope.addField = function(field) {
        $scope.cron.fields.push(field)
    };

    $scope.clearFields = function() {
        $scope.cron.fields = [];
    };

    /**
     * Submit all form
     */
    $scope.submit = function() {
        if (!$scope.cron.kind === 'AVERAGE') {
            delete $scope.cron.fields;
        }
        metricService.createCron($scope.cron).then(function (result) {
            showMessagePopup('Cron ' + $scope.cron.key + ' created!!!', 'success');
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