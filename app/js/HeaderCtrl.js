'use strict';
angular.module('critical.controllers.headerCtrl', ['ngRoute', 'ngAnimate'])
    .controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = ['$scope', '$uibModal'];

function HeaderCtrl($scope, $uibModal) {

    $scope.openLogin = function() {
        $uibModal.open({
            templateUrl: '../templates/popup/login.html',
            controller :'LoginCtrl'
        });
    }
};