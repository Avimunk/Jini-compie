angular.module('JINI.controllers')
.controller('HomeController', HomeController);

HomeController.$inject = ['$scope', '$http', 'messages', '$document'];

function HomeController($scope, $http, messages, $document) {
    console.log('HomeController!')

    var svg = $document[0].querySelector('#menu');

    var currentMenu = [
        ["Start", "", ""],
        ["Start", "", ""],
        ["Start", "", ""]
    ];
    //currentMenu = arrMenu1;

console.log(svg);
    var svgns = "http://www.w3.org/2000/svg",
        xlinkns = "http://www.w3.org/1999/xlink",
        symbolsContainer = svg.getElementById("symbolsContainer"),
        itemsContainer = svg.getElementById("itemsContainer"),
        trigger = svg.getElementById("trigger"),
        //codeContainer = $document[0].querySelector("#codeContainer").querySelector("code"),
        source = $document[0].querySelector("#demo"),
        smallRadiusContainer = $document[0].querySelector("#smallRadiusSliderContainer"),
        smallRadiusControl = $document[0].querySelector("#smallRadiusControl"),
        triggerControl = $document[0].querySelector("#triggerControl"),
        iconPosControl = $document[0].querySelector("#iconPosControl"),
        iconSizeControl = $document[0].querySelector("#iconSizeControl"),
        gapControl = $document[0].querySelector("#gapControl"),
        circle = svg.querySelector("#trigger circle"),
        downloadButton = $document[0].querySelector("#download-button"),
        resetButton = $document[0].querySelector("#reset-button"),
        nb = $document[0].querySelector("#nb"),
        typePicker = document.getElementsByName("type"),
        stylePicker = document.getElementsByName("style"),
        gapOption = $document[0].querySelector("#gaps"),
//nbOfSlices = parseInt(nb.value),
        nbOfSlices = currentMenu.length,
        gap = 100,
        menuLevel = 0,
        //typeOfCircle = document.querySelector('input[name="type"]:checked').value,
        //menuStyle = document.querySelector('input[name="style"]:checked').value
        gaps = true,
        img = document.createElementNS(svgns, "image"),
        menuCenter = {
            x: 250,
            y: 250
        }, menuRadius = 250,
        menuSmallRadius = 115,
        iconPos;

    messages.add($scope);
};
