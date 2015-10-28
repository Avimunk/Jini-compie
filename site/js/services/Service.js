angular.module('JINI.services', [])
    //.factory('messages', ['$http', '$state', messages])
    .factory('pie', pie)
    .factory('fixPie', ['$document', fixPie])

    .factory('CategoryService', ['$http', '$state', '$stateParams', '$rootScope', CategoryService])
    .factory('setScopeService', setScopeService)
;

function setScopeService(){
    return {
        init: function($rootScope, $state, $stateParams, categories){
            console.log('CALL: setScopeService')

            // Store the current state id or Null
            var id = $stateParams.id || 0;

            // set the current breadcrumbs
            $rootScope.currentBreadCrumbs = categories.breadcrumbs[id];

            //
            var currentParent = categories.parents[id];

            if(categories.categories.length && typeof currentParent == 'undefined')
                $state.go('home')

            $rootScope.currentCategories = getCategoriesByParentArray(categories.categories, currentParent.slice())

            if(currentParent.length == 0)
                $rootScope.parentID = null;
            else if(currentParent.length <= 1)
                $rootScope.parentID = 0;
            else
                $rootScope.parentID = currentParent[currentParent.length - 2];

            $rootScope.currentCategories = splitCurrentCategoriesTitle($rootScope.currentCategories);
            return true;
        }
    }
}

function CategoryService($http, $state, $stateParams, $rootScope) {
    var ca = {};

    ca.getCategories = function(){
        $rootScope.isFirst = false;

        if(ca.categoriesData)
            return ca.categoriesData;

        var id = $stateParams.id || 0;
        return ca.categoriesData = $http.get('/Jini3/public/categories/' + id + '/categories').then(function(response){

            if(typeof response.data.parents == 'undefined' || typeof response.data.parents[id] == 'undefined')
                $state.go('home')

            $rootScope.isFirst = true;
            return response.data;
        });
    }

    return ca;
}

function fixPie($document){
    return {
        init: function(cl, isFirst){
            this.rotateCircle(cl);
            this.rotateImage(cl);

            if(isFirst)
                this.openCircle(cl)
        },
        rotateCircle: function(cl){
            var rotation = false;
            switch (cl) {
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
            if(rotation)
            {
                TweenLite.set($document[0].querySelector('#menu'), {
                    rotation: rotation,
                    transformOrigin: "50% 50%"
                })
            }
        },
        rotateImage:function(cl){
            var rotation = false;
            switch (cl) {
                case 2:
                    rotation = -0;
                    break;
                case 3:
                    rotation = 30;
                    break;
                case 5:
                    rotation = 55;
                    break;
                case 4:
                    rotation = 45;
                    break;
                case 6:
                    rotation = 60;
                    break;
                case 7:
                    rotation = 65;
                    break;
                case 8:
                    rotation = 67;
                    break;
                case 9:
                    rotation = 70;
                    break;
                case 10:
                    rotation = 71;
                    break;
            }
            if(rotation)
            {
                TweenLite.set($document[0].querySelector('#featuredImage'), {
                    rotation: rotation,
                    transformOrigin: "50% 50%"
                })
            }
        },
        openCircle:function(cl){
            var length = cl,
                svg = $document[0].querySelector('#menu'),
                items = svg.querySelectorAll('.item'),
                angle = 360 / length;

            var tl = new TimelineLite();
            tl.to(items, 0.2, {scale:1, ease:Back.easeOut.config(4)}, 0.05);
            for(var i=0; i<items.length; i++){
                tl.to(items[i], 0.7, {rotation:-i*angle + "deg"}, 0.35);
            }

            setTimeout(function(){
                for(var i=0; i<items.length; i++){
                    items[i].querySelectorAll('.sector')[0].style.opacity = '0.8';
                    items[i].querySelectorAll('.sector')[0].style.transition = 'all .2s linear';
                }
            },1000)
        }
    }
}

function pie() {

    return {
        '2': {
            global: {
                svgOrigin: "250 250",
                d: 'M365,250 l135,0 A250,250 0 0,0 0.03084187958484108,246.07317067204482 l134.9833453850242,2.1204878370957942 A115,115 0 0,1 365,250',
                x: "280.0154113769531",
                y: "178.03659057617188",
            },
            transform_a: [
                "rotate(0 250 250)",
                "rotate(-180 250 250)",
            ],
            transform_b: [
                "rotate(0 300.0154113769531 198.03659057617188)",
                "rotate(180 250.0154113769531 80.03659057617188)",
            ],
        },
        '3': {
            global: {
                svgOrigin: "250 250",
                d: 'M365,250 l135,0 A250,250 0 0,0 127.27406159621479,32.196547219952635 l66.272006738044,117.61386450122558 A115,115 0 0,1 365,250',
                x: "339.0684509277344",
                y: "77.48664855957031",
            },
            transform_a: [
                "rotate(0 250 250)",
                "rotate(-120 250 250)",
                "rotate(-240 250 250)",
            ],
            transform_b: [
                "rotate(30 359.0684509277344 97.48664855957031)",
                "rotate(-140 359.0684509277344 97.48664855957031)",
                "rotate(-140 359.0684509277344 97.48664855957031)",
            ],
        },
        '4': {
            global: {
                svgOrigin: "250 250",
                d: 'M365,250 l135,0 A250,250 0 0,0 251.96347522217783,0.007710588802581242 l-1.0602766199760367,134.9958362820466 A115,115 0 0,1 365,250',
                x: "355.98175048828125",
                y: "105.00385284423828",
            },
            transform_a: [
                "rotate(0 250 250)",
                "rotate(-90 250 250)",
                "rotate(-180 250 250)",
                "rotate(-270 250 250)",
            ],
            transform_b: [
                "rotate(45 375.98175048828125 125.00385284423828)",
                "rotate(45 375.98175048828125 125.00385284423828)",
                "rotate(-135 375.98175048828125 125.00385284423828)",
                "rotate(45 375.98175048828125 125.00385284423828)",
            ],
        },
        '5': {
            global: {
                svgOrigin: "250 250",
                d: 'M365,250 l135,0 A250,250 0 0,0 328.7466299138262,12.725963752426338 l-42.52318015346617,128.12797957368977 A115,115 0 0,1 365,250',
                x: "382.0361633300781",
                y: "120.26736450195312",
            },
            transform_a: [
                "rotate(0 250 250)",
                "rotate(-72 250 250)",
                "rotate(-144 250 250)",
                "rotate(-216 250 250)",
                "rotate(-288 250 250)",
            ],
            transform_b: [
                "rotate(55 402.0361633300781 140.26736450195312)",
                "rotate(55 402.0361633300781 140.26736450195312)",
                "rotate(-125 402.0361633300781 140.26736450195312)",
                "rotate(-125 402.0361633300781 140.26736450195312)",
                "rotate(55 402.0361633300781 140.26736450195312)",
            ],
        },
        '6': {
            global: {
                svgOrigin: "250 250",
                d: 'M365,250 l135,0 A250,250 0 0,0 376.1319059537548,34.151112348307095 l-68.1112292150276,116.55839933191416 A115,115 0 0,1 365,250',
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
        },
        '7': {
            global: {
                svgOrigin: "250 250",
                d: 'M365,250 l135,0 A250,250 0 0,0 406.7480905992045,55.243649414188354 l-84.64396892357041,105.16842931633829 A115,115 0 0,1 365,250',
                x: "399.1138000488281",
                y: "149.02609252929688",
            },
            transform_a: [
                "rotate(0 250 250)",
                "rotate(-51.42857142857143 250 250)",
                "rotate(-102.85714285714286 250 250)",
                "rotate(-154.28571428571428 250 250)",
                "rotate(-205.71428571428572 250 250)",
                "rotate(-257.14285714285717 250 250)",
                "rotate(-308.57142857142856 250 250)",
            ],
            transform_b: [
                "rotate(65 419.1138000488281 169.02609252929688)",
                "rotate(65 419.1138000488281 169.02609252929688)",
                "rotate(-115 419.1138000488281 169.02609252929688)",
                "rotate(-115 419.1138000488281 169.02609252929688)",
                "rotate(-115 419.1138000488281 169.02609252929688)",
                "rotate(-115 419.1138000488281 169.02609252929688)",
                "rotate(65 419.1138000488281 169.02609252929688)",
            ],
        },
        '8': {
            global: {
                svgOrigin: "250 250",
                d: 'M365,250 l135,0 A250,250 0 0,0 427.4695309138226,73.91886643587344 l-95.8335466934642,95.08381212462837 A115,115 0 0,1 365,250',
                x: "403.3679504394531",
                y: "158.58712768554688",
            },
            transform_a: [
                "rotate(0 250 250)",
                "rotate(-45 250 250)",
                "rotate(-90 250 250)",
                "rotate(-135 250 250)",
                "rotate(-180 250 250)",
                "rotate(-225 250 250)",
                "rotate(-270 250 250)",
                "rotate(-315 250 250)",
            ],
            transform_b: [
                "rotate(67 423.3679504394531 178.58712768554688)",
                "rotate(67 423.3679504394531 178.58712768554688)",
                "rotate(67 423.3679504394531 178.58712768554688)",
                "rotate(-115 423.3679504394531 178.58712768554688)",
                "rotate(-115 423.3679504394531 178.58712768554688)",
                "rotate(-115 423.3679504394531 178.58712768554688)",
                "rotate(67 423.3679504394531 178.58712768554688)",
                "rotate(67 423.3679504394531 178.58712768554688)",
            ],
        },
        '9': {
            global: {
                svgOrigin: "250 250",
                d: 'M365,250 l135,0 A250,250 0 0,0 442.0708808983809,89.97257512876115 l-103.71827568512572,86.41480943046898 A115,115 0 0,1 365,250',
                x: "406.30401611328125",
                y: "166.1788330078125",
            },
            transform_a: [
                "rotate(0 250 250)",
                "rotate(-40 250 250)",
                "rotate(-80 250 250)",
                "rotate(-120 250 250)",
                "rotate(-160 250 250)",
                "rotate(-200 250 250)",
                "rotate(-240 250 250)",
                "rotate(-280 250 250)",
                "rotate(-320 250 250)",
            ],
            transform_b: [
                "rotate(70 426.30401611328125 186.1788330078125)",
                "rotate(70 426.30401611328125 186.1788330078125)",
                "rotate(70 426.30401611328125 186.1788330078125)",
                "rotate(-115 426.30401611328125 186.1788330078125)",
                "rotate(-115 426.30401611328125 186.1788330078125)",
                "rotate(-115 426.30401611328125 186.1788330078125)",
                "rotate(-115 426.30401611328125 186.1788330078125)",
                "rotate(70 426.30401611328125 186.1788330078125)",
                "rotate(70 426.30401611328125 186.1788330078125)",
            ],
        },
        '10': {
            global: {
                svgOrigin: "250 250",
                d: 'M365,250 l135,0 A250,250 0 0,0 452.71489520809337,103.6898114936225 l-109.46604341237042,79.00750179344385 A115,115 0 0,1 365,250',
                x: "408.41387939453125",
                y: "172.33949279785156",
            },
            transform_a: [
                "rotate(0 250 250)",
                "rotate(-36 250 250)",
                "rotate(-72 250 250)",
                "rotate(-108 250 250)",
                "rotate(-144 250 250)",
                "rotate(-180 250 250)",
                "rotate(-216 250 250)",
                "rotate(-252 250 250)",
                "rotate(-288 250 250)",
                "rotate(-324 250 250)",
            ],
            transform_b: [
                "rotate(72 428.41387939453125 192.33949279785156)",
                "rotate(72 428.41387939453125 192.33949279785156)",
                "rotate(72 428.41387939453125 192.33949279785156)",
                "rotate(-109 428.41387939453125 192.33949279785156)",
                "rotate(-109 428.41387939453125 192.33949279785156)",
                "rotate(-109 428.41387939453125 192.33949279785156)",
                "rotate(-109 428.41387939453125 192.33949279785156)",
                "rotate(72 428.41387939453125 192.33949279785156)",
                "rotate(72 428.41387939453125 192.33949279785156)",
                "rotate(72 428.41387939453125 192.33949279785156)",
            ],
        },
    };
}

/*
function messages($http, $state) {
    var messages = {};

    messages.parents = [];
    messages.breadcrumbs = [];
    messages.categories = [];
    messages.currentCategories = [];

    messages.getCurrentBreadCrumbs = function($scope, id){
        $scope.currentBreadCrumbs = messages.breadcrumbs[id];
    }
    messages.add = function($scope, id){
        messages.isFirst = $scope.isFirst = false;

        if(id === undefined)
            id = 0;

        if(messages.categories.length && typeof messages.parents[id] == 'undefined')
            $state.go('home')

        if(messages.categories.length)
        {
            var currentParent = messages.parents[id];
            $scope.currentCategories = messages.currentCategories = getCategoriesByParentArray(messages.categories, currentParent.slice());

            if(currentParent.length == 0)
                $scope.parentID = null;
            else if(currentParent.length <= 1)
                $scope.parentID = 0;
            else
                $scope.parentID = currentParent[currentParent.length - 2];

            $scope.currentCategories = splitCurrentCategoriesTitle($scope.currentCategories);

            // Set the breadcrumbs:
                messages.getCurrentBreadCrumbs($scope, id);
            console.log($scope.currentCategories)
        }
        else
        {
            messages.isFirst = $scope.isFirst = true;
            $http.get("/Jini3/public/categories/"+id+"/categories")
                .success(function(response) {
                    $scope.categories = messages.categories = response.categories;
                    $scope.parents = messages.parents = response.parents;
                    $scope.breadcrumbs = messages.breadcrumbs = response.breadcrumbs;

                    if(typeof response.parents == 'undefined' || typeof response.parents[id] == 'undefined')
                        $state.go('home')

                    var currentParent = response.parents[id];

                    $scope.currentCategories = messages.currentCategories = getCategoriesByParentArray(messages.categories, currentParent.slice());

                    if(currentParent.length == 0)
                        $scope.parentID = null;
                    else if(currentParent.length <= 1)
                        $scope.parentID = 0;
                    else
                        $scope.parentID = currentParent[currentParent.length - 2];

                    $scope.currentCategories = splitCurrentCategoriesTitle($scope.currentCategories);
                    console.log($scope.currentCategories)

                    // Set the breadcrumbs:
                        messages.getCurrentBreadCrumbs($scope, id);

                });
        }

    };

    return messages;
}
*/

function split2s(str, delim) {
    var p=str.indexOf(delim);
    if (p !== -1) {
        return [str.substring(0,p), str.substring(p+1)];
    } else {
        return [str];
    }
}

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function splitCurrentCategoriesTitle(currentCategories){

    for(i in currentCategories)
    {
        var title = replaceAll('/', '', currentCategories[i].title);
        title = replaceAll('-', '', title);
        var titleSplit = split2s(title, ' ');
        currentCategories[i].newTitle = titleSplit.length > 1 ? titleSplit : false;

    }

    return currentCategories;
}

function getCategoriesByParentArray(categories, parentArray) {
    if(parentArray.length != 0)
    {
        for(var j = 0; j < categories.length; j++) {

            if(categories[j].id == parentArray[0]) {
                parentArray.shift()
                if(categories[j].items_count)
                    categories = getCategoriesByParentArray(categories[j].items, parentArray);
                else
                    break;
            }
        }
    }

    return categories;
}