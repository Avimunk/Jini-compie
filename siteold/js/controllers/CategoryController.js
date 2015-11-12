angular.module('JINI.controllers')
    .controller('CategoryController', ['$rootScope', '$scope', '$stateParams', '$state', '$http', CategoryController]);

function CategoryController($rootScope, $scope, $stateParams, $state, $http) {
    console.log('CategoryControllerLoaded. ID:', $stateParams.id)
    console.log('CategoryController', $state.current)
    $scope.currentID = $stateParams.id;
};
