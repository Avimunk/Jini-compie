angular.module('JINI.controllers')
    .controller('SinglePageController', ['$rootScope', '$scope', '$state', '$http', SinglePageController]);

function SinglePageController($rootScope, $scope, $state, $http) {
    console.log('SinglePageControllerLoaded', $state.params.name)

    // clear the old searches
    $rootScope.clearSearch();

    // close all other views
    $rootScope.showCategorySearchBlock = $rootScope.showHomeBanner = $scope.showSearchBlock = $rootScope.top_search_result = $rootScope.center_search_result = $rootScope.category_search_result = false;
    $rootScope.displayHandle.closeAll();

    // set some scope variables
    $scope.pageBlock = true;
    var pageName = $state.params.name;
    $rootScope.isPage = true;
    $rootScope.currentPage = pageName;

    /**
     * Get the current page data.
     *
     * if already have it return,
     * else http get it.
     */
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

    /**
     * Contact page
     */
    if(pageName == 'contact')
    {
        // set the contact data object
        $scope.contact = {};

        /**
         * Save the form on $valid
         * @param form
         */
        $scope.validate = function(form){
            if(form.$valid)
                $scope.save();
        };

        /**
         * Save the form to the CRM
         */
        $scope.save = function() {
            // set a few data variables.
            var contact = $scope.contact;
            var url = 'https://secure.powerlink.co.il/web/webtocrm.aspx';
            var name = split2s(contact.name, ' ');
            var data = {
                "firstname" : name[0],
                "lastname" : name[1],
                "telephone1" : contact.phone,
                "emailaddress1" : contact.email,
                "description" : contact.message,
                "leadsourcecode" : 1,
                "contactreason" : contact.reason,
                "ownerid" : "06675580-1b05-4d10-aae9-dabb626a1e75",
            };

            /**
             * Post the data to the crm
             *
             * show errors | success to the user
             */
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
    }
};
