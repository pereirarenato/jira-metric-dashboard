'use strict';
angular.module('critical.controllers.popupCtrl', ['ngRoute'])
    .controller('PopupCtrl', PopupCtrl);

PopupCtrl.$inject = ['$scope', 'close'];

function PopupCtrl($scope, close) {

    $scope.close = function (result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };
}