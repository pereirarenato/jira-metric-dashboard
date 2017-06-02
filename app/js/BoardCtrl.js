'use strict';
angular.module('critical.controllers.boardCtrl', ['ngRoute', 'PubSub', 'ngAnimate'])
    .controller('BoardCtrl', BoardCtrl);

BoardCtrl.$inject = ['$scope', '$routeParams', '$location', '$injector', '$uibModal', '$document'];

function BoardCtrl($scope, $routeParams, $location, $injector, $uibModal, $document) {
    var metricService = $injector.get('metricService');

    $scope.cron = {
        key: $routeParams.cronKey
    };

    $scope.scaleOptions = ['MONTHS', 'WEEKS','DAYS', 'HOURS', 'SECCONDS'];
    $scope.duringOptions = ['YEAR','MONTH', 'WEEK', 'DAY', 'HOUR'];

    $scope.scaleSelected = 'SECCONDS';
    $scope.duringSelected = 'WEEK';

    $scope.colors = ['#cc3300', '#0099ff'];

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
        $scope.dataSize = [];
        $scope.dataAverage = [];
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
                $scope.dataSize.push(c.size);
            } else {
                $scope.dataSize.push(c.size);
                if (!c.average) {
                    $scope.dataAverage.push(c.average);
                } else {
                    switch ($scope.scaleSelected) {
                        case 'MONTHS':
                            $scope.dataAverage.push((c.average / 2592000).toFixed(2));
                            break;
                        case 'WEEKS':
                            $scope.dataAverage.push((c.average / 604800).toFixed(2));
                            break;
                        case 'DAYS':
                            $scope.dataAverage.push((c.average / 86400).toFixed(2));
                            break;
                        case 'HOURS':
                            $scope.dataAverage.push((c.average / 3600).toFixed(2));
                            break;
                        case 'SECCONDS':
                            $scope.dataAverage.push(c.average.toFixed(2));
                            break;
                        default:
                            $scope.dataAverage.push(c.average.toFixed(2));
                            break;
                    }
                }
            }
        });

        if($scope.cron.kind === 'COUNT') {
            $scope.data = [$scope.dataSize];
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
        } else {
            $scope.data = [$scope.dataSize, $scope.dataAverage];
            $scope.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];
            $scope.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            label: 'Number of Tickets',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        },
                        {
                            id: 'y-axis-2',
                            label: 'Average',
                            type: 'linear',
                            display: true,
                            position: 'right'
                        }
                    ]
                }
            };
        }
    };

    $scope.downloadCron = function () {
        var dataString;
        var samplesYSize = $scope.data[0].slice();
        var samplesYAverage = $scope.data[1].slice();
        var samplesTimestamp = $scope.labels.slice();
        var data;
        if($scope.cron.kind === 'COUNT') {
            data = [samplesYSize, samplesTimestamp];
        } else {
            data = [samplesYSize, samplesYAverage, samplesTimestamp];
        }
        var csvContent = "dataSize:text/csv;charset=utf-8,";
        for (var i = 0, total = data.length; i < total; i++) {
            dataString = data[i].join(",");
            csvContent += i < data.length ? dataString+ "\n" : dataString;
        }
        var encodedUri = encodeURI(csvContent);
        var link = angular.element('<a>')[0];
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", $scope.cron.key + '.csv');
        $document[0].body.appendChild(link); // Required for FF

        link.click();
    };
};