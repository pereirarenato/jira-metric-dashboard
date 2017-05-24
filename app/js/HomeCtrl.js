'use strict';
angular.module('critical.controllers.homeCtrl', ['ngRoute', 'PubSub'])
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$scope', '$location', '$injector', 'PubSub', '$cookies'];

function HomeCtrl($scope, $location, $injector, PubSub, $cookies) {
    var metricService = $injector.get('metricService');

    $scope.username = $cookies.get('metricUsername');

    $scope.getCronUrl = function (cron) {
        return cron.key ? "#!/board/" + cron.key.replace(/[^a-zA-Z0-9-_]/g, '') : "#!/home";
    };

    $scope.createCron = function () {
        $location.path('/cron/create');
    };

    PubSub.subscribe('login-success', function (data) {
        $scope.username = data.username;
        loadAllCrons($scope.username);
    });

    var loadAllCrons = function(username) {
        metricService.getAllUserCrons(username).then(function (crons) {
            $scope.userCronList = crons;
        });
    };

    loadAllCrons($scope.username);
};