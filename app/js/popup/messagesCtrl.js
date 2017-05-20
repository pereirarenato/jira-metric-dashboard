'use strict';
angular.module('critical.controllers.messagesCtrl', ['ngRoute', 'ngAnimate'])
    .controller('MessagesCtrl', MessagesCtrl);

MessagesCtrl.$inject = ['$scope', '$uibModalInstance', '$routeParams'];

function MessagesCtrl($scope, $uibModalInstance, $routeParams) {

    $scope.message= $scope.$resolve.message;
    $scope.type= $scope.$resolve.type;
    
    $scope.getClassMessage = function(){
        var classMessage = 'modal-title alert ';
        if ($scope.type === 'success') {
            classMessage += 'alert-success';
        } else if ($scope.type === 'danger') {
            classMessage += 'alert-danger';
        } else if ($scope.type === 'info') {
            classMessage += 'alert-info';
        } else if ($scope.type === 'warning') {
            classMessage += 'alert-warning';
        }
        return classMessage;
    }

    $scope.ok = function(){
        $uibModalInstance.close('save');
    }
}