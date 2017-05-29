'use strict';
angular.module('critical.controllers.cronCtrl', ['ngRoute', 'ngAnimate', 'PubSub'])
    .controller('CronCtrl', CronCtrl);

CronCtrl.$inject = ['$scope', '$route', '$routeParams', '$uibModal', '$injector', '$cookies', 'PubSub'];

/**
 * Create Cron Controller
 * @param $scope
 * @param $uibModal
 * @param $injector
 * @constructor
 */
function CronCtrl($scope, $route, $routeParams, $uibModal, $injector, $cookies, PubSub) {
    var metricService = $injector.get('metricService');

    $scope.action = $route.current.$$route.action;
    $scope.username = $cookies.get('metricUsername');
    $scope.kindOptions = ['COUNT', 'AVERAGE'];
    $scope.fieldOptions = ['created', 'resolutiondate'];
    $scope.selectedField;

    function initCron() {
        switch ($scope.action) {
            case 'CREATE':
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
                break;
            case 'EDIT':
                metricService.getCron($routeParams.cronKey).then(function (aCron) {
                    $scope.cron = aCron;
                    $scope.cron.keyToUpdate = aCron.key;
                });
                break;
            case 'DELETE':
                break;
            default:
                break;
        }
    }

    initCron();

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
        switch ($scope.action) {
            case 'CREATE':
                metricService.createCron($scope.cron).then(function (result) {
                    showMessagePopup('Cron ' + $scope.cron.key + ' created!!!', 'success');
                    PubSub.publish('crete-cron-success');
                }, function (reject) {
                    showMessagePopup(reject, 'danger');
                });
                break;
            case 'EDIT':
                metricService.editCron($scope.cron).then(function (result) {
                    showMessagePopup('Cron ' + $scope.cron.key + ' edited!!!', 'success');
                    PubSub.publish('edit-cron-success');
                }, function (reject) {
                    showMessagePopup(reject, 'danger');
                });
                break;
            case 'DELETE':
                PubSub.publish('delete-cron-success');
                break;
            default:
                break;
        }
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