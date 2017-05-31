'use strict';
angular.module('critical.controllers.homeCtrl', ['ngRoute', 'PubSub'])
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$scope', '$location', '$injector', 'PubSub', '$cookies'];

function HomeCtrl($scope, $location, $injector, PubSub, $cookies) {
    var metricService = $injector.get('metricService');

    $scope.username = $cookies.get('metricUsername');
    $scope.session = $cookies.get('metricSessionId');
    $scope.pages = [];
    $scope.currentPage = 0;
    $scope.searchQuery = '';

    $scope.getCronUrl = function (cron) {
        return cron.key ? "#!/board/" + cron.key.replace(/[^a-zA-Z0-9-_]/g, '') : "#!/home";
    };

    $scope.createCron = function () {
        $location.path('/cron/create');
    };

    $scope.getCronsFromPage = function (page) {
        $scope.currentPage = page;
        loadAllCrons($scope.session, $scope.currentPage, $scope.searchQuery);
    };

    $scope.getNextPage = function () {
        if($scope.currentPage < $scope.pages.length) {
            $scope.currentPage++;
            loadAllCrons($scope.session, $scope.currentPage, $scope.searchQuery);
        }
    };

    $scope.getPreviousPage = function () {
        if($scope.currentPage > 0) {
            $scope.currentPage--;
            loadAllCrons($scope.session, $scope.currentPage, $scope.searchQuery);
        }
    };

    $scope.searchCrons = function (searchQuery) {
        $scope.searchQuery = searchQuery.trim();
        $scope.currentPage = 0;
        loadAllCrons($scope.session, $scope.currentPage, searchQuery.trim());
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

    var loadAllCrons = function(session, page, searchQuery) {
        metricService.getAllUserCrons(session, page, searchQuery).then(function (data) {
            $scope.userCronList = data.crons;
            $scope.pages = Array.apply(null, {length: Math.ceil(data.total / 10)}).map(Number.call, Number)
        });
    };

    loadAllCrons($scope.session, $scope.currentPage);
};