'use strict';
angular.module('critical.controllers.headerCtrl', ['ngRoute', 'angularModalService'])
    .controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = ['$scope', 'ModalService'];

function HeaderCtrl($scope, ModalService) {

    $scope.show = function() {
        ModalService.showModal({
            templateUrl: '../templates/popup/modal.html',
            controller: "PopupCtrl"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                $scope.message = "You said " + result;
            });
        });
    };
};