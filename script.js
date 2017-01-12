/**
 * Created by Safronov on 11.01.2017.
 */
"use strict";

var storage = localStorage.getItem('toDoList') ? angular.fromJson(localStorage.getItem('toDoList')) : [];

var toDoApp = angular.module('toDoApp', []);
function saveStorage() {
    localStorage.setItem('toDoList', angular.toJson(storage));
};
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
        scope: {value: '='},
        template: '<span ng-click="edit()" ng-bind="value"></span><input style="max-height: 22px;" ng-model="value">',
        link: function ($scope, element) {
            var inputElement = angular.element(element.children()[1]);

            element.addClass('edit-at-place');
            $scope.editing = false;

            $scope.edit = function () {
                $scope.editing = true;
                element.addClass('active');
                inputElement[0].focus();
            };

            inputElement.prop('onblur', function () {
                $scope.editing = false;
                element.removeClass('active');
                saveStorage();
            });
        }
    };
});