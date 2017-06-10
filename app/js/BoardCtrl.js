'use strict';
angular.module('critical.controllers.boardCtrl', ['ngRoute', 'PubSub', 'ngAnimate'])
    .controller('BoardCtrl', BoardCtrl);

BoardCtrl.$inject = ['$scope', '$routeParams', '$location', '$injector', '$uibModal'];

function BoardCtrl($scope, $routeParams, $location, $injector, $uibModal) {
    var metricService = $injector.get('metricService');

    $scope.cron = {
        key: $routeParams.cronKey
    };

    $scope.scaleOptions = {
        'MONTHS': 'Months',
        'WEEKS': 'Weeks',
        'DAYS': 'Days',
        'HOURS': 'Hours',
        'SECCONDS': 'Secconds'
    };
    $scope.duringOptions = {
        'YEAR': 'Year',
        'MONTH': 'Month',
        'WEEK': 'Week',
        'DAY': 'Day',
        'HOUR': 'Hour'
    };

    $scope.scaleSelected = 'DAYS';
    $scope.duringSelected = 'WEEK';
    $scope.graphicNumTickets = true;
    $scope.graphicAverage = true;

    metricService.getCron($scope.cron.key).then(function (aCron) {
        $scope.cron = aCron;
        $scope.changeScale('DAYS', 'WEEK');
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
        if (scaleSelected) {
            $scope.scaleSelected = scaleSelected;
        }
        if (duringSelected) {
            $scope.duringSelected = duringSelected;
        }

        $scope.colors = [];
        $scope.records = [];
        $scope.labels = [];
        $scope.dataSize = [];
        $scope.dataAverage = [];
        $scope.data = [];
        $scope.datasetOverride = [];
        $scope.series = [];
        $scope.options = [];

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

        if($scope.graphicNumTickets ^ $scope.graphicAverage) {
            $scope.colors = $scope.graphicNumTickets ? ['#cc3300'] : ['#0099ff'];
            $scope.data = $scope.graphicNumTickets ? [$scope.dataSize] : [$scope.dataAverage];
            $scope.datasetOverride = [{yAxisID: 'y-axis-1'}];
            $scope.series = $scope.graphicNumTickets ? ['Number of Tickets'] :['Average'];
            $scope.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            showLine: true,
                            position: 'left'
                        }
                    ]
                }
            };
        }
        if($scope.graphicNumTickets && $scope.graphicAverage) {
            $scope.colors = ['#cc3300', '#0099ff'];
            $scope.data = [$scope.dataSize, $scope.dataAverage];
            $scope.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];
            $scope.series = ['Number of Tickets', 'Average'];
            $scope.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            showLine: true,
                            position: 'left'
                        },
                        {
                            id: 'y-axis-2',
                            type: 'linear',
                            showLine: true,
                            position: 'right'
                        }
                    ]
                }
            };
        }
    };

    $scope.changeKind = function (kind) {
        if (kind === 'COUNT') {
            $scope.graphicNumTickets = !$scope.graphicNumTickets;
        }
        if (kind === 'AVERAGE') {
            $scope.graphicAverage = !$scope.graphicAverage;
        }

        if (!$scope.graphicNumTickets && !$scope.graphicAverage) {
            $location.path('#!/home');
        } else {
            $scope.changeScale();
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
        JSONToCSVConvertor(data, $scope.cron.key);
    };

    function JSONToCSVConvertor(JSONData, fileName) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';
        //Set Report title in first row or line

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
};