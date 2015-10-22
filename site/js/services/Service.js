angular.module('JINI.services', [])
    .factory('messages', ['$http', messages]);
;

function messages($http) {
    var messages = {};

    messages.parents = [];
    messages.categories = [];
    messages.currentCategories = [];

    messages.add = function($scope, id){
        if(id === undefined)
            id = 0;

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

        }
        else
        {
            $http.get("http://localhost/Jini3/public/categories/"+id+"/categories")
                .success(function(response) {
                    $scope.categories = messages.categories = response.categories;
                    $scope.parents = messages.parents = response.parents;

                    var currentParent = response.parents[id];

                    $scope.currentCategories = messages.currentCategories = getCategoriesByParentArray(messages.categories, currentParent.slice());

                    if(currentParent.length == 0)
                        $scope.parentID = null;
                    else if(currentParent.length <= 1)
                        $scope.parentID = 0;
                    else
                        $scope.parentID = currentParent[currentParent.length - 2];

                    console.log($scope.currentCategories)
                    //setVars($scope)
                    //init($scope)
                });
        }

    };

    return messages;
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

function setVars($scope)
{

    var mm = [];
    for ( i = 0; i < $scope.currentCategories.length; i++) {
        var o = $scope.currentCategories[i];
        mi = [];
        mi[0] = o.title;
        mi[1] = o.featuredImageUrl;
        mi[2] = '#' + o.name;
        mi[3] = o.id;
        mi[4] = o.contentImageUrl;
        mi[5] = o.childrenCount;
        mi[6] = o.itemsCount;

        mm.push(mi);
    }

    currentMenu = mm;
    nbOfSlices = currentMenu.length;
    console.log(mm);

    //var svg = document.getElementById("menu");
    //console.log(svg);
    //return ;
    var svg = document.getElementById("menu"),
        svgns = "http://www.w3.org/2000/svg",
        xlinkns = "http://www.w3.org/1999/xlink",
        symbolsContainer = svg.getElementById("symbolsContainer"),
        itemsContainer = svg.getElementById("itemsContainer"),
        trigger = svg.getElementById("trigger"),
        codeContainer = document.getElementById("codeContainer"),//.querySelector("code"),
        source = document.getElementById("demo"),
        smallRadiusContainer = document.getElementById("smallRadiusSliderContainer"),
        smallRadiusControl = document.getElementById("smallRadiusControl"),
        triggerControl = document.getElementById("triggerControl"),
        iconPosControl = document.getElementById("iconPosControl"),
        iconSizeControl = document.getElementById("iconSizeControl"),
        gapControl = document.getElementById("gapControl"),
        circle = svg.querySelector("#trigger circle"),
        downloadButton = document.getElementById("download-button"),
        resetButton = document.getElementById("reset-button"),
        nb = document.getElementById("nb"),
        typePicker = document.getElementsByName("type"),
        stylePicker = document.getElementsByName("style"),
        gapOption = document.getElementById("gaps"),
        //nbOfSlices = parseInt(nb.value),
        nbOfSlices = currentMenu.length,
        gap = 100,
        menuLevel = 0,
        typeOfCircle = 'fullCircle',//document.querySelector('input[name="type"]:checked').value,
        menuStyle = 'pizza',//document.querySelector('input[name="style"]:checked').value,
        //gaps = document.getElementById("gaps").checked,
        gaps = true,
        img = document.createElementNS(svgns, "image"),
        menuCenter = {
            x: 250,
            y: 250
        }, menuRadius = 250,
        menuSmallRadius = 115,
        iconPos;



    iconPos = "pie" == menuStyle ? .75 * menuRadius : .68 * menuRadius;
    var iconWidth = 40,
        iconHeight = 40,
        angle, pizzaCoordinates = {}, pieCoordinates = {}, gap = 100;
    //typePicker[0].onclick = function() {
    //    typeOfCircle = this.value;
    //    init();
    //},
    //typePicker[1].onclick = function() {
    //    typeOfCircle = this.value, init()
    //},
    //stylePicker[0].onclick = function() {
    //    menuStyle = this.value, init()
    //},
    //stylePicker[1].onclick = function() {
    //    menuStyle = this.value, init()
    //},
    //nb.onchange = function() {
    //    this.value < 3 && (this.value = 3), this.value > 12 && (this.value = 12), nbOfSlices = parseInt(this.value), codeContainer.textContent = source.innerHTML, init()
    //},
    //gapOption.onclick = function() {
    //    gaps = this.checked, init()
    //},
    //smallRadiusControl.addEventListener("change", smallRadiusControlHandler, !1),
    //smallRadiusControl.addEventListener("input", smallRadiusControlHandler, !1),
    //triggerControl.addEventListener("change", triggerControlHandler, !1),
    //triggerControl.addEventListener("input", triggerControlHandler, !1),
    //iconPosControl.addEventListener("change", iconPosControlHandler, !1),
    //iconPosControl.addEventListener("input", iconPosControlHandler, !1),
    //iconSizeControl.addEventListener("change", iconSizeControlHandler, !1),
    //iconSizeControl.addEventListener("input", iconSizeControlHandler, !1),
    //gapControl.addEventListener("change", gapControlHandler, !1),
    //gapControl.addEventListener("input", gapControlHandler, !1),
    //resetButton.onclick = function() {
    //    nbOfSlices = currentMenu.length, gaps = !1, gap = 10, gapControl.value = 10, circle.setAttribute("r", "100"), triggerControl.value = 100, menuStyle = "pizza", typeOfCircle = "fullCircle", iconPos = .68 * menuRadius, iconPosControl.value = .68 * menuRadius, iconWidth = 40, iconHeight = 40, iconSizeControl.value = 40, nb.value = nbOfSlices, typePicker[0].checked = !0, typePicker[1].checked && (typePicker[1].checked = !1, typePicker[1].removeAttribute("checked")), stylePicker[0].checked = !0, stylePicker[1].checked && (stylePicker[1].checked = !1, stylePicker[1].removeAttribute("checked")), gapOption.checked = !1, gapControl.setAttribute("value", "10"), gapControl.value = 10, smallRadiusControl.setAttribute("value", "125"), smallRadiusControl.value = 125, TweenLite.set(svg, {
    //        rotation: 0,
    //        transformOrigin: "50% 50%"
    //    }), init()
    //},
    //downloadButton.addEventListener("click", function(t) {
    //    var e = source.innerHTML;
    //    navigator.msSaveBlob && (t.preventDefault(), navigator.msSaveBlob(new Blob([e], {
    //        type: "image/svg+xml"
    //    }), "svg-circular-menu.svg"))
    //})
    ;

    init();


}



function generateCode() {
    codeContainer.textContent = source.innerHTML
}

function generateFile() {
    var t = "data:image/svg+xml;utf8," + encodeURIComponent(source.innerHTML);
    downloadButton.setAttribute("href", t)
}

function getAngle(t) {
    "semiCircle" == typeOfCircle && gaps === !1 ? angle = 180 / t : "fullCircle" == typeOfCircle && gaps === !1 && (angle = 360 / t), "semiCircle" == typeOfCircle && gaps === !0 ? angle = 180 / t - 180 / t / gap : "fullCircle" == typeOfCircle && gaps === !0 && (angle = 360 / t - 360 / t / gap)
}

function getPizzaCoordinates(t, e, i) {
    var n = i.x,
        r = i.y,
        s = -t * Math.PI / 180,
        a = n + e * Math.cos(s),
        o = r + e * Math.sin(s);
    pizzaCoordinates.x = a, pizzaCoordinates.y = o
}

function getCutCoordinates(t, e, i) {
    var n = i.x,
        r = i.y,
        s = -t * Math.PI / 180,
        a = n + e * Math.cos(s),
        o = r + e * Math.sin(s);
    pieCoordinates.x = a, pieCoordinates.y = o
}

function isOdd(t) {
    return t % 2
}

function rotateItems(t) {
    for (var e = svg.querySelectorAll(".item"), i, n, r, s = 0; s < e.length; s++) {
        var a = e[s];
        gaps === !1 && (r = -angle * s), gaps === !0 && "semiCircle" == typeOfCircle && (i = nbOfSlices * (180 / nbOfSlices / gap), n = i / (nbOfSlices - 1), r = -s * (angle + n)), gaps === !0 && "fullCircle" == typeOfCircle && (i = nbOfSlices * (360 / nbOfSlices / gap), n = i / nbOfSlices, r = -s * (angle + n));
        var o = a.getBBox();
        a.setAttribute("transform", "rotate(" + r + " " + t.x + " " + t.y + ")"), TweenLite.set(a, {
            rotation: r,
            transformOrigin: t.x - o.x + "px " + (t.y - o.y) + "px"
        }), a.removeAttribute("style")
    }
}

function drawPizzaSectors(t, e) {

    for (var i = 0; nbOfSlices > i; i++) {
        var n = document.createElementNS(svgns, "a");
        n.setAttribute("class", "item"), n.setAttribute("id", "item-" + (i + 1)), n.setAttribute("role", "link"), n.setAttribute("tabindex", "0"), n.setAttributeNS(xlinkns, "xlink:href", ""), n.setAttributeNS(xlinkns, "xlink:title", ""), n.setAttributeNS(xlinkns, "target", "_parent");
        var r = document.createElementNS(svgns, "path");
        r.setAttribute("fill", "none"), r.setAttribute("stroke", "#111"), r.setAttribute("stroke-width", "1"), r.setAttribute("class", "sector"), r.setAttribute("d", "M" + t.x + "," + t.y + " l" + e + ",0 A" + e + "," + e + " 0 0,0 " + pizzaCoordinates.x + "," + pizzaCoordinates.y + " z"), n.appendChild(r), itemsContainer.appendChild(document.createTextNode("        ")), itemsContainer.appendChild(n), itemsContainer.appendChild(document.createTextNode("\n"))
    }
}

var categoryRequest = null;
var objectRequest = null;

function drawCutSectors(t, e, i) {
    if (currentMenu.length > 0) {
        for (var n = 0; nbOfSlices > n; n++) {
            var r = document.createElementNS(svgns, "a");
            var m = currentMenu[n];
            var l = m[2];
            var z = m[1];
            var tt = m[0];

            var imgTempforeignObject = document.createElement("foreignObject");

            if (typeof m[1] !== "undefined") {
                var imgTemp = document.createElement("img");

                imgTemp.setAttribute("src", m[1]);

                imgTempforeignObject.appendChild(imgTemp);
            }

            if (typeof m[4] !== "undefined") {
                var imgTemp = document.createElement("img");

                imgTemp.setAttribute("src", m[4]);

                imgTempforeignObject.appendChild(imgTemp);
            }


            itemsContainer.appendChild(imgTempforeignObject);



            r.setAttribute("class", "item"), r.setAttribute("id", "item-" + (n + 1)), r.setAttribute('data-children-count', m[5]), r.setAttribute('data-items-count', m[6]),  r.setAttribute("data-id", m[3]), r.setAttribute("data-index", n), r.setAttribute("data-title", tt), r.setAttribute("data-featured-image", m[1]), r.setAttribute("data-content-image", m[4]), r.setAttribute("role", "link"), r.setAttribute("tabindex", "0"), r.setAttributeNS(xlinkns, "xlink:href", l), r.setAttributeNS(xlinkns, "xlink:title", "title1");
            r.addEventListener(enterEvent, function(t) {
                var category = {};

                category["id"] = this.getAttribute("data-id");
                category["index"] = this.getAttribute("data-index");
                category["title"] = this.getAttribute("data-title");
                category["featuredImageUrl"] = this.getAttribute("data-featured-image");
                category["contentImageUrl"] = this.getAttribute("data-content-image");

                var currentItemId = $('#sideBar1 .info-pane').attr('data-id');

                if (typeof currentItemId == 'undefined' || currentItemId != category["id"])   {
                    bindCategory(category);
                }
            }, true);

            r.addEventListener(clickEvent, function(t) {
                if (t.button == 0) {
                    var category = {};

                    category["id"] = this.getAttribute("data-id");
                    category["childrenCount"] = this.getAttribute("data-children-count");
                    category["itemsCount"] = this.getAttribute("data-items-count");
                    category["title"] = this.getAttribute("data-title");

                    previousCategoryId = currentCategoryId;
                    currentCategoryId = category["id"];

                    if (category["childrenCount"] > 0) {
                        loadMenu(category["id"]);
                    } else {
                        currentCategoryIndex = 0;

                        $('#sideBar1 .search-results-pane .info-content > .content').empty();

                        loadCategoryObjects(category["id"]);
                    }
                }
            }, true);


            var s = document.createElementNS(svgns, "path");
            s.setAttribute("fill", "none"), s.setAttribute("stroke", "#111"), s.setAttribute("d", "M" + (t.x + i) + "," + t.y + " l" + (e - i) + ",0 A" + e + "," + e + " 0 0,0 " + pizzaCoordinates.x + "," + pizzaCoordinates.y + " l" + -(pizzaCoordinates.x - pieCoordinates.x) + "," + (-pizzaCoordinates.y + pieCoordinates.y) + " A" + i + "," + i + " 0 0,1 " + (t.x + i) + "," + t.y), s.setAttribute("class", "sector"), r.appendChild(s), itemsContainer.appendChild(document.createTextNode("")), itemsContainer.appendChild(r), itemsContainer.appendChild(document.createTextNode("\n"))
        }
    }
}

function clearCanvas() {
    for (var t = svg.querySelectorAll(".item"), e = 0; e < t.length; e++) {
        var i = t[e],
            n = i.parentNode;
        n.removeChild(i)
    }
    for (var r = svg.querySelectorAll(".icon"), e = 0; e < r.length; e++) {
        var s = r[e],
            n = s.parentNode;
        n.removeChild(s)
    }
    itemsContainer.textContent = "", symbolsContainer.textContent = ""
}

function triggerControlHandler() {
    circle.setAttribute("r", this.value), generateFile()
}

function gapControlHandler() {
    gap = this.value, init()
}

function smallRadiusControlHandler() {
    menuSmallRadius = parseInt(this.value), init()
}

function iconPosControlHandler() {
    iconPos = this.value, init()
}

function iconSizeControlHandler() {
    iconWidth = this.value, iconHeight = this.value, init()
}

function enableGapControl() {
    gapControl.disabled = !1
}

function disableGapControl() {
    gapControl.disabled = !0
}

function enableRadiusControl() {
    smallRadiusControl.disabled = !1
}

function disableRadiusControl() {
    smallRadiusControl.disabled = !0
}

function getTextAngle(num, count) {
    var a = 30;

    switch ( count ) {
        case 2:
            a = 0;

            if (num == 2) {
                a = 180;
            }
            break;
        case 3:
            a = 30;

            if (num > 1) {
                a = -140;
            }
            break;
        case 4:
            a = 45;

            if (num == 3) {
                a = -135;
            }
            break;
        case 5:
            a = 55;

            if (num >=3 && num <= 4) {
                a = -125;
            }
            break;
        case 6:
            a = 60;
            if (num >=3 && num <= 5) {
                a = -120;
            }
            break;
        case 7:
            a = 65;

            if (num >=3 && num <= 6) {
                a = -115;
            }
            break;
        case 8:
            a = 67;

            if (num >=4 && num <= 6) {
                a = -115;
            }

            break;
        case 9:
            a = 70;

            if (num >=4 && num <= 7) {
                a = -115;
            }

            break;
        case 10:
            a = 72;

            if (num >=4 && num <= 7) {
                a = -109;
            }

            break;
    }

    return a;
}

function addIcons() {
    var t = document.querySelectorAll(".item"),
        e = document.createElementNS(svgns, "path");
    e.setAttribute("d", "M" + pizzaCoordinates.x + "," + pizzaCoordinates.y + " L" + 2 * menuRadius + "," + menuRadius);
    for (var i = e.getTotalLength(), n = 0; n < t.length; n++) {
        var r = t[n];
        var e = document.createElementNS(svgns, "path");
        e.setAttribute("d", "M" + pizzaCoordinates.x + "," + pizzaCoordinates.y + " L" + 2 * menuRadius + "," + menuRadius), e.setAttribute("stroke", "#ddd");
        var s = {};
        angle > 90 ? (s.x = pizzaCoordinates.x + (2 * menuRadius - pizzaCoordinates.x) / 2 + 50, s.y = pizzaCoordinates.y + (menuRadius - pizzaCoordinates.y) / 2 - 50) : (s.x = pizzaCoordinates.x + (2 * menuRadius - pizzaCoordinates.x) / 2, s.y = pizzaCoordinates.y + (menuRadius - pizzaCoordinates.y) / 2);
        var a = document.createElementNS(svgns, "circle");
        a.setAttribute("cx", s.x), a.setAttribute("cy", s.y), a.setAttribute("r", "5");
        var o = document.createElementNS(svgns, "path");
        o.setAttribute("d", "M" + menuCenter.x + "," + menuCenter.y + " L" + s.x + "," + s.y), o.setAttribute("stroke", "orange");
        var l = o.getPointAtLength(iconPos),
            h = document.createElementNS(svgns, "circle");
        h.setAttribute("cx", l.x), h.setAttribute("cy", l.y), h.setAttribute("r", "5");
        var u = document.createElementNS(svgns, "use");
        u.setAttributeNS(xlinkns, "xlink:href", "#icon-" + (n + 1)), u.setAttribute("width", iconWidth), u.setAttribute("height", iconHeight), u.setAttribute("x", l.x - u.getAttribute("width") / 2), u.setAttribute("y", l.y - u.getAttribute("height") / 2), u.setAttribute("transform", "rotate(" + getTextAngle(n + 1, t.length) + " " + l.x + " " + l.y + ")"), r.appendChild(u);
        var c = document.createElementNS(svgns, "symbol");
        c.setAttribute("class", "icon icon-"), c.setAttribute("id", "icon-" + (n + 1)), c.setAttribute("viewBox", "0 0 " + iconWidth + " " + iconHeight);

        img.setAttribute("id", "featuredImage"), img.setAttribute("width", "200"), img.setAttribute("height", "200"), img.setAttribute("x", "150"),img.setAttribute("y", "150"), img.setAttributeNS(xlinkns, "xlink:href", "img/no_selector.png");
        svg.appendChild(img);

        //var f = document.createElementNS(svgns, "rect");
        //f.setAttribute("fill", "none"), f.setAttribute("stroke", "#111"), f.setAttribute("stroke-width", "1"), f.setAttribute("width", "100%"), f.setAttribute("height", "100%");

        var fontSize = 16;

        switch (t.length) {
            case 2:
                fontSize = 22;
                break;
            case 8:
                fontSize = 16;
                break;
            case 9:
                fontSize = 14;
                break;
            case 10:
                fontSize = 14;
                break;
        }

        var menuText = currentMenu[n][0].replace("/", " ");

        while (menuText.indexOf('  ') != -1) {
            menuText = menuText.replace("  ", " ");
        }



        var parts = menuText.split(" ");
        var dy = 0;
        var dx = 0;
        for (j = 0; j < parts.length; j++) {
            var part = parts[j];
            var p = document.createElementNS(svgns, "text");

            if (part) {
                part = part.replace("-", " ");
            }
            switch (nbOfSlices) {
                case 2:
                    if (n > 0) {
                        dx = 100;
                        dy = 270;
                    }
                    if ( j > 0 ) {
                        dy += 30;
                    }
                    p.setAttribute("fill", "#222"),p.setAttribute("dx", (dx -30)), p.setAttribute("y", "0"), p.setAttribute("dy", (dy - 115) + "px"), p.setAttribute("text-anchor", "middle"), p.setAttribute("font-size", fontSize + "px"), p.textContent = part;
                    break;
                default:
                    p.setAttribute("fill", "#222"), p.setAttribute("x", "50%"),p.setAttribute("dx", "0"), p.setAttribute("y", "50%"), p.setAttribute("dy", dy + "px"), p.setAttribute("text-anchor", "middle"), p.setAttribute("font-size", fontSize + "px"), p.textContent = part;
                    dy += 20;
            }

            c.appendChild(p);
        }

        var d = document.createComment("Replace the contents of this symbol with the content of your icon");
        c.appendChild(d), symbolsContainer.appendChild(document.createTextNode("    ")), symbolsContainer.appendChild(c), symbolsContainer.appendChild(document.createTextNode("\n\n"))
    }
}

function init() {
    console.log('sdfsdfsd');
    gap = 200;
    if (nbOfSlices > 0) {
        clearCanvas(), iconPosControl.setAttribute("max", .85 * menuRadius), iconPosControl.setAttribute("value", .68 * menuRadius), gaps ? (enableGapControl(), gapControl.setAttribute("max", angle), gapControl.setAttribute("min", nbOfSlices - 1)) : gaps || disableGapControl(), getAngle(nbOfSlices), getPizzaCoordinates(angle, menuRadius, menuCenter), "pizza" == menuStyle ? (drawPizzaSectors(menuCenter, menuRadius), disableRadiusControl()) : "pie" == menuStyle && (getCutCoordinates(angle, menuSmallRadius, menuCenter), drawCutSectors(menuCenter, menuRadius, menuSmallRadius), enableRadiusControl()), rotateItems(menuCenter), addIcons(), generateCode(), generateFile()
    }

    TweenLite.set(svg, {
        rotation: 0,
        transformOrigin: "50% 50%"
    })

    TweenLite.set(img, {
        rotation: 0,
        transformOrigin: "50% 50%"
    })


    var rotation = null;
    switch (nbOfSlices) {
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

}

function makeSpinnable(t) {
    CSSPlugin.useSVGTransformAttr = !0, TweenLite.set(svg, {
        rotation: 0,
        transformOrigin: "50% 50%"
    }), Draggable.create(svg, {
        type: "rotation",
        throwProps: !0,
        dragClickables: !0,
        onThrowComplete: function() {
            generateCode(), generateFile()
        }
    })
}