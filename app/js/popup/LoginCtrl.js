'use strict';
angular.module('critical.controllers.loginCtrl', ['ngRoute', 'ngAnimate'])
    .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$uibModalInstance'];

function LoginCtrl($scope, $uibModalInstance) {

    $scope.cancelModal = function(){
        $uibModalInstance.dismiss('close');
    }

    $scope.ok = function(){
        $uibModalInstance.close('save');
    }
}