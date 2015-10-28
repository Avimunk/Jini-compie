angular.module('JINI.controllers')
    .controller('HomeController', ['$scope', 'pie', HomeController]);


function HomeController($scope, pie) {
    console.log('HomeController!')
    $scope.pie = pie;
};
