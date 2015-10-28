angular.module('JINI.controllers')
    .controller('CategoryController', ['$rootScope', '$scope', '$stateParams', '$http', CategoryController]);

function CategoryController($rootScope, $scope, $stateParams, $http) {
    console.log('CategoryControllerLoaded. ID:', $stateParams.id)

    $scope.currentID = $stateParams.id;
};
