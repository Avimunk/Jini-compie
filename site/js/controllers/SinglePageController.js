angular.module('JINI.controllers')
    .controller('SinglePageController', ['$rootScope', '$scope', '$stateParams', '$state', '$http', SinglePageController]);

function SinglePageController($rootScope, $scope, $stateParams, $state, $http) {
    console.log('SinglePageControllerLoaded', $state.params.name)
    $rootScope.clearSearch();
    $rootScope.showCategorySearchBlock = $rootScope.showHomeBanner = $scope.showSearchBlock = $rootScope.top_search_result = $rootScope.center_search_result = $rootScope.category_search_result = false;

    $rootScope.displayHandle.closeAll();
    $scope.pageBlock = true;

    var pageName = $state.params.name;
    $rootScope.isPage = true;
    $rootScope.currentPage = pageName;

    var pages = {};
    if(pages[pageName])
    {
        $scope.pageContent = pages[pageName];
        console.log($scope.pageContent);
    }
    else
    {
        $http.get('/Jini3/data/pages/' + pageName + '.json')
            .then(function(response){
                $scope.pageContent = pages[pageName] = response.data;
                console.log($scope.pageContent);
            });
    }

    if(pageName == 'contact')
    {
        $scope.contact = {};
        $scope.validate = function(form){
            console.log('before', $scope.contact);
            if(form.$valid)
            {
                $scope.save();
            }
        };

        $scope.save = function() {
            var contact = $scope.contact;
            var url = 'https://secure.powerlink.co.il/web/webtocrm.aspx';
            var name = $scope.split2s(contact.name, ' ');
            var data = {
                "firstname" : name[0],
                "lastname" : name[1],
                "telephone1" : contact.phone,
                "emailaddress1" : contact.email,
                "description" : contact.message,
                "leadsourcecode" : 1,
                "contactreason" : contact.reason,
                "ownerid" : "06675580-1b05-4d10-aae9-dabb626a1e75",
            }

            $http.post(url, data).then(function(){ //Success!
                $scope.suceess = true;
                $scope.suceessText = 'The form was successfully submitted, we will contact you shortly';
                console.log('successfully submitted');
            },function(){ //Failed!
                $scope.suceess = false;
                $scope.error = 'There was an error while sending the form, please try again later.';
                console.log('form failed');
            });

        };

        $scope.split2s = function(str, delim) {
            var p=str.indexOf(delim);
            if (p !== -1) {
                return [str.substring(0,p), str.substring(p+1)];
            } else {
                return [str];
            }
        }
    }
};
