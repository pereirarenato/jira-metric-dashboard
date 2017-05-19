'use strict';
angular.module('critical.services.metricService', [])
    .service('metricService', MetricService);

MetricService.$inject = ['$http', '$q'];

function MetricService($http, $q) {

    var metricSystemHost = 'http://localhost:3000/metrics';

    /**
     * Get all user Crons
     * @param userName
     */
    function getAllUserCrons(userName) {
        var deferred = $q.defer();

        var urlGetAllUserCrons = metricSystemHost + '/all-crons';
        var req;
        req = {
            method: 'GET',
            url: urlGetAllUserCrons,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http(req).then(
            function (response) {
                deferred.resolve(response.data.crons);
            },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    /**
     * Get cron by key
     * @param cronKey
     */
    function getCron(cronKey) {
        var deferred = $q.defer();

        var urlGetCronByKey = metricSystemHost + '/cron?key=' + cronKey;
        var req;
        req = {
            method: 'GET',
            url: urlGetCronByKey,
            headers: {
                'Content-Type': 'application/json'
            },
        };

        $http(req).then(
            function (response) {
                deferred.resolve(response.data.cron);
            },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    }

    function createCron(cron) {
        var deferred = $q.defer();

        var urlCreateCron = metricSystemHost + '/create';
        var req;
        req = {
            method: 'POST',
            url: urlCreateCron,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http(req, cron).then(
            function (response) {
                deferred.resolve(response.data.cron);
            },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    }

    return {
        getAllUserCrons: getAllUserCrons,
        getCron: getCron,
        createCron: createCron
    }
};
