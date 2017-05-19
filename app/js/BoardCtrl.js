'use strict';
angular.module('critical.controllers.boardCtrl', ['ngRoute'])
    .controller('BoardCtrl', BoardCtrl);

BoardCtrl.$inject = ['$scope', '$routeParams', '$injector'];

function BoardCtrl($scope, $routeParams, $injector) {
    $scope.board = $routeParams.slug;
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.series = ['Series A'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 56, 55, 40, 56, 55, 40, 65, 59, 80, 65, 59, 80,
            65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 56, 55, 40, 56, 55, 40, 65, 59, 80, 65, 59, 80]
    ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
            ]
        }
    };
};