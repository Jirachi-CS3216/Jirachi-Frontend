var module = angular.module('starter.controllers', []);


module


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})


;

var GOOGLE_MAPE_API_KEY = "AIzaSyBtfTcTsfx5i-jnxresmHLdDlyb5hG4VZA"
