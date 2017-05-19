'use strict';
angular.module('critical.controllers.homeCtrl', ['ngRoute'])
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$scope', '$location', '$injector'];

function HomeCtrl($scope, $location, $injector) {
    var metricService = $injector.get('metricService');

    $scope.getCronUrl = function (cron) {
        return "#!/board/" + cron.key.replace(/[^a-zA-Z0-9-_]/g, '');
    };

    $scope.createCron = function () {
        $location.path('/cron/create');
    };

    var cronsPromise = metricService.getAllUserCrons('eu');

    cronsPromise.then(function (crons) {
        $scope.userCronList = crons;
    });
};