'use strict';
angular.module('critical.controllers.boardCtrl', ['ngRoute'])
    .controller('BoardCtrl', BoardCtrl);

BoardCtrl.$inject = ['$scope', '$routeParams', '$injector'];

function BoardCtrl($scope, $routeParams, $injector) {
    var metricService = $injector.get('metricService');

    $scope.cronKey = $routeParams.slug;

    metricService.getCron($scope.cronKey).then(function (cron) {
        $scope.labels = [];
        $scope.data = [[]];
        $scope.series = cron.description;

        // Sort records by createdAt date
        cron.records.sort(function (a, b) {
            a = new Date(a.createdAt);
            b = new Date(b.createdAt);
            return a - b;
        });

        cron.records.forEach(function (c) {
            $scope.labels.push(new Date(c.createdAt).toLocaleString());
            $scope.data[0].push(c.size);
        });
    });

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
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