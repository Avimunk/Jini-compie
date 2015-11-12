angular.module('JINI.templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/categories/8.html',
    "<search-block></search-block>\r" +
    "\n" +
    "<categories-search-block></categories-search-block>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"breadcrumbs\">\r" +
    "\n" +
    "    <ul>\r" +
    "\n" +
    "        <li ng-class=\"{{!currentBreadCrumbs.length ? 'current' : ''}}\">\r" +
    "\n" +
    "            <a ng-if=\"currentBreadCrumbs.length\" href=\"#/\">\r" +
    "\n" +
    "                Home\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "            <span ng-if=\"!currentBreadCrumbs.length\">\r" +
    "\n" +
    "                Home\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        <li ng-repeat=\"(k, v) in currentBreadCrumbs\">\r" +
    "\n" +
    "            <a ng-if=\"!$last\" ng-href=\"{{'#/' + v.id + '/' + v.url}}\">{{v.title}}</a>\r" +
    "\n" +
    "            <span ng-if=\"$last\">{{v.title}}</span>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div id=\"demo-wrapper\" ng-attr-class=\"{{ showCategoriesBlock || showObjectBlock ? 'closed' : ''}}\" ng-mouseover=\"closeOnMouseover()\" style=\"\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <a title=\"Go Home\" ng-if=\"parentID == 0\" ng-href=\"#/\" class=\"back-button\"></a>\r" +
    "\n" +
    "    <a title=\"Back to parent Category\" ng-if=\"parentID != 0 && parentID != null\" ng-href=\"#/{{ parentID }}/\" class=\"back-button\"></a>\r" +
    "\n" +
    "    <!-- SVG Menu Generated By CIRCULUS.SVG :: http://sarasoueidan.com/tools/circulus -->\r" +
    "\n" +
    "    <svg ng-mouseleave=\"imageOff()\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"-2 -2 504 504\" id=\"menu\">\r" +
    "\n" +
    "        <g id=\"trigger\" class=\"trigger menu-trigger\" role=\"button\">\r" +
    "\n" +
    "            <circle cx=\"250\" cy=\"250\" r=\"110\"></circle>\r" +
    "\n" +
    "        </g>\r" +
    "\n" +
    "        <g id=\"symbolsContainer\">\r" +
    "\n" +
    "            <symbol ng-init=\"currentItem && $first ? openItem(currentItem) : ''\" ng-repeat=\"(k, v) in currentCategories\"  class=\"icon icon-\" id=\"icon-{{$index+1}}\" viewBox=\"0 0 40 40\">\r" +
    "\n" +
    "                <text ng-if=\"currentCategoriesLength == 2\" fill=\"#222\" dx=\"-30\" y=\"0\" dy=\"-115px\" text-anchor=\"middle\" font-size=\"22px\">{{v.title}}</text>\r" +
    "\n" +
    "                <text ng-if=\"currentCategoriesLength != 2\" fill=\"#222\" x=\"50%\" dx=\"0\" y=\"50%\" dy=\"0px\" text-anchor=\"middle\" font-size=\"16px\">{{v.newTitle ? v.newTitle[0] : v.title}}</text>\r" +
    "\n" +
    "                <text ng-if=\"currentCategoriesLength != 2 && v.newTitle\" fill=\"#222\" x=\"50%\" dx=\"0\" y=\"50%\" dy=\"20px\" text-anchor=\"middle\" font-size=\"16px\">{{v.newTitle[1]}}</text>\r" +
    "\n" +
    "            </symbol>\r" +
    "\n" +
    "            <image data-svg-origin=\"250 250\" id=\"featuredImage\" width=\"200\" height=\"200\" x=\"150\" y=\"150\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"\" ng-href=\"{{centerImage ? mediaUrl + centerImage : ' '}}\" style=\"transform-origin: 0px 0px 0px; transform: matrix(0.99999, 0, 0, 0.99999, 0.00216995, -0.000230047);\"></image>\r" +
    "\n" +
    "        </g>\r" +
    "\n" +
    "        <g id=\"itemsContainer\">\r" +
    "\n" +
    "            <a ng-repeat=\"(k, v) in currentCategories\" ng-class=\"{{ currentID == k ? 'current' : ''}}\" ng-attr-data-category-id=\"{{k}}\" ng-init=\"$last ? fixPie() : ''\" ng-click=\"currentItem && currentItem.id == v.id ? openItem(currentItem) : ''\" ng-href=\"{{'#/' + k + '/' + v.name}}\" ng-mouseover=\"imageOn(v);leftBlocksHandler.categoryHover(v)\" class=\"item\" id=\"item-{{$index+1}}\" data-title=\"{{v.title}}\" data-featured-image=\"{{v.featuredImageUrl}}\" data-content-image=\"{{v.contentImageUrl}}\" role=\"link\" tabindex=\"0\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\" \" xlink:title=\"{{v.title}}\" ng-attr-transform=\"{{pie[currentCategoriesLength].transform_a[$index]}}\" data-svg-origin=\"{{pie[currentCategoriesLength].global.svgOrigin}}\" ng-attr-style=\"{{ isFirst ? 'transform: matrix(0, 0, 0, 0, 250, 250);' : ''}}\">\r" +
    "\n" +
    "                <path fill=\"none\" stroke=\"#111\" ng-attr-d=\"{{pie[currentCategoriesLength].global.d}}\" class=\"sector {{!isFirst ? 'opacity' : ''}}\"></path>\r" +
    "\n" +
    "                <use xlink:href=\"\" ng-href=\"#icon-{{$index+1}}\" width=\"40\" height=\"40\" ng-attr-x=\"{{pie[currentCategoriesLength].global.x}}\" ng-attr-y=\"{{pie[currentCategoriesLength].global.y}}\" ng-attr-transform=\"{{pie[currentCategoriesLength].transform_b[$index]}}\"></use>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </g>\r" +
    "\n" +
    "    </svg>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/categoriesBlock.html',
    "<div>\r" +
    "\n" +
    "    <div class=\"search-criteria-pane-wrapper pane-wrapper{{showCategoriesBlock ? ' collapsed' : ''}}\">\r" +
    "\n" +
    "        <div class=\"search-criteria-pane pane\">\r" +
    "\n" +
    "            <h2 class=\"title\">Filter results in <span class=\"criteria\">{{currentItem.title}}</span></h2>\r" +
    "\n" +
    "            <button class=\"close-button\">&nbsp;</button>\r" +
    "\n" +
    "            <ul class=\"view-mode\">\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <button ng-class=\"showCategoriesBlockMap ? 'active' : ''\" class=\"map-view-button\" ng-click=\"showCategoriesMap();\"></button>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <button ng-class=\"showCategoriesBlockList ? 'active' : ''\" class=\"list-view-button \" ng-click=\"showCategoriesList()\">&nbsp;</button>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"search-results-pane-wrapper pane-wrapper{{showCategoriesBlock && showCategoriesBlockList ? ' collapsed' : ''}}\">\r" +
    "\n" +
    "        <div class=\"search-results-pane pane\">\r" +
    "\n" +
    "            <h2 class=\"title\"><span class=\"criteria\">{{currentItem.title}} ({{sideCategories.data.length}})</span></h2>\r" +
    "\n" +
    "            <div class=\"info-content\">\r" +
    "\n" +
    "                <div class=\"content\">\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li ng-repeat=\"(k, v) in sideCategories.data\">\r" +
    "\n" +
    "                            <div class=\"row\">\r" +
    "\n" +
    "                                <div class=\"col-md-5\">\r" +
    "\n" +
    "                                    <img src=\"{{mediaUrl + v.featured_image}}\" class=\"thumb\">\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div class=\"col-md-7 no-padding\">\r" +
    "\n" +
    "                                    <div class=\"content\">\r" +
    "\n" +
    "                                        <h3>{{v.title}}</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <p class=\"excerpt\" ng-if=\"v.content\" ng-bind-html=\"v.content | rawHtml\"></p>\r" +
    "\n" +
    "                                        <a ng-click=\"closeCategories()\" ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/' + currentItem.title + '/' + v.name}}\" class=\"more-button{{v.promoted ? ' promoted' : ''}}\"><span>More Info</span></a>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"row actions\">\r" +
    "\n" +
    "                                <div class=\"col-md-4\">\r" +
    "\n" +
    "                                    <button class=\"map-button\">View on map</button>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div class=\"col-md-4 no-padding\">\r" +
    "\n" +
    "                                    <button class=\"wishlist-button\">Add to wishlist</button>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div class=\"col-md-4\">\r" +
    "\n" +
    "                                    <button class=\"book-button\">Book now</button>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"close-button\">&nbsp;</button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"search-results-pane-wrapper-1 pane-wrapper{{showCategoriesBlock && showCategoriesBlockMap ? ' collapsed' : ''}}\">\r" +
    "\n" +
    "        <div class=\"search-results-pane-1 pane\">\r" +
    "\n" +
    "            <div id=\"mapFrame\">\r" +
    "\n" +
    "                <my-map ng-if=\"showCategoriesBlock\"></my-map>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"close-button\">&nbsp;</button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/categoriesBlockSearch.html',
    "<div class=\"categoriesBlock\" ng-attr-style=\"{{!showCategorySearchBlock ? 'display:none;' : ''}}\">\r" +
    "\n" +
    "    <div class=\"search-criteria-pane-wrapper pane-wrapper{{showCategorySearchBlock ? ' collapsed' : ''}}\">\r" +
    "\n" +
    "        <div class=\"search-criteria-pane pane\">\r" +
    "\n" +
    "            <h2 style=\"direction: ltr\" class=\"title\">Filter results in <span class=\"criteria\">{{currentItem.title}}</span> for search: <strong>{{keywords}}</strong>, total results: <strong>{{category_search_result.length}}</strong></h2>\r" +
    "\n" +
    "            <button class=\"close-button\">&nbsp;</button>\r" +
    "\n" +
    "            <ul class=\"view-mode\">\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <button ng-class=\"showCategoriesSearchBlockMap ? 'active' : ''\" class=\"map-view-button\" ng-click=\"showCategoriesSearchMap();\"></button>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <button ng-class=\"showCategoriesSearchBlockList ? 'active' : ''\" class=\"list-view-button \" ng-click=\"showCategoriesSearchList()\">&nbsp;</button>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"search search-results-pane-wrapper pane-wrapper{{showCategorySearchBlock && showCategoriesSearchBlockList ? ' collapsed' : ''}}\">\r" +
    "\n" +
    "        <div class=\"search-results-pane pane\">\r" +
    "\n" +
    "            <h2 class=\"title\"><span class=\"criteria\">{{currentItem.title}} ({{category_search_result.length}})</span></h2>\r" +
    "\n" +
    "            <div class=\"info-content\">\r" +
    "\n" +
    "                <div class=\"content\">\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li ng-repeat=\"(k, v) in category_search_result\">\r" +
    "\n" +
    "                            <div class=\"row\">\r" +
    "\n" +
    "                                <div class=\"col-md-5\">\r" +
    "\n" +
    "                                    <img ng-src=\"{{content_image ? content_image : mediaUrl + v.featured_image}}\" class=\"thumb\">\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div class=\"col-md-7 no-padding\">\r" +
    "\n" +
    "                                    <div class=\"content\">\r" +
    "\n" +
    "                                        <h3>{{v.title}}</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                        <p class=\"excerpt\" ng-if=\"v.content\" ng-bind-html=\"v.content | rawHtml\"></p>\r" +
    "\n" +
    "                                        <a ng-click=\"closeCategories()\" ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/' + currentItem.title + '/' + v.name}}\" class=\"more-button{{v.promoted ? ' promoted' : ''}}\"><span>More Info</span></a>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"row actions\">\r" +
    "\n" +
    "                                <div class=\"col-md-4\">\r" +
    "\n" +
    "                                    <button class=\"map-button\">View on map</button>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div class=\"col-md-4 no-padding\">\r" +
    "\n" +
    "                                    <button class=\"wishlist-button\">Add to wishlist</button>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div class=\"col-md-4\">\r" +
    "\n" +
    "                                    <button class=\"book-button\">Book now</button>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"close-button\">&nbsp;</button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"search-results-pane-wrapper-1 pane-wrapper{{showCategorySearchBlock && showCategoriesSearchBlockMap ? ' collapsed' : ''}}\">\r" +
    "\n" +
    "        <div class=\"search-results-pane-1 pane\">\r" +
    "\n" +
    "            <div id=\"mapFrame\">\r" +
    "\n" +
    "                <my-map ng-if=\"showCategorySearchBlock\"></my-map>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"close-button\">&nbsp;</button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/categoryHover.html',
    "<div class=\"info-pane-wrapper pane-wrapper{{showCategoryBlock ? ' collapsed' : ''}}\">\r" +
    "\n" +
    "    <div class=\"info-pane pane{{sideCategory.content ? 'preloader' : ''}}\">\r" +
    "\n" +
    "        <div class=\"top-pane\" ng-if=\"sideCategory.img\" ng-attr-style=\"{{sideCategory.img ? 'background-image: url(' + mediaUrl + sideCategory.img + ');' : ''}}\"></div>\r" +
    "\n" +
    "        <div class=\"main-pane\" style=\"overflow: hidden; width: auto; height: {{ sideCategory.img ? '560px' : '855px'}};\">\r" +
    "\n" +
    "            <div class=\"row heading\">\r" +
    "\n" +
    "                <div class=\"col-md-12\">\r" +
    "\n" +
    "                    <h2 class=\"title\">{{sideCategory.title}}</h2>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row heading\">\r" +
    "\n" +
    "                <div class=\"col-md-12\">\r" +
    "\n" +
    "                    <div class=\"content\">\r" +
    "\n" +
    "                        <div ng-if=\"sideCategory.content\" ng-bind-html=\"sideCategory.content | rawHtml\"></div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <button ng-click=\"closeCategory()\" class=\"back-button\">&nbsp;</button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/objectBlock.html',
    "<div class=\"info-pane-wrapper-1 pane-wrapper{{showObjectBlock ? ' collapsed' : ''}}\">\r" +
    "\n" +
    "    <div class=\"info-pane-1 pane\">\r" +
    "\n" +
    "        <div class=\"top-pane\" ng-if=\"sideObject.content_image\" ng-attr-style=\"background-image: url({{ sideObject.content_image }});\"></div>\r" +
    "\n" +
    "        <div class=\"main-pane\" ng-attr-style=\"{{ sideObject.content_image ? 'margin-top: -70px;position: relative' : 'margin-top: 50px;' }}\">\r" +
    "\n" +
    "            <div class=\"row heading\">\r" +
    "\n" +
    "                <div class=\"col-md-12\">\r" +
    "\n" +
    "                    <h2 ng-attr-style=\"{{ sideObject.content_image ? '' : 'color:black !important' }}\" class=\"title\">{{ sideObject.title }}</h2>\r" +
    "\n" +
    "                    <h3 ng-attr-style=\"{{ sideObject.content_image ? '' : 'color:black !important' }}\" class=\"occupation\">{{ sideObject.occupation }}</h3>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "            <div class=\"row actions actions-pane\">\r" +
    "\n" +
    "                <div class=\"col-md-4\"><button class=\"wishlist-button\">Add to wishlist</button></div>\r" +
    "\n" +
    "                <div class=\"col-md-4\"><button class=\"book-button\">Book</button></div>\r" +
    "\n" +
    "                <div class=\"col-md-4\"><button class=\"map-button\"></button></div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "            <div class=\"row content-pane\">\r" +
    "\n" +
    "                <div class=\"col-md-12\">\r" +
    "\n" +
    "                    <div class=\"content\" ng-show=\"sideObject.content\" ng-bind-html=\"sideObject.content | rawHtml\"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "            <div class=\"row sub-heading\">\r" +
    "\n" +
    "                <div class=\"col-md-12\">\r" +
    "\n" +
    "                    <h3>Contact Info</h3><hr />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"row contact\">\r" +
    "\n" +
    "                <div class=\"col-md-5\">\r" +
    "\n" +
    "                    <span class=\"phone\">{{ sideObject.phone }}</span><br />\r" +
    "\n" +
    "                    <span class=\"email\">{{ sideObject.email }}</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"col-md-7\">\r" +
    "\n" +
    "                    <span class=\"address\">{{ sideObject.address_street + ' ' + sideObject.address_city }}</span><br />\r" +
    "\n" +
    "                    <span class=\"french_speakers\">{{ sideObject.french_speakers }}</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row sub-heading\">\r" +
    "\n" +
    "                <div class=\"col-md-12\">\r" +
    "\n" +
    "                    <h3>More Info</h3><hr />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"row contact\">\r" +
    "\n" +
    "                <div class=\"col-md-4\">\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"col-md-4\">\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <button ng-click=\"back()\" class=\"back-button\" ng-attr-style=\"{{ sideObject.content_image ? '' : 'color:black'}}\">Back to list view</button>\r" +
    "\n" +
    "        <button ng-click=\"closeObject()\" class=\"close-button\" style=\"cursor: pointer\">&nbsp;</button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('templates/directives/searchBlock.html',
    "<div class=\"searchBlock {{showSearchBlock ? ' display' : ''}}\">\r" +
    "\n" +
    "    <div class=\"search-criteria-pane pane\">\r" +
    "\n" +
    "        <h2 ng-show=\"center_search_result.count\" class=\"title\">{{center_search_result.count}} Search results for <span class=\"criteria\">{{search}}</span></h2>\r" +
    "\n" +
    "        <h2 ng-show=\"!center_search_result.count && keywords.length\" class=\"title\">No results for <span class=\"criteria\">{{keywords}}</span></h2>\r" +
    "\n" +
    "        <h2 ng-show=\"!center_search_result.count && !keywords.length\" class=\"title\">Please type something to start</h2>\r" +
    "\n" +
    "        <button class=\"close-button\" style=\"position: absolute; right: 0; top: 0;\">x</button>\r" +
    "\n" +
    "        <div class=\"info-content\">\r" +
    "\n" +
    "            <div ng-repeat=\"(catID, catData) in center_search_result.data\" class=\"category\">\r" +
    "\n" +
    "                <a ng-href=\"{{'#/' + catID + '/' + catData.name + '/search/' + keywords}}\">\r" +
    "\n" +
    "                    <h3>{{catData.title}}</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"count\">\r" +
    "\n" +
    "                        {{catData.itemsCount}} results\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "                <div class=\"items\">\r" +
    "\n" +
    "                    <ul>\r" +
    "\n" +
    "                        <li ng-repeat=\"item in catData.items\">\r" +
    "\n" +
    "                            <div class=\"content\">\r" +
    "\n" +
    "                                <a ng-href=\"{{'#/' + catID + '-' + item.id + '/' + catData.name + '/' + item.name}}\">\r" +
    "\n" +
    "                                    <h4>{{item.title | cut:true:35:' ...'}}</h4>\r" +
    "\n" +
    "                                </a>\r" +
    "\n" +
    "                                <p class=\"excerpt\" ng-if=\"item.excerpt\" ng-bind-html=\"item.excerpt | cut:true:150:' ...' | rawHtml\"></p>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('templates/home/index.html',
    "<div nf-if=\"0\">\n" +
    "    <div ng-if=\"parentID == 0\">\n" +
    "        <a ng-href=\"{{ siteUrl }}\">\n" +
    "            Go Home\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div ng-if=\"parentID != 0 && parentID != null\">\n" +
    "        <a ng-href=\"{{ siteUrl }}/category/{{ parentID }}\">\n" +
    "            Back to parent Category\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div ng-repeat=\"(k, v) in currentCategories\">\n" +
    "        <a ng-if=\"v.items_count\" ng-href=\"{{ siteUrl }}category/{{ v.id }}\">\n" +
    "            {{ v.id }} => {{ v.title }}\n" +
    "        </a>\n" +
    "        <div ng-if=\"!v.items_count\">\n" +
    "            {{ v.id }} => {{ v.title }}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div id=\"demo\">\n" +
    "    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"-2 -2 504 504\" id=\"menu\">\n" +
    "        <style>\n" +
    "            #menu {\n" +
    "                display: block;\n" +
    "                margin: 0 auto;\n" +
    "                /*overflow: visible;*/ /* uncomment this if you are using bouncing animations*/\n" +
    "            }\n" +
    "\n" +
    "            a {\n" +
    "                cursor: pointer; /* SVG &lt;a&gt; elements don't get this by default, so you need to explicitly set it */\n" +
    "                outline: none;\n" +
    "                font-weight: bold;\n" +
    "                font-size: 17px;\n" +
    "            }\n" +
    "\n" +
    "            /* You can change these default styles any way you want */\n" +
    "\n" +
    "            .item .sector {\n" +
    "                transition: all .1s linear;\n" +
    "                fill: #fff;\n" +
    "                stroke: transparent;\n" +
    "                opacity: 0.8;\n" +
    "            }\n" +
    "\n" +
    "\n" +
    "            .item:hover .sector, .item:focus .sector {\n" +
    "                fill: #fff;\n" +
    "                opacity: 0.6;\n" +
    "            }\n" +
    "\n" +
    "            .menu-trigger {\n" +
    "                fill: #fff;\n" +
    "                stroke: transparent;\n" +
    "                opacity: 1;\n" +
    "                pointer-events: auto; /* KEEP THIS to make sure it stays clickable even when SVG's pointer events is disabled */\n" +
    "            }\n" +
    "\n" +
    "            .menu-trigger:hover, .menu-trigger:focus {\n" +
    "                cursor: pointer;\n" +
    "            }\n" +
    "            symbol {\n" +
    "                overflow: visible; /* KEEP THIS so that text will not get cut off it it is wider than the icon width */\n" +
    "            }\n" +
    "        </style>\n" +
    "        <g id=\"trigger\" class=\"trigger menu-trigger\" role=\"button\">\n" +
    "            <circle cx=\"250\" cy=\"250\" r=\"110\" />\n" +
    "            <!-- menu button label or icon goes here -->\n" +
    "        </g>\n" +
    "        <g id=\"itemsContainer\">\n" +
    "            <!-- the menu items -->\n" +
    "        </g>\n" +
    "        <g id=\"symbolsContainer\">\n" +
    "            <!-- replace the contents of these symbols with the contents of your icons -->\n" +
    "        </g>\n" +
    "    </svg>\n" +
    "</div>"
  );

}]);
