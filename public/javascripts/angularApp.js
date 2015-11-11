var app = angular.module('mainApp', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope){
    $scope.test = 'Hello world!';
  }
]);
