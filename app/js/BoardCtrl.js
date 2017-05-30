'use strict';
angular.module('critical.controllers.boardCtrl', ['ngRoute', 'PubSub', 'ngAnimate'])
    .controller('BoardCtrl', BoardCtrl);

BoardCtrl.$inject = ['$scope', '$routeParams', '$location', '$injector', '$uibModal'];

function BoardCtrl($scope, $routeParams, $location, $injector, $uibModal) {
    var metricService = $injector.get('metricService');

    $scope.cron = {
        key: $routeParams.cronKey
    };

    $scope.scaleOptions = ['MONTHS', 'WEEKS','DAYS', 'HOURS', 'SECCONDS'];
    $scope.duringOptions = ['YEAR','MONTH', 'WEEK', 'DAY', 'HOUR'];

    $scope.scaleSelected = 'SECCONDS';
    $scope.duringSelected = 'WEEK';

    metricService.getCron($scope.cron.key).then(function (aCron) {
        $scope.cron = aCron;
        $scope.changeScale('SECCONDS', 'WEEK');
    });

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    $scope.editCron = function () {
        $location.path('/cron/edit/' + $scope.cron.key);
    };

    $scope.deleteCron = function () {
        $uibModal.open({
            templateUrl: '../templates/popup/delete-cron',
            controller :'DeleteCronCtrl',
            resolve: {
                cron: function () {
                    return $scope.cron;
                }
            }
        });
    };

    $scope.changeScale = function (scaleSelected, duringSelected) {
        $scope.scaleSelected = scaleSelected;
        $scope.duringSelected = duringSelected;

        $scope.labels = [];
        $scope.data = [[]];
        $scope.series = $scope.cron.description;

        // Filter by duringSelected
        $scope.records = $scope.cron.records.filter(function(r) {
            var currentTime = new Date();
            var createdAt = new Date(r.createdAt);
            switch ($scope.duringSelected) {
                case 'YEAR':
                    return createdAt > currentTime.setYear(currentTime.getYear() - 1);
                case 'MONTH':
                    return createdAt > currentTime.setMonth(currentTime.getMonth() - 1);
                case 'WEEK':
                    return createdAt > currentTime.setHours(currentTime.getHours() - (7 * 24));
                case 'DAY':
                    return createdAt > currentTime.setHours(currentTime.getHours() - (24));
                case 'HOUR':
                    return createdAt > currentTime.setHours(currentTime.getHours() - 1);
                default:
                    return false;
            }
        });
        // Sort records by createdAt date
        $scope.records.sort(function (a, b) {
            a = new Date(a.createdAt);
            b = new Date(b.createdAt);
            return a - b;
        });

        $scope.records.forEach(function (c) {
            $scope.labels.push(new Date(c.createdAt).toLocaleString());
            if ($scope.cron.kind === 'COUNT') {
                $scope.data[0].push(c.size);
            } else {
                switch ($scope.scaleSelected) {
                    case 'MONTHS':
                        $scope.data[0].push((c.size / 2592000));
                        break;
                    case 'WEEKS':
                        $scope.data[0].push((c.size / 604800));
                        break;
                    case 'DAYS':
                        $scope.data[0].push((c.size / 86400));
                        break;
                    case 'HOURS':
                        $scope.data[0].push((c.size / 3600));
                        break;
                    case 'SECCONDS':
                        $scope.data[0].push(c.size);
                        break;
                    default:
                        $scope.data[0].push(c.size);
                        break;
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