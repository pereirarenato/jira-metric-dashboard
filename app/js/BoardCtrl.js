'use strict';
angular.module('critical.controllers.boardCtrl', ['ngRoute', 'PubSub', 'ngAnimate'])
    .controller('BoardCtrl', BoardCtrl);

BoardCtrl.$inject = ['$scope', '$routeParams', '$location', '$injector', '$uibModal'];

function BoardCtrl($scope, $routeParams, $location, $injector, $uibModal) {
    var metricService = $injector.get('metricService');

    $scope.cron = {
        key: $routeParams.cronKey
    };

    metricService.getCron($scope.cron.key).then(function (aCron) {

        $scope.cron = aCron;

        $scope.labels = [];
        $scope.data = [[]];
        $scope.series = $scope.cron.description;

        // Sort records by createdAt date
        $scope.cron.records.sort(function (a, b) {
            a = new Date(a.createdAt);
            b = new Date(b.createdAt);
            return a - b;
        });

        $scope.cron.records.forEach(function (c) {
            $scope.labels.push(new Date(c.createdAt).toLocaleString());
            $scope.data[0].push(c.size);
        });
    });

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    $scope.editCron = function () {
        $location.path('/cron/edit/' + $scope.cron.key);
    };

    $scope.deleteCron = function () {
        $uibModal.open({
            templateUrl: '../templates/cron/delete-cron',
            controller :'DeleteCronCtrl',
            resolve: {
                cron: function () {
                    return $scope.cron;
                        message
                }
            }
        });
    };

    $scope.datasetOverride = [{yAxisID: 'y-axis-1'}];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
};