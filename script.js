/**
 * Created by Safronov on 11.01.2017.
 */
"use strict";

var storage = localStorage.getItem('toDoList') ? angular.fromJson(localStorage.getItem('toDoList')) : [];

var toDoApp = angular.module('toDoApp', []);
function saveStorage() {
    localStorage.setItem('toDoList', angular.toJson(storage));
}

toDoApp.controller('ToDoCtrl', ['$scope', function ($scope) {

    $scope.orderProperty = 'id';
    $scope.reverse = false;
    $scope.add = function () {
        storage.push({
            'id': +new Date(),
            'title': $scope.title,
            'task': $scope.task,
            'done': false
        });
        $scope.title = '';
        $scope.task = '';
        document.getElementById('title').focus();
        saveStorage();
    };
    $scope.remove = function () {
        var id = this.todo.id;
        angular.forEach(storage, function (value, key) {
            if (id === value.id) {
                storage.splice(key, 1);
                saveStorage();
            }
        });
    };
    $scope.sortOrder = function (order) {
        if ($scope.orderProperty === order) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.orderProperty = order;
        }
    };
    var toDoList = this;
    toDoList.todo = storage;
}]);


toDoApp.directive('editAtPlace', function () {
    return {
        restrict: 'E',
        scope: {value: '=value'},
        template: '<span style="padding-left: 10px" ng-click="edit()" ng-bind="value"></span><input style="max-height: 22px;" ng-model="value">',
        link: function ($scope, element) {
            var inputElement = angular.element(element.children()[1]);
            var self = this;
            element.addClass('edit-at-place');
            $scope.editing = false;

            $scope.edit = function () {
                $scope.lastValue = this.value;
                $scope.editing = true;
                element.addClass('active');
                inputElement[0].focus();
            };
            function endEdit(save) {
                $scope.editing = false;
                element.removeClass('active');
                if (save) {
                    saveStorage();
                }else {
                    $scope.value = $scope.lastValue;
                    $scope.$apply();
                }
            }

            inputElement.prop('onkeydown', function (event) {
                if (event.which == 13) {
                    endEdit(true);
                }
                if (event.which == 27) {
                    endEdit(false);
                }
            });
            inputElement.prop('onblur', function () {
                endEdit(true);
            });
        }
    };
});