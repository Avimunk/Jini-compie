angular.module('JINI.templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/categories/8.html',
    "<search-block></search-block>\r" +
    "\n" +
    "<categories-search-block></categories-search-block>\r" +
    "\n" +
    "<page-block></page-block>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"svgContainer\" ng-attr-class=\"{{ showCategoriesBlock || showObjectBlock || showCategorySearchBlock ? 'closed' : ''}}\" ng-mouseover=\"closeOnMouseover()\">\r" +
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
    "    <div ng-show=\"showCategoriesBlock\" ng-class=\"showCategoriesBlock ? 'collapsed' : ''\" class=\"filterResault\">\r" +
    "\n" +
    "        <span class=\"slogen\">MAKING YOU <span>FEEL</span> LOCAL</span>\r" +
    "\n" +
    "        <div class=\"frButtons\">\r" +
    "\n" +
    "            <a ng-click=\"showCategoriesList()\" ng-class=\"showCategoriesBlockList ? 'active' : ''\" class=\"filter-i\"></a>\r" +
    "\n" +
    "            <a class=\"filter-i-hover\"></a>\r" +
    "\n" +
    "            <a class=\"mapNav-i-hover\"></a>\r" +
    "\n" +
    "            <a ng-click=\"showCategoriesMap();\" ng-class=\"showCategoriesBlockMap ? 'active' : ''\" class=\"mapNav-i\"></a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-show=\"showCategoriesBlock && showCategoriesBlockList\" ng-class=\"showCategoriesBlock && showCategoriesBlockList ? 'collapsed' : ''\" class=\"filter_search_result\">\r" +
    "\n" +
    "        <a ng-click=\"displayHandle.closeAll()\" class=\"back-btn\"></a>\r" +
    "\n" +
    "        <span class=\"ts-title\">Search by categorie {{currentItem.title}}</span>\r" +
    "\n" +
    "        <div class=\"results-list\" scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;width: 429px\">\r" +
    "\n" +
    "            <div ng-repeat=\"(k, v) in sideCategories.data\" class=\"text-separator\">\r" +
    "\n" +
    "                <div class=\"sm-imgText\">\r" +
    "\n" +
    "                    <img ng-src=\"{{mediaUrl + v.featured_image}}\" />\r" +
    "\n" +
    "                    <div class=\"inner-smi\">\r" +
    "\n" +
    "                        <span class=\"smi-title\">{{v.title}}</span>\r" +
    "\n" +
    "                        <p  ng-if=\"v.content\" ng-bind-html=\"v.content | rawHtml\" class=\"smi-text\"></p>\r" +
    "\n" +
    "                        <div class=\"more-info-div\">\r" +
    "\n" +
    "                            <a class=\"more-info\" ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/' + currentItem.title + '/' + v.name + '/'}}\" ng-click=\"closeCategories()\">\r" +
    "\n" +
    "                                <img class=\"crown-i\" ng-if=\"v.promoted\" src=\"images/icons/crown.png\" />\r" +
    "\n" +
    "                                More Info\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"clearfix\"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <a ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/map/' + currentItem.title + '/' + v.name + '/'}}\" class=\"view-map\">\r" +
    "\n" +
    "                    <img src=\"images/icons/g-nav.png\" />\r" +
    "\n" +
    "                    <span>View on map</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-if=\"showCategoriesBlock && showCategoriesBlockMap\" ng-class=\"showCategoriesBlock && showCategoriesBlockMap ? 'collapsed' : ''\" class=\"filter_search_result map\" style=\"width: 1178px;min-height: 955px;\">\r" +
    "\n" +
    "        <a ng-click=\"back()\" class=\"back-btn\"></a>\r" +
    "\n" +
    "        <div id=\"mapFrame\">\r" +
    "\n" +
    "            <category-map ng-if=\"showCategoriesBlock\"></category-map>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/categoriesBlockSearch.html',
    "<div>\r" +
    "\n" +
    "    <div ng-show=\"showCategorySearchBlock\" ng-class=\"showCategorySearchBlock ? 'collapsed' : ''\" class=\"filterResault\">\r" +
    "\n" +
    "        <span class=\"slogen\">MAKING YOU <span>FEEL</span> LOCAL</span>\r" +
    "\n" +
    "        <div class=\"frButtons\">\r" +
    "\n" +
    "            <a ng-click=\"showCategoriesSearchList()\" ng-class=\"showCategoriesSearchBlockList ? 'active' : ''\" class=\"filter-i\"></a>\r" +
    "\n" +
    "            <a class=\"filter-i-hover\"></a>\r" +
    "\n" +
    "            <a class=\"mapNav-i-hover\"></a>\r" +
    "\n" +
    "            <a ng-click=\"showCategoriesSearchMap();\" ng-class=\"showCategoriesSearchBlockMap ? 'active' : ''\" class=\"mapNav-i\"></a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-class=\"showCategorySearchBlock && showCategoriesSearchBlockList ? 'collapsed' : ''\" ng-show=\"showCategorySearchBlock && showCategoriesSearchBlockList\" class=\"filter_search_result\">\r" +
    "\n" +
    "        <a ng-href=\"{{backUrl}}\" ng-if=\"backUrl\" class=\"back-btn\"></a>\r" +
    "\n" +
    "        <span class=\"ts-title\">Search by categorie {{currentItem.title}}</span>\r" +
    "\n" +
    "        <div class=\"results-list\" scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;width: 429px\">\r" +
    "\n" +
    "            <div ng-repeat=\"(k, v) in category_search_result\" class=\"text-separator\">\r" +
    "\n" +
    "                <div class=\"sm-imgText\">\r" +
    "\n" +
    "                    <img ng-src=\"{{content_image ? content_image : mediaUrl + v.featured_image}}\" />\r" +
    "\n" +
    "                    <div class=\"inner-smi\">\r" +
    "\n" +
    "                        <span class=\"smi-title\">{{v.title}}</span>\r" +
    "\n" +
    "                        <p  ng-if=\"v.content\" ng-bind-html=\"v.content | rawHtml\" class=\"smi-text\"></p>\r" +
    "\n" +
    "                        <div class=\"more-info-div\">\r" +
    "\n" +
    "                            <a class=\"more-info\" ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/' + currentItem.title + '/' + v.name + '/fromSearch-' + keywords}}\" ng-click=\"closeCategories()\">\r" +
    "\n" +
    "                                <img class=\"crown-i\" ng-if=\"v.promoted\" src=\"images/icons/crown.png\" />\r" +
    "\n" +
    "                                More Info\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"clearfix\"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <a ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/map/' + currentItem.title + '/' + v.name + '/fromSearch-' + keywords}}\" class=\"view-map\">\r" +
    "\n" +
    "                    <img src=\"images/icons/g-nav.png\" />\r" +
    "\n" +
    "                    <span>View on map</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-class=\"showCategorySearchBlock && showCategoriesSearchBlockMap ? 'collapsed' : ''\" ng-if=\"showCategorySearchBlock && showCategoriesSearchBlockMap\" class=\"filter_search_result map\" style=\"width: 1178px;min-height: 955px;\">\r" +
    "\n" +
    "        <a ng-href=\"{{backUrl}}\" ng-if=\"backUrl\" class=\"back-btn\"></a>\r" +
    "\n" +
    "        <div id=\"mapFrame\">\r" +
    "\n" +
    "            <category-map ng-if=\"showCategorySearchBlock\"></category-map>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/categoryHover.html',
    "<div ng-show=\"showCategoryBlock\" ng-class=\"showCategoryBlock ? 'collapsed' : ''\" class=\"openDiv imgNtext visionDiv categoryHover\">\r" +
    "\n" +
    "    <a  ng-click=\"displayHandle.closeAll()\" class=\"back-btn\"></a>\r" +
    "\n" +
    "    <div ng-if=\"sideCategory.img\" class=\"top\" ng-attr-style=\"{{sideCategory.img ? 'background-image: url(' + mediaUrl + sideCategory.img + ');' : ''}}\">\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%\" class=\"bottom {{sideCategory.img ? 'img' : 'noImg'}}\" >\r" +
    "\n" +
    "        <div class=\"inner-b\">\r" +
    "\n" +
    "            <span class=\"inner-title\">{{sideCategory.title}}</span>\r" +
    "\n" +
    "            <p class=\"inner-text\" ng-if=\"sideCategory.content\" ng-bind-html=\"sideCategory.content | rawHtml\"></p>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!--a class=\"gold-btn\" href=\"#\">Visit our website</a-->\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/objectBlock.html',
    "<div>\r" +
    "\n" +
    "    <div class=\"item_info {{showObjectBlock ? 'collapsed' : ''}}\" ng-class=\"sideObject.content_image ? 'item_info_img' : ''\" ng-show=\"showObjectBlock\">\r" +
    "\n" +
    "        <div scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;width: 542px\" >\r" +
    "\n" +
    "            <div class=\"in-scroller-content\">\r" +
    "\n" +
    "                <a ng-href=\"{{backUrl}}\" ng-if=\"backUrl\" class=\"back-t\">Back to list view</a>\r" +
    "\n" +
    "                <a ng-click=\"displayHandle.closeAll()\" class=\"close-btn\"></a>\r" +
    "\n" +
    "                <div class=\"ii-top\" ng-attr-style=\"{{ sideObject.content_image ? 'background-image: url(' + sideObject.content_image + ');' : ''}}\">\r" +
    "\n" +
    "                    <div class=\"img-top-titles\">\r" +
    "\n" +
    "                        <span class=\"inner-title\">{{ sideObject.title }}</span>\r" +
    "\n" +
    "                        <span class=\"profession\">{{ sideObject.occupation }}</span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"ii-content\">\r" +
    "\n" +
    "                    <div class=\"text-separator first\">\r" +
    "\n" +
    "                        <a class=\"map-btn\" href=\"javascript:void(0)\"><img src=\"images/icons/big-gold-map-nav.png\" /></a>\r" +
    "\n" +
    "                        <div class=\"clearfix\"></div>\r" +
    "\n" +
    "                        <div class=\"i-contact-info\">\r" +
    "\n" +
    "                            <div class=\"info-title\"></div>\r" +
    "\n" +
    "                            <table>\r" +
    "\n" +
    "                                <tr>\r" +
    "\n" +
    "                                    <td class=\"ii-text first\">{{ sideObject.phone }}</td>\r" +
    "\n" +
    "                                    <td class=\"ii-text second\">{{ sideObject.address_street + ' ' + sideObject.address_city }}</td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                                <tr>\r" +
    "\n" +
    "                                    <td class=\"ii-text first\">{{ sideObject.email }}</td>\r" +
    "\n" +
    "                                    <td class=\"ii-text second\">{{ sideObject.french_speakers }}</td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                            </table>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"i-more-info\">\r" +
    "\n" +
    "                            <!--\r" +
    "\n" +
    "                            <div class=\"info-title more\"></div>\r" +
    "\n" +
    "                            <div class=\"row\">\r" +
    "\n" +
    "                                <span class=\"ii-text\">$$$</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <table>\r" +
    "\n" +
    "                                <tr>\r" +
    "\n" +
    "                                    <td class=\"ii-text\">Mon-Thu</td>\r" +
    "\n" +
    "                                    <td class=\"ii-text second\">10:00-19:00</td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                                <tr>\r" +
    "\n" +
    "                                    <td class=\"ii-text\">Fri</td>\r" +
    "\n" +
    "                                    <td class=\"ii-text second\">10:30-13:00</td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                            </table>\r" +
    "\n" +
    "                            -->\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"text-separator\">\r" +
    "\n" +
    "                        <!--\r" +
    "\n" +
    "                        <table class=\"item-services\">\r" +
    "\n" +
    "                            <tr>\r" +
    "\n" +
    "                                <th class=\"first-col\"></th>\r" +
    "\n" +
    "                                <th class=\"middle-col\">Title A</th>\r" +
    "\n" +
    "                                <th class=\"middle-col\">Title B</th>\r" +
    "\n" +
    "                                <th></th>\r" +
    "\n" +
    "                            </tr>\r" +
    "\n" +
    "                            <tr>\r" +
    "\n" +
    "                                <td>parking</td>\r" +
    "\n" +
    "                                <td><span class=\"bullet\"></span></td>\r" +
    "\n" +
    "                                <td></td>\r" +
    "\n" +
    "                                <td></td>\r" +
    "\n" +
    "                            </tr>\r" +
    "\n" +
    "                            <tr>\r" +
    "\n" +
    "                                <td>livraison</td>\r" +
    "\n" +
    "                                <td></td>\r" +
    "\n" +
    "                                <td><span class=\"bullet\"></span></td>\r" +
    "\n" +
    "                                <td></td>\r" +
    "\n" +
    "                            </tr>\r" +
    "\n" +
    "                            <tr>\r" +
    "\n" +
    "                                <td>Koupat Holim</td>\r" +
    "\n" +
    "                                <td><span class=\"bullet\"></span></td>\r" +
    "\n" +
    "                                <td><span class=\"bullet\"></span></td>\r" +
    "\n" +
    "                                <td></td>\r" +
    "\n" +
    "                            </tr>\r" +
    "\n" +
    "                        </table>\r" +
    "\n" +
    "                        -->\r" +
    "\n" +
    "                        <p ng-bind-html=\"sideObject.content | rawHtml\"></p>\r" +
    "\n" +
    "                        <p ng-repeat=\"(k,v) in a track by $index\">\r" +
    "\n" +
    "                            asda-{{k}}<br>\r" +
    "\n" +
    "                        </p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div ng-if=\"showObjectBlock && showObjectBlockMap\" class=\"filter_search_result map object\" style=\"width: 1178px;min-height: 955px;\">\r" +
    "\n" +
    "        <!--<a ng-click=\"back()\" class=\"back-btn\"></a>-->\r" +
    "\n" +
    "        <div id=\"mapFrame\">\r" +
    "\n" +
    "            <object-map data-lng=\"{{ sideObject.lng }}\" data-lat=\"{{ sideObject.lat }}\" ng-if=\"showObjectBlock\"></object-map>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('templates/directives/pageBlock.html',
    "<div ng-if=\"pageBlock\" ng-class=\"pageBlock ? 'collapsed' : ''\" class=\"openDiv imgNtext visionDiv pageBlock\">\r" +
    "\n" +
    "    <a href=\"#/\" class=\"back-btn\"></a>\r" +
    "\n" +
    "    <div class=\"top\" ng-attr-style=\"{{pageContent.img ? 'background-image:url(/Jini3/images/'+ pageContent.img +')' : ''}}\"></div>\r" +
    "\n" +
    "    <div class=\"bottom\">\r" +
    "\n" +
    "        <div class=\"inner-b\" scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;padding: 20px;\">\r" +
    "\n" +
    "            <span class=\"inner-title\">{{pageContent.title}}</span>\r" +
    "\n" +
    "            <p class=\"inner-text\" ng-bind-html=\"pageContent.content | rawHtml\"></p>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!--a class=\"gold-btn\" href=\"#\">Visit our website</a-->\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/searchBlock.html',
    "<div ng-show=\"showSearchBlock\" class=\"search_results\">\r" +
    "\n" +
    "    <div class=\"top_strip\">\r" +
    "\n" +
    "        <span ng-show=\"center_search_result.count\" class=\"numOfRes\"><span class=\"bold\">{{center_search_result.count}}</span> Results for {{keywords}}</span>\r" +
    "\n" +
    "        <span ng-show=\"!center_search_result.count && keywords.length\" class=\"numOfRes\">No results for {{keywords}}</span>\r" +
    "\n" +
    "        <span ng-show=\"!center_search_result.count && !keywords.length\" class=\"numOfRes\">Please type something to start</span>\r" +
    "\n" +
    "        <div class=\"clearfix\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"inner_sr\" scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;width: 435px\">\r" +
    "\n" +
    "        <div ng-repeat=\"(catID, catData) in center_search_result.data\" class=\"search_word_sec\">\r" +
    "\n" +
    "            <a ng-href=\"{{'#/' + catID + '/' + catData.name + '/search/' + keywords}}\" class=\"sws-title\">{{catData.title}}</a>\r" +
    "\n" +
    "            <span class=\"numOfRes\">{{catData.itemsCount}} results</span>\r" +
    "\n" +
    "            <div ng-repeat=\"item in catData.items\" class=\"text-separator\">\r" +
    "\n" +
    "                <a ng-href=\"{{'#/' + catID + '-' + item.id + '/' + catData.title + '/' + item.name + '/fromSearch-' + keywords}}\" class=\"smi-title\">{{item.title | cut:true:35:' ...'}}</a>\r" +
    "\n" +
    "                <p class=\"smi-text\" ng-if=\"item.excerpt\" ng-bind-html=\"item.excerpt | cut:true:150:' ...' | rawHtml\">Apartment description by the owner or advertiser Apartment description by the owner or advertiser...</p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);