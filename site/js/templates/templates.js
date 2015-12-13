angular.module('JINI.templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/directives/categoriesBlock.html',
    "<div>\r" +
    "\n" +
    "    <div ng-show=\"showCategoriesBlock\" ng-class=\"showCategoriesBlock ? 'collapsed' : ''\" class=\"filterResault\">\r" +
    "\n" +
    "        <a ng-click=\"displayHandle.closeAll()\" class=\"back-btn\"></a>\r" +
    "\n" +
    "        <span class=\"slogen\">Votre connexion à Israël – Tous nos services & informations réunis dans un même clic et dans votre langue.</span>\r" +
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
    "        <div class=\"innerSpinner spinner\" ng-hide=\"showCategoriesBlockMap || sideCategories\">\r" +
    "\n" +
    "            <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "            <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <span class=\"ts-title\">Search by categorie {{currentItem.title}}</span>\r" +
    "\n" +
    "        <div class=\"results-list\" scrollbar=\"{autoUpdate: true,wheelSpeed : 20, reFetchOnScroll:true, fetchType: 'category'}\" nextUrl=\"{{regularCategoryOffsetCount}}\" style=\"max-height: 100%;width: 429px\">\r" +
    "\n" +
    "            <div ng-repeat=\"(k, v) in sideCategories\" class=\"text-separator\">\r" +
    "\n" +
    "                <div class=\"sm-imgText\">\r" +
    "\n" +
    "                    <img ng-src=\"{{v.featured_image ? mediaUrl + v.featured_image : mediaUrl + currentItem.featuredImageUrl }}\" />\r" +
    "\n" +
    "                    <div class=\"inner-smi\">\r" +
    "\n" +
    "                        <span class=\"smi-title\">{{v.title}}</span>\r" +
    "\n" +
    "                        <p  ng-if=\"v.content\" ng-bind-html=\"v.content | rawHtml\" class=\"smi-text\"></p>\r" +
    "\n" +
    "                        <div class=\"more-info-div\">\r" +
    "\n" +
    "                            <a class=\"more-info\" ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/cat/' + currentItem.title + '/' + v.name + '/'}}\" ng-click=\"closeCategories()\">\r" +
    "\n" +
    "                                <img class=\"crown-i\" ng-if=\"v.score >= 1\" src=\"images/icons/crown.png\" />\r" +
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
    "                <a ng-show=\"v.address_location_g != '' && v.address_location_k != '' && v.address_location_g != null && v.address_location_k != null\" ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/map/' + currentItem.title + '/' + v.name + '/'}}\" class=\"view-map\">\r" +
    "\n" +
    "                    <div></div>\r" +
    "\n" +
    "                    <span>Afficher sur la carte</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-show=\"regularCategoryFetchMoreStarted\" style=\"position: relative;width:auto;height: 100px\">\r" +
    "\n" +
    "                <div class=\"innerSpinner spinner\">\r" +
    "\n" +
    "                    <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "                    <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-if=\"showCategoriesBlock && showCategoriesBlockMap\" ng-class=\"showCategoriesBlock && showCategoriesBlockMap ? 'collapsed' : ''\" class=\"filter_search_result map\" ng-attr-style=\"{{closeMapImportant ? 'width:0 !important' : ''}}\" style=\"width: 1178px;min-height: 955px;\">\r" +
    "\n" +
    "        <a ng-click=\"back()\" class=\"back-btn\"></a>\r" +
    "\n" +
    "        <div id=\"mapFrame\">\r" +
    "\n" +
    "            <div class=\"innerSpinner spinner\" ng-hide=\"categoryMapItemsLoaded\">\r" +
    "\n" +
    "                <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "                <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "            </div>\r" +
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
    "        <a ng-href=\"{{backUrl}}\" ng-if=\"backUrl\" class=\"back-btn\"></a>\r" +
    "\n" +
    "        <span class=\"slogen\">Votre connexion à Israël – Tous nos services & informations réunis dans un même clic et dans votre langue.</span>\r" +
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
    "        <div class=\"innerSpinner spinner\" ng-hide=\"showCategoriesSearchBlockMap || category_search_result\">\r" +
    "\n" +
    "            <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "            <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <span class=\"ts-title\">Search by categorie {{currentItem.title}}</span>\r" +
    "\n" +
    "        <div class=\"results-list\" scrollbar=\"{autoUpdate: true,wheelSpeed : 20, reFetchOnScroll:true, fetchType: 'searchInCategory'}\" nextUrl=\"{{offsetCount}}\" style=\"max-height: 100%;width: 429px\">\r" +
    "\n" +
    "            <div ng-repeat=\"(k, v) in category_search_result\" class=\"text-separator\">\r" +
    "\n" +
    "                <div class=\"sm-imgText\">\r" +
    "\n" +
    "                    <img ng-src=\"{{v.featured_image ? mediaUrl + v.featured_image : mediaUrl + currentItem.featuredImageUrl }}\" />\r" +
    "\n" +
    "                    <div class=\"inner-smi\">\r" +
    "\n" +
    "                        <span class=\"smi-title\">{{v.title}}</span>\r" +
    "\n" +
    "                        <p  ng-if=\"v.content\" ng-bind-html=\"v.content | rawHtml\" class=\"smi-text\"></p>\r" +
    "\n" +
    "                        <div class=\"more-info-div\">\r" +
    "\n" +
    "                            <a class=\"more-info\" ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/' + currentItem.title + '/' + v.name + '/fromSearch-' + keywords.keywords}}\" ng-click=\"closeCategories()\">\r" +
    "\n" +
    "                                <img class=\"crown-i\" ng-if=\"v.score >= 1\" src=\"images/icons/crown.png\" />\r" +
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
    "                <a ng-show=\"v.address_location_g != '' && v.address_location_k != '' && v.address_location_g != null && v.address_location_k != null\" ng-href=\"{{'#/' + currentItem.id + '-' + v.id + '/map/' + currentItem.title + '/' + v.name + '/fromSearch-' + keywords.keywords}}\" class=\"view-map\">\r" +
    "\n" +
    "                    <div></div>\r" +
    "\n" +
    "                    <span>Afficher sur la carte</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-show=\"fetchMoreStarted\" style=\"position: relative;width:auto;height: 100px\">\r" +
    "\n" +
    "                <div class=\"innerSpinner spinner\">\r" +
    "\n" +
    "                    <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "                    <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "                </div>\r" +
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
    "            <div class=\"innerSpinner spinner\" ng-hide=\"categoryMapItemsLoaded\">\r" +
    "\n" +
    "                <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "                <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "            </div>\r" +
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
    "    <div lazy-img='{{mediaUrl + sideCategory.img}}' ng-if=\"sideCategory.img\" class=\"top\">\r" +
    "\n" +
    "        <!--ng-attr-style=\"{{sideCategory.img ? 'background-image: url(' + mediaUrl + sideCategory.img + ');' : ''}}\" -->\r" +
    "\n" +
    "        <div class=\"innerSpinner spinner\" style=\"display: none\">\r" +
    "\n" +
    "            <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "            <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "        </div>\r" +
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
    "    <div class=\"item_info {{showObjectBlock ? 'collapsed' : ''}}\" ng-class=\"sideObject._content_image ? 'item_info_img' : ''\" ng-show=\"showObjectBlock\">\r" +
    "\n" +
    "        <div scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;width: 542px\" >\r" +
    "\n" +
    "            <div class=\"in-scroller-content\">\r" +
    "\n" +
    "                <a ng-href=\"{{backUrl}}\" ng-if=\"backUrl\" class=\"back-t\">Revenir à la liste des résultats</a>\r" +
    "\n" +
    "                <a ng-click=\"displayHandle.closeAll()\" class=\"close-btn\"></a>\r" +
    "\n" +
    "                <div class=\"ii-top\" lazy-img=\"{{ sideObject._content_image ? mediaUrl + sideObject._content_image : ''}}\">\r" +
    "\n" +
    "                    <!--  ng-attr-style=\"{{ sideObject.content_image ? 'background-image: url(' + mediaUrl + sideObject.content_image + ');' : ''}}\" -->\r" +
    "\n" +
    "                    <div class=\"innerSpinner spinner\" style=\"display: none\">\r" +
    "\n" +
    "                        <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "                        <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "                    </div>\r" +
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
    "                    <div ng-show=\"sideObject.map\" class=\"text-separator map\">\r" +
    "\n" +
    "                        <a class=\"map-btn {{showObjectBlockMap ? 'active' : ''}}\" ng-href=\"{{objectMapUrl}}\">\r" +
    "\n" +
    "                            <div></div>\r" +
    "\n" +
    "                        </a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div ng-class=\"{'first' : !sideObject.map}\" class=\"text-separator\">\r" +
    "\n" +
    "                        <p ng-bind-html=\"sideObject.content | rawHtml\" class=\"objectContent\"></p>\r" +
    "\n" +
    "                        <div class=\"clearfix\"></div>\r" +
    "\n" +
    "                        <div ng-show=\"sideObject.hasContact || sideObject.hasContactAddress\" class=\"i-contact-info\">\r" +
    "\n" +
    "                            <div class=\"info-title\"></div>\r" +
    "\n" +
    "                            <table>\r" +
    "\n" +
    "                                <tr ng-show=\"sideObject.hasContact\">\r" +
    "\n" +
    "                                    <td class=\"ii-text first\">{{ sideObject.phone }}</td>\r" +
    "\n" +
    "                                    <td class=\"ii-text second\">{{ sideObject.email }}</td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                                <tr ng-show=\"sideObject.hasContactAddress\">\r" +
    "\n" +
    "                                    <td class=\"ii-text\">{{ sideObject.address.address + ' ' + sideObject.address.city }}</td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                            </table>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"i-more-info\" ng-show=\"sideObject.more\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <div class=\"info-title more\"></div>\r" +
    "\n" +
    "                            <table class=\"more\">\r" +
    "\n" +
    "                                <tr ng-repeat=\"item in sideObject.more\">\r" +
    "\n" +
    "                                    <td data-type=\"{{item.type}}\" class=\"ii-text\">{{item.key}}:</td>\r" +
    "\n" +
    "                                    <td ng-if=\"item.type == 'checkbox' || item.type == 'boolean'\" class=\"ii-text second\">{{item.value ? 'v' : 'x'}}</td>\r" +
    "\n" +
    "                                    <td ng-if=\"item.type == 'text'\" class=\"ii-text second\">{{item.value}}</td>\r" +
    "\n" +
    "                                    <td ng-if=\"item.type == 'tel'\" class=\"ii-text second\"><a ng-href=\"tel:{{item.value}}\">{{item.value}}</a></td>\r" +
    "\n" +
    "                                    <td ng-if=\"item.type == 'wysiwyg'\" ng-bind-html=\"item.value | rawHtml\" class=\"ii-text second\"></td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                            </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <!--\r" +
    "\n" +
    "                        <div class=\"text-separator\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <table class=\"item-services\">\r" +
    "\n" +
    "                                <tr>\r" +
    "\n" +
    "                                    <th class=\"first-col\"></th>\r" +
    "\n" +
    "                                    <th class=\"middle-col\">Title A</th>\r" +
    "\n" +
    "                                    <th class=\"middle-col\">Title B</th>\r" +
    "\n" +
    "                                    <th></th>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                                <tr>\r" +
    "\n" +
    "                                    <td>parking</td>\r" +
    "\n" +
    "                                    <td><span class=\"bullet\"></span></td>\r" +
    "\n" +
    "                                    <td></td>\r" +
    "\n" +
    "                                    <td></td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                                <tr>\r" +
    "\n" +
    "                                    <td>livraison</td>\r" +
    "\n" +
    "                                    <td></td>\r" +
    "\n" +
    "                                    <td><span class=\"bullet\"></span></td>\r" +
    "\n" +
    "                                    <td></td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                                <tr>\r" +
    "\n" +
    "                                    <td>Koupat Holim</td>\r" +
    "\n" +
    "                                    <td><span class=\"bullet\"></span></td>\r" +
    "\n" +
    "                                    <td><span class=\"bullet\"></span></td>\r" +
    "\n" +
    "                                    <td></td>\r" +
    "\n" +
    "                                </tr>\r" +
    "\n" +
    "                            </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    -->\r" +
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
    "<div ng-if=\"pageBlock\" class=\"pageBlock\">\r" +
    "\n" +
    "    <div ng-switch=\"currentPage\">\r" +
    "\n" +
    "        <div ng-switch-when=\"contact\" ng-class=\"pageBlock && currentPage == 'contact' ? 'collapsed' : ''\" class=\"contactUs\">\r" +
    "\n" +
    "            <div scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;width: 542px;\">\r" +
    "\n" +
    "                <div class=\"inner\">\r" +
    "\n" +
    "                    <a href=\"#/\" class=\"back-btn black-b\"></a>\r" +
    "\n" +
    "                    <span class=\"inner-title\">{{pageContent.title}}</span>\r" +
    "\n" +
    "                    <p class=\"inner-text\" ng-bind-html=\"pageContent.content | rawHtml\"></p>\r" +
    "\n" +
    "                    <div class=\"success\" ng-show=\"success\">\r" +
    "\n" +
    "                        {{successText}}\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <form ng-hide=\"success\" name=\"contactForm\" novalidate valdr-type=\"Contact\">\r" +
    "\n" +
    "                        <div valdr-form-group>\r" +
    "\n" +
    "                            <input\r" +
    "\n" +
    "                                type=\"text\"\r" +
    "\n" +
    "                                placeholder=\"Nom\"\r" +
    "\n" +
    "                                ng-model=\"contact.name\"\r" +
    "\n" +
    "                                name=\"name\"/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div valdr-form-group>\r" +
    "\n" +
    "                            <input\r" +
    "\n" +
    "                                type=\"text\"\r" +
    "\n" +
    "                                placeholder=\"Téléphone\"\r" +
    "\n" +
    "                                ng-model=\"contact.phone\"\r" +
    "\n" +
    "                                name=\"phone\"/>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div valdr-form-group>\r" +
    "\n" +
    "                            <input\r" +
    "\n" +
    "                                type=\"text\"\r" +
    "\n" +
    "                                placeholder=\"E-mail\"\r" +
    "\n" +
    "                                ng-model=\"contact.email\"\r" +
    "\n" +
    "                                name=\"email\"/>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div valdr-form-group>\r" +
    "\n" +
    "                            <select\r" +
    "\n" +
    "                                ng-model=\"contact.reason\"\r" +
    "\n" +
    "                                name=\"reason\">\r" +
    "\n" +
    "                                <option ng-repeat=\"v in pageContent.form.reasons\" value=\"{{v.crm_id}}\">{{v.content}}</option>\r" +
    "\n" +
    "                            </select>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div valdr-form-group>\r" +
    "\n" +
    "                            <textarea\r" +
    "\n" +
    "                                ng-model=\"contact.message\"\r" +
    "\n" +
    "                                name=\"message\"\r" +
    "\n" +
    "                                placeholder=\"Message\"></textarea>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-if=\"!success && error\">\r" +
    "\n" +
    "                            {{error}}\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <input type=\"submit\" class=\"gold-btn\" ng-click=\"validate(contactForm)\" value=\"Envoyé\" />\r" +
    "\n" +
    "                        <span class=\"error-txt\" ng-show=\"notValid\">There are some errors / empty fields in the form, please fix them.</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </form>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div ng-switch-when=\"recommended\" ng-class=\"pageBlock && currentPage == 'recommended' ? 'collapsed' : ''\" class=\"recommendedDiv imgNtext rd2\">\r" +
    "\n" +
    "            <div scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;width: 542px;height: 855px;\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <a href=\"#/\" class=\"back-btn\"></a>\r" +
    "\n" +
    "                    <div class=\"top-no-img\">\r" +
    "\n" +
    "                        <span class=\"inner-title\">{{pageContent.title}}</span>\r" +
    "\n" +
    "                        <p class=\"inner-text\" ng-bind-html=\"pageContent.subTitle | rawHtml\"></p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"bottom\">\r" +
    "\n" +
    "                        <div class=\"inner-b\">\r" +
    "\n" +
    "                            <div class=\"text-separator\" ng-repeat=\"item in pageContent.items\">\r" +
    "\n" +
    "                                <div class=\"sm-imgText\" ng-if=\"item.img\">\r" +
    "\n" +
    "                                    <img ng-src=\"{{'images/small-images/' + item.img}}\" />\r" +
    "\n" +
    "                                    <div class=\"inner-smi\">\r" +
    "\n" +
    "                                        <span class=\"smi-title\">{{item.title}}</span>\r" +
    "\n" +
    "                                        <p class=\"smi-text\" ng-bind-html=\"item.content | rawHtml\"></p>\r" +
    "\n" +
    "                                        <div class=\"more-info-div\">\r" +
    "\n" +
    "                                            <a class=\"more-info\" ng-href=\"{{item.url}}\">More Info</a>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <div class=\"clearfix\"></div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div ng-if=\"!item.img\">\r" +
    "\n" +
    "                                    <span class=\"ts-title\">{{item.title}}</span>\r" +
    "\n" +
    "                                    <p class=\"inner-text\" ng-bind-html=\"item.content | rawHtml\"></p>\r" +
    "\n" +
    "                                    <div class=\"more-info-div\">\r" +
    "\n" +
    "                                        <a class=\"more-info\" ng-href=\"{{item.url}}\">More Info</a>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div ng-switch-when=\"24news\" ng-class=\"pageBlock && currentPage == '24news' ? 'collapsed' : ''\" class=\"channel24 visionDiv imgNtext rd2\">\r" +
    "\n" +
    "            <a href=\"#/\" class=\"back-btn\"></a>\r" +
    "\n" +
    "            <div class=\"top\" lazy-img=\"{{pageContent.img ? '/Jini3/images/'+ pageContent.img : ''}}\" ng-if=\"pageContent.img\" >\r" +
    "\n" +
    "                <!--  ng-attr-style=\"{{pageContent.img ? 'background-image:url(/Jini3/images/'+ pageContent.img +')' : ''}}\" -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"bottom\">\r" +
    "\n" +
    "                <div class=\"inner-b\" scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;padding: 20px;\">\r" +
    "\n" +
    "                    <div ng-repeat=\"item in pageContent.items\">\r" +
    "\n" +
    "                        <span class=\"inner-title\">{{item.title}}</span>\r" +
    "\n" +
    "                        <p class=\"inner-text\" ng-bind-html=\"item.content | rawHtml\"></p>\r" +
    "\n" +
    "                        <a class=\"black-btn\" ng-href=\"{{item.url}}\" target=\"_blank\">Visiter le site web</a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div ng-switch-default ng-class=\"pageBlock ? 'collapsed' : ''\" class=\"imgNtext visionDiv\">\r" +
    "\n" +
    "            <a href=\"#/\" class=\"back-btn\"></a>\r" +
    "\n" +
    "            <div class=\"top\" lazy-img=\"{{pageContent.img ? '/Jini3/images/'+ pageContent.img : ''}}\" ng-if=\"pageContent.img\" >\r" +
    "\n" +
    "                <!--  ng-attr-style=\"{{pageContent.img ? 'background-image:url(/Jini3/images/'+ pageContent.img +')' : ''}}\" -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"bottom\">\r" +
    "\n" +
    "                <div class=\"inner-b\" scrollbar=\"{autoUpdate: true,wheelSpeed : 20}\" style=\"max-height: 100%;padding: 20px;\">\r" +
    "\n" +
    "                    <span class=\"inner-title\">{{pageContent.title}}</span>\r" +
    "\n" +
    "                    <p class=\"inner-text\" ng-bind-html=\"pageContent.content | rawHtml\"></p>\r" +
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


  $templateCache.put('templates/directives/searchBlock.html',
    "<div ng-show=\"showSearchBlock\" class=\"search_results\">\r" +
    "\n" +
    "    <div class=\"innerSpinner spinner\" ng-hide=\"center_search_result\">\r" +
    "\n" +
    "        <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "        <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"top_strip\">\r" +
    "\n" +
    "        <span ng-show=\"center_search_result.count\" class=\"numOfRes\"><span class=\"bold\">{{center_search_result.count}}</span> Résultats pour {{keywords.keywords}}</span>\r" +
    "\n" +
    "        <span ng-show=\"!center_search_result.count && keywords.keywords.length\" class=\"numOfRes\">Aucun résultat trouvé pour {{keywords.keywords}}</span>\r" +
    "\n" +
    "        <span ng-show=\"!center_search_result.count && !keywords.keywords.length\" class=\"numOfRes\">S'il vous plaît taper quelque chose pour commencer</span>\r" +
    "\n" +
    "        <div class=\"clearfix\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"inner_sr\" scrollbar=\"{autoUpdate: true,wheelSpeed : 20, reFetchOnScroll:true, fetchType: 'searchPage'}\" nextUrl=\"{{searchPageOffsetCount}}\" style=\"max-height: 100%;width: 435px\">\r" +
    "\n" +
    "        <div ng-repeat=\"(catID, catData) in center_search_result.data\" class=\"search_word_sec\">\r" +
    "\n" +
    "            <a ng-href=\"{{'#/' + catData.id + '/' + catData.name + '/search/' + keywords.keywords}}\" class=\"sws-title\">{{catData.title | cut:true:23:' ...'}}</a>\r" +
    "\n" +
    "            <span class=\"numOfRes\">{{catData.itemsCount}} résultat</span>\r" +
    "\n" +
    "            <div class=\"category-breadcrumbs\">\r" +
    "\n" +
    "                <span ng-if=\"!$last\" ng-repeat=\"(k, v) in allBreadCrumbs[catData.id]\">\r" +
    "\n" +
    "                    <!--{{v.title}}-->\r" +
    "\n" +
    "                    <a ng-href=\"{{'#/' + v.id + '/' + v.url}}\">{{v.title}}</a>\r" +
    "\n" +
    "                    <span ng-if=\"allBreadCrumbs[catData.id].length - 2 != $index\">/</span>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-repeat=\"item in catData.items\" class=\"text-separator\">\r" +
    "\n" +
    "                <a ng-href=\"{{'#/' + catData.id + '-' + item.id + '/' + catData.title + '/' + item.name + '/fromSearch-' + keywords.keywords}}\" class=\"smi-title\">{{item.title | cut:true:35:' ...'}}</a>\r" +
    "\n" +
    "                <p class=\"smi-text\" ng-if=\"item.excerpt\" ng-bind-html=\"item.excerpt | cut:true:150:' ...' | rawHtml\">Apartment description by the owner or advertiser Apartment description by the owner or advertiser...</p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div ng-show=\"searchPageFetchMoreStarted\" style=\"position: relative;width:auto;height: 100px\">\r" +
    "\n" +
    "            <div class=\"innerSpinner spinner\">\r" +
    "\n" +
    "                <div class=\"double-bounce1\"></div>\r" +
    "\n" +
    "                <div class=\"double-bounce2\"></div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/main/content.html',
    "<div id=\"svgContainer\" ng-attr-class=\"{{ showCategoriesBlock || showObjectBlock || showCategorySearchBlock ? 'closed' : ''}}\" ng-mouseover=\"closeMenuOnMouseover()\">\r" +
    "\n" +
    "    <a title=\"Accueil\" ng-if=\"parentID == 0\" ng-href=\"#/\" class=\"back-button home\"></a>\r" +
    "\n" +
    "    <a title=\"Back to parent Category\" ng-if=\"parentID != 0 && parentID != null\" ng-href=\"{{'#/' + parentID.id + '/' + parentID.name}}\" class=\"back-button\"></a>\r" +
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
    "                <text ng-if=\"currentCategoriesLength == 2\" fill=\"#222\" dx=\"-30\" y=\"0\" dy=\"-95px\" text-anchor=\"middle\" font-size=\"22px\">{{v.newTitle ? v.newTitle[1] : v.title}}</text>\r" +
    "\n" +
    "                <text ng-if=\"currentCategoriesLength == 2 && v.newTitle\" fill=\"#222\" dx=\"-30\" y=\"0\" dy=\"-120px\" text-anchor=\"middle\" font-size=\"22px\">{{v.newTitle[0]}}</text>\r" +
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
    "            <a ng-repeat=\"(k, v) in currentCategories\" ng-class=\"{{ currentID == k ? 'current' : ''}}\" ng-attr-data-category-id=\"{{k}}\" ng-init=\"$last ? fixPie() : ''\" ng-click=\"currentItem && currentItem.id == v.id ? openItem(currentItem) : ''\" ng-attr-target=\"{{v.target}}\" ng-href=\"{{v.url ? v.url : '#/' + k + '/' + v.name}}\" ng-mouseover=\"imageOn(v);categoryHoverHelper(v)\" ng-mouseout=\"disableCategoryHover(v.id)\" class=\"item\" id=\"item-{{$index+1}}\" data-title=\"{{v.title}}\" data-featured-image=\"{{v.featuredImageUrl}}\" data-content-image=\"{{v.contentImageUrl}}\" role=\"link\" tabindex=\"0\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\" \" ng-attr-transform=\"{{pie[currentCategoriesLength].transform_a[$index]}}\" data-svg-origin=\"{{pie[currentCategoriesLength].global.svgOrigin}}\" ng-attr-style=\"{{ isFirst ? 'transform: matrix(0, 0, 0, 0, 250, 250);' : ''}}\">\r" +
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
    "</div>\r" +
    "\n" +
    "<search-block></search-block>\r" +
    "\n" +
    "<categories-search-block></categories-search-block>\r" +
    "\n" +
    "<page-block></page-block>"
  );

}]);
