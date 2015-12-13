angular.module('JINI.services', [])
    .factory('pie', pie)
    .factory('fixPie', ['$document', fixPie])
    .factory('CategoryService', ['$http', '$state', '$rootScope', CategoryService])
    .factory('setScopeService', setScopeService)
    .factory('objectService', ['$http', objectService])
;

/**
 * Set the scope.
 * @returns {{init: Function}}
 */
function setScopeService(){
    return {
        /**
         * This is the initial function for every route
         *
         * will set the categories and info about current item to the scope.
         * @param $rootScope
         * @param $state
         * @param $stateParams
         * @param categories
         * @returns {boolean}
         */
        init: function($rootScope, $state, $stateParams, categories){
            console.log('CALL: setScopeService')

            // Store the current state id or Null
            var id = $stateParams.id || 0;

            // set the current breadcrumbs
            $rootScope.currentBreadCrumbs = categories.breadcrumbs[id];

            // set the current parents array
            var currentParent = categories.parents[id];

            // if no categories and no parents go to home
            if(categories.categories.length && typeof currentParent == 'undefined')
                $state.go('home');

            // set the categories to the scope.
            $rootScope.currentCategories = getCategoriesByParentArray(categories.categories, currentParent.slice());
            $rootScope.currentCategoriesLength = Object.keys($rootScope.currentCategories).length;
            console.log("$rootScope.currentCategories:", $rootScope.currentCategories);

            // set the current item and item type to the scope.
            $rootScope.currentItem = getCurrentCategoryByParentArray(categories.categories, currentParent.slice());
            if(id != 0)
                $rootScope.currentItem.type = 'category';
            console.log('$rootScope.currentItem',$rootScope.currentItem);


            // Get the current parent data (for the back button)
            if(currentParent.length == 0)
                $rootScope.parentID = null;
            else if(currentParent.length <= 1)
                $rootScope.parentID = 0;
            else
            {
                itemParents = categories.breadcrumbs[id];
                if(itemParents.length < 2)
                {
                    $rootScope.parentID = 0;
                }
                else
                {
                    if(itemParents[itemParents.length - 1].hasItems)
                    {
                        $rootScope.parentID = itemParents[itemParents.length - 2];
                    }
                    else
                    {
                        if(itemParents.length == 2)
                        {
                            $rootScope.parentID = 0;
                        }
                        else
                        {
                            $rootScope.parentID = itemParents[itemParents.length - 3];
                        }
                    }
                }
            }

            // fix categories with long titles
            $rootScope.currentCategories = splitCurrentCategoriesTitle($rootScope.currentCategories);

            // return the function so the resolve can continue.
            return true;
        }
    }
}

/**
 * Get the categories.
 *
 * if already have the category return it
 * else http get it, store and return.
 *
 * if no such category state.go to home page.
 *
 * @param $http
 * @param $state
 * @param $rootScope
 * @returns {{}}
 * @constructor
 */
function CategoryService($http, $state, $rootScope) {
    var ca = {};
    ca.getCategories = function($stateParams){
        $rootScope.isFirst = false;

        if(ca.categoriesData)
            return ca.categoriesData;

        var id = $stateParams.id || 0;
        return ca.categoriesData = $http.get('/COMPIE/jini3/public/categories/' + id + '/categories').then(function(response){

            if(typeof response.data.parents == 'undefined' || typeof response.data.parents[id] == 'undefined')
                $state.go('home');

            $rootScope.isFirst = true;
            return response.data;
        });
    };
    return ca;
}

/**
 * Get the current object.
 *
 * if have it already return it
 * else http get it, store and return.
 * @param $http
 */
function objectService($http) {
    var obj = {};
    obj.objectData = [];
    obj.getObjectData = function($stateParams){

        var id = $stateParams.id2 || 0;

        if(obj.objectData[id])
            return obj.objectData[id];

        return obj.objectData[id] = $http.get('/COMPIE/jini3/public/objects/' + id).then(function(response){
            return response.data;
        });
    };
    return obj;
}

/**
 * Fix the pie based on the current pie size
 * rotate the circle and more.
 *
 * @param $document
 * @returns {{init: Function, rotateCircle: Function, rotateImage: Function, openCircle: Function}}
 */
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

/**
 * Helper for the pie function 2 - 10 items position and more.
 */
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

/**
 * Split str to 2
 * @param str
 * @param delim
 * @returns {*[]}
 */
function split2s(str, delim) {
    var split = str.trim().split(" ");
    console.log(split);
    if(split.length <= 1)
    {
        return [str];
    }
    else
    {
        var first = split;
        var last = split.splice(Math.ceil(split.length / 2), Math.floor(split.length / 2));
        return [first.join(' '), last.join(' ')];
    }
}

/**
 * str replace all helper
 * @param find
 * @param replace
 * @param str
 * @returns {*}
 */
function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

/**
 * Split long category title helper
 * @param currentCategories
 * @returns {*}
 */
function splitCurrentCategoriesTitle(currentCategories){

    for(i in currentCategories)
    {
        //var title = replaceAll('/', '', currentCategories[i].title);
        //title = replaceAll('-', '', title);
        var title = currentCategories[i].title;
        var titleSplit = split2s(title, ' ');
        currentCategories[i].newTitle = titleSplit.length > 1 ? titleSplit : false;
    }
    return currentCategories;
}

/**
 * Recursive helper to get menu categories by parent.
 * @param categories
 * @param parentArray
 * @returns {*}
 */
function getCategoriesByParentArray(categories, parentArray) {
    if(parentArray.length != 0)
    {
            var id = parentArray[0];
            parentArray.shift()
            if(categories[id]['items_count'])
                categories = getCategoriesByParentArray(categories[id]['items'], parentArray);
    }
    return categories;
}

/**
 * Recursive helper to get the current category.
 * @param categories
 * @param parentArray
 * @returns {{id: *, title: *, contentImageUrl: *, items_count: boolean, contetnt: boolean}|*}
 */
function getCurrentCategoryByParentArray(categories, parentArray) {
    if(parentArray.length == 1)
    {
        currentCategory = {
            id:       parentArray[0],
            title:    categories[parentArray[0]]['title'],
            contentImageUrl:      categories[parentArray[0]]['contentImageUrl'],
            featuredImageUrl:      categories[parentArray[0]]['featuredImageUrl'],
            items_count: categories[parentArray[0]]['items_count'] ? true : false,
            contetnt: false,
        }
    }
    else if(parentArray.length == 0)
    {
        currentCategory = {}
    }
    else
    {
        var id = parentArray[0];
        parentArray.shift()
        currentCategory = getCurrentCategoryByParentArray(categories[id]['items'], parentArray)
    }
    return currentCategory;
}