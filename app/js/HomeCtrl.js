'use strict';
angular.module('critical.controllers.homeCtrl', ['ngRoute', 'PubSub'])
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$scope', '$location', '$injector', 'PubSub', '$cookies'];

function HomeCtrl($scope, $location, $injector, PubSub, $cookies) {
    var metricService = $injector.get('metricService');

    $scope.username = $cookies.get('metricUsername');
    $scope.session = $cookies.get('metricSessionId');

    $scope.getCronUrl = function (cron) {
        return cron.key ? "#!/board/" + cron.key.replace(/[^a-zA-Z0-9-_]/g, '') : "#!/home";
    };

    $scope.createCron = function () {
        $location.path('/cron/create');
    };

    PubSub.subscribe('login-success', function (data) {
        $scope.username = data.username;
        $scope.session = data.session;
        loadAllCrons($scope.session);
    });

    PubSub.subscribe('logout-success', function () {
        loadAllCrons();
    });

    PubSub.subscribe('create-cron-success', function () {
        loadAllCrons($scope.session);
    });

    PubSub.subscribe('edit-cron-success', function () {
        loadAllCrons($scope.session);
    });

    PubSub.subscribe('delete-cron-success', function () {
        loadAllCrons($scope.session);
    });

    var loadAllCrons = function(session) {
        metricService.getAllUserCrons(session).then(function (crons) {
            $scope.userCronList = crons;
        });
    };

    loadAllCrons($scope.session);
};