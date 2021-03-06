'use strict';
angular.module('critical.services.metricService', [])
    .service('metricService', MetricService);

MetricService.$inject = ['$http', '$q'];

function MetricService($http, $q) {

    var metricSystemHost = 'http://localhost:3000/metrics';

    function login(user) {
        var deferred = $q.defer();

        var urlCreateCron = metricSystemHost + '/login';
        var req;
        req = {
            method: 'POST',
            url: urlCreateCron,
            headers: {
                'Content-Type': 'application/json'
            },
            data: user
        };

        $http(req).then(
            function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    function logout(session) {
        var deferred = $q.defer();

        var urlCreateCron = metricSystemHost + '/logout';
        var req;
        req = {
            method: 'GET',
            url: urlCreateCron,
            headers: {
                'Content-Type': 'application/json',
                'session': session
            }
        };

        $http(req).then(
            function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    /**
     * Get all Cron Fields
     */
    function getAllCronFields() {
        var deferred = $q.defer();

        var urlGetAllCronFields = metricSystemHost + '/all-cron-fields';
        var req;
        req = {
            method: 'GET',
            url: urlGetAllCronFields,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http(req).then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (response) {
                deferred.reject(response.data.msg);
            });
        return deferred.promise;
    };

    /**
     * Get all user Crons
     * @param userName
     */
    function getAllUserCrons(session, page, searchQuery) {
        var deferred = $q.defer();

        var urlGetAllUserCrons = metricSystemHost + '/all-crons' + ((!searchQuery || 0 === searchQuery.length) ? '' : ('?search='+ searchQuery));
        var req;
        req = {
            method: 'GET',
            url: urlGetAllUserCrons,
            headers: {
                'Content-Type': 'application/json',
                'session': session,
                'page': page
            }
        };

        $http(req).then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (response) {
                deferred.reject(response.data.msg);
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
                deferred.reject(response.data.msg);
            });
        return deferred.promise;
    }

    /**
     * Delete cron by key
     * @param cronKey
     */
    function deleteCron(cronKey) {
        var deferred = $q.defer();

        var urlGetCronByKey = metricSystemHost + '/delete?key=' + cronKey;
        var req;
        req = {
            method: 'DELETE',
            url: urlGetCronByKey,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http(req).then(
            function (response) {
                deferred.resolve(response.data.cron);
            },
            function (response) {
                deferred.reject(response.data.msg);
            });
        return deferred.promise;
    }

    function createCron(cron) {
        var deferred = $q.defer();

        delete cron.records;

        var urlCreateCron = metricSystemHost + '/create';
        var req;
        req = {
            method: 'POST',
            url: urlCreateCron,
            headers: {
                'Content-Type': 'application/json'
            },
            data: cron
        };

        $http(req).then(
            function (response) {
                deferred.resolve(response.data.cron);
            },
            function (response) {
                deferred.reject(response.data.msg);
            });
        return deferred.promise;
    }

    function editCron(cron) {
        var deferred = $q.defer();

        delete cron.records;

        var urlCreateCron = metricSystemHost + '/edit';
        var req;
        req = {
            method: 'POST',
            url: urlCreateCron,
            headers: {
                'Content-Type': 'application/json'
            },
            data: cron
        };

        $http(req).then(
            function (response) {
                deferred.resolve(response.data.cron);
            },
            function (response) {
                deferred.reject(response.data.msg);
            });
        return deferred.promise;
    }

    return {
        login: login,
        logout: logout,
        getAllCronFields: getAllCronFields,
        getAllUserCrons: getAllUserCrons,
        getCron: getCron,
        createCron: createCron,
        editCron: editCron,
        deleteCron: deleteCron
    }
};
