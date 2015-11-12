angular.module('JINI.filters', [])
    .filter('rawHtml', ['$sce', function($sce){
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    }])
    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' ...');
        };
    })
    .filter('highlight', ['$sce', function($sce) {
        return function(text, phrase) {
            if (phrase)text = text.replace(new RegExp('('+phrase+')', 'gi'),
                "<span class='search-word'>$1</span>")

            return $sce.trustAsHtml(text)
        }
    }])
;