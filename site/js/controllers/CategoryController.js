angular.module('JINI.controllers')
.controller('CategoryController', CategoryController);

CategoryController.$inject = ['$scope', '$stateParams', '$http', 'messages'];

function CategoryController($scope, $stateParams, $http, messages) {
    console.log('CategoryControllerLoaded. ID:', $stateParams.id)

    messages.add($scope, $stateParams.id);

    if(messages.categories.length != 0)
        $scope.categories = messages.categories;

    $scope.resetPie = function(messages){
        var resetPie;
        var svg = $document[0].querySelector('#menu');

        resetPie.do = function(){
            var rotation = null;
            switch (messages.categories.length) {
                case 3:
                    rotation = -30;
                    break;
                case 4:
                    rotation = -45;
                    break;
                case 5:
                    rotation = -55;
                    break;
                case 6:
                    rotation = -60;
                    break;
                case 7:
                    rotation = -65;
                    break;
                case 8:
                    rotation = -67;
                    break;
                case 9:
                    rotation = -70;
                    break;
                case 10:
                    rotation = -71;
                    break;
            }

            if (rotation) {
                TweenLite.set(svg, {
                    rotation: rotation,
                    transformOrigin: "50% 50%"
                })


                TweenLite.set(img, {
                    rotation: rotation * -1,
                    transformOrigin: "50% 50%"
                })
            }
        };

        return resetPie;
    };

    $scope.pie = {
      '6': {
          global: {
            svgOrigin: "250 250",
            d: "M365,250 l135,0 A250,250 0 0,0 376.1319059537548,34.151112348307095 l-68.1112292150276,116.55839933191416 A115,115 0 0,1 365,250",
            x: "392.6246337890625",
            y: "136.67543029785156",
          },
          transform_a: [
              "rotate(0 250 250)",
              "rotate(-60 250 250)",
              "rotate(-120 250 250)",
              "rotate(-180 250 250)",
              "rotate(-240 250 250)",
              "rotate(-300 250 250)",
          ],
          transform_b: [
              "rotate(60 412.6246337890625 156.67543029785156)",
              "rotate(60 412.6246337890625 156.67543029785156)",
              "rotate(-120 412.6246337890625 156.67543029785156)",
              "rotate(-120 412.6246337890625 156.67543029785156)",
              "rotate(-120 412.6246337890625 156.67543029785156)",
              "rotate(60 412.6246337890625 156.67543029785156)",
          ],
      }
    };

};
