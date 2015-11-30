<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*// Password change:
Route::get('/a', function(){
    $user = \App\User::find(1);
    $user->password = bcrypt(123456);
    $user->save();
    dd($user);
});*/

/* Tiny png */
Route::get('/tinypng', function(){

    $refreshThisPage = false;
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        if ($action == 'getfiles') {
            ini_set('memory_limit', '1G');
            if (isset($_GET['path'])) {
                $path = $_GET['path'];
            } else {
                die("PATH was not included");
            }
            $round = ((integer) \App\ResizesTinypng::max('round')) + 1;

            $files_arr = getAllImageFilesInPath($path, false);
            foreach ($files_arr as $files) {
                $file = true;//$files['file'];
                $real_path = $files['real_path'];
                $filename = $files['filename'];
                $timeAdded = time();
                $error = $files['error'];
                if (!$file) {
                    var_dump('failed', $files);
//                $error = $files['error'] . " - Unable to open remote file (image not supported)";
                    insertIntoTableResizes($round, $filename, $real_path, 0, $error, 0, $timeAdded);
//                die();
                    continue;
                } else {
                    //...Do something with every file
//                $error = $files['error'];
                    insertIntoTableResizes($round, $filename, $real_path, 0, $error, 0, $timeAdded);
                }
            }
            die("COMPLETE");
        }
        if ($action == 'tinyfiles') {
            if (isset($_GET['round'])) {
                $round = $_GET['round'];
            } else {
                die("ROUND was not included");
            }
            $counter = 0;
            $results_table = selectByRoundNumber($round);
            if (!empty($results_table)) {
                //echo '<meta http-equiv="refresh" content="10">';
                foreach($results_table as $res_row)
                {
                    $refreshThisPage = true;
                    $counter++;
                    $result_array = array(
                        'id' => intval($res_row['id']),
                        'round' => intval($res_row['round']),
                        'filename' => $res_row['file_name'],
                        'path' => $res_row['path'], //path to image
                        'runTiny' => intval($res_row['run_tiny']),
                        'error' => $res_row['error'],
                        'timeTiny' => intval($res_row['time_tiny']),
                        'timeAdded' => intval($res_row['created_at'])
                    );
                    $row_obj = array_to_object($result_array);
                    $error_message = "N";

                    //START >> tinify images
                    $tmp_path = str_replace(getcwd() . '/', "", $row_obj->path);//GET SERVER PATH
                    $save_path = str_replace($row_obj->filename, "", $tmp_path);//OVERRIDE CURRENT LOCATION
                    $flag = tinifyImage($row_obj->path, $save_path);
                    if ($flag === false) {
                        if ($error_message == "N") {
                            $error_message = "Y - Compression failed";
                        } else {
                            $error_message .= " - Compression failed";
                        }
                    }
                    //END << tinify image

                    //UPDATE DB
                    updateTableResizes($row_obj->id, $row_obj->round, $row_obj->filename, $row_obj->path, 1, $error_message, time(), $row_obj->timeAdded);

                    if ($counter == 3) {
                        break;
                    }
                }
            }
            $totalAll7 = countAllByRoundNumber($round);
            $total_success = countSuccessfulByRoundNumber($round);
            $total_failed = countFailedByRoundNumber($round);
            $badFiles = array();
            if (!empty($total_failed)) {
                $failed_results = selectFailedByRoundNumber($round);
                foreach($failed_results as $row)
                {
                    $result_array = array(
                        'id' => intval($row['id']),
                        'filename' => $row['file_name'],
                        'error' => $row['error'],
                    );
                    $badFiles[] = $result_array;
                }
            }
            echo '<p style="color: black; font-size: large; font-family: Arial, Helvetica, sans-serif;">TOTAL: <strong>' . $totalAll7 . '</strong></p>';
            echo '<hr>';
            echo '<p style="color: green; font-size: large; font-family: Arial, Helvetica, sans-serif;">SUCCESSFUL: <strong>' . $total_success . '</strong></p>';
            echo '<hr>';
            echo '<p style="color: red;  font-size: large; font-family: Arial, Helvetica, sans-serif;">FAILED:  <strong>' . $total_failed . '</strong></p>';
            if (!empty($badFiles)) {
                echo '<br>';
                $index = 0;
                foreach ($badFiles as $item) {
                    $index++;
                    echo '<div style="color: cornflowerblue; font-family: Arial, Helvetica, sans-serif;">'
                        . '<div style="float: left; padding: 20px 10px 5px 5px;">'
                        . '<span> #' . $index . '</span>'
                        . '</div>'
                        . '<div style="float: left;">'
                        . '<span>ID: </span>' . $item['id'] . '<br>'
                        . '<span>File name: </span>' . $item['filename'] . '<br>'
                        . '<span>Error message: </span>' . $item['error']
                        . '</div>'
                        . '</div>';
                    echo '<br>';
                }
            }

        }
    }

    if($refreshThisPage)
        die('<meta http-equiv="refresh" content="2">');
    else
        die('Done!');
});

/* Crop and resize images */
Route::get('/crop', function(){

    ini_set('memory_limit', '1G');

    $results = \App\ObjectMeta::where('object_meta.meta_key', '_file_path')
        ->join('object_meta AS om', function($join){
            $join->on('object_meta.object_id', '=', 'om.object_id')
                ->where('om.meta_key', '=', '_image_info');
        })
        ->join('object_meta AS om2', 'object_meta.object_id', '=', 'om2.meta_value')
        ->join('objects as obj', 'obj.id', '=', 'om2.object_id')
        ->select('object_meta.object_id', 'object_meta.meta_value AS path', 'om2.meta_key AS type', 'om2.object_id AS parentObjectID', 'obj.type AS parentObjectType')
        ->groupBy('path')
        ->get()
    ;
//    dd($results->get()->toArray());

    if(isset($_GET['type']) && $_GET['type'] == 'content')
    {
        $content = $results->reject(function(&$v){
            $v->info = unserialize($v->info);
            return $v->type == '_featured_image';
        });

        ini_set('max_execution_time', 300);

        $failed = array();
        foreach($content as $image)
        {
            $x = autoCrop(0, $image->path, $image->type);
//            echo $image->path . '<br>';
//            echo $image->type . '<br>';
//            var_dump($x);
            if($x === false)
            {
                $failed[] = $image->toArray();
            }
//            echo '<hr>';
        }

        if($failed)
        {
            echo '<table style="border-color: #048108 !important;border-spacing: 0;" border="1" cellpadding="0">';
            echo '<thead style="background: #048108; color: white; font-weight: bold;">';
            echo '<tr>';
            echo '<td>Type</td>';
            echo '<td>Image type</td>';
            echo '<td>Image path</td>';
            echo '<td>Object ID</td>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';
            foreach($failed as $item)
            {
                echo '<tr>';
                echo '<td>'.($item['parentObjectType'] == 'category' ? 'Category' : 'Object '. '(type: '.$item['parentObjectType'].')').'</td>';
                echo '<td style="text-align: center">'.($item['type'] == '_featured_image' ? 'Featured' : 'Content').'</td>';
                echo '<td>'.$item['path'].'</td>';
                echo '<td style="text-align: center"><a href="'.url('admin/'.($item['parentObjectType'] == 'category' ? 'categories' : 'objects')."/{$item['parentObjectID']}/edit").'">'.$item['parentObjectID'].'</a></td>';
                echo '</tr>';
            }
            echo '</tbody>';
            echo '<table>';
        }
        echo '<style>td{padding: 2px 5px;}</style><pre>';
        die('Done!');
    }

    if(isset($_GET['type']) && $_GET['type'] == 'featured')
    {
        $featured = $results->filter(function(&$v){
            return $v->type == '_featured_image';
        });

        ini_set('max_execution_time', 300);

        $failed = array();
        foreach($featured as $image)
        {
            $x = autoCrop(0, $image->path, $image->type);
//            echo $image->path . '<br>';
//            echo $image->type . '<br>';
//            var_dump($x);
            if($x === false)
            {
                $failed[] = $image->toArray();
            }

//            echo '<hr>';
        }

        if($failed)
        {
            echo '<table style="border-color: #048108 !important;border-spacing: 0;" border="1" cellpadding="0">';
                echo '<thead style="background: #048108; color: white; font-weight: bold;">';
                    echo '<tr>';
                        echo '<td>Type</td>';
                        echo '<td>Image type</td>';
                        echo '<td>Image path</td>';
                        echo '<td>Object ID</td>';
                    echo '</tr>';
                echo '</thead>';
                echo '<tbody>';
            foreach($failed as $item)
            {
                echo '<tr>';
                    echo '<td>'.($item['parentObjectType'] == 'category' ? 'Category' : 'Object '. '(type: '.$item['parentObjectType'].')').'</td>';
                    echo '<td style="text-align: center">'.($item['type'] == '_featured_image' ? 'Featured' : 'Content').'</td>';
                    echo '<td>'.$item['path'].'</td>';
                    echo '<td style="text-align: center"><a href="'.url('admin/'.($item['parentObjectType'] == 'category' ? 'categories' : 'objects')."/{$item['parentObjectID']}/edit").'">'.$item['parentObjectID'].'</a></td>';
                echo '</tr>';
            }
              echo '</tbody>';
            echo '<table>';
        }
        echo '<style>td{padding: 2px 5px;}</style><pre>';
//        print_r($failed);
        die('Done!');
    }

    die('type required!');

});

Route::get('/contactToCRM', function(\Illuminate\Http\Request $request){
    $options = array(
        'firstname',
        'lastname',
        'telephone1',
        'emailaddress1',
        'description',
        'leadsourcecode',
        'contactreason',
    );
    $requestData = array();
    foreach($request->all() AS $k => $v)
        if(in_array($k, $options))
            $requestData[$k] = urldecode($v);

    if(count($requestData) != count($options))
        return response('',403);

    $url = 'https://secure.powerlink.co.il/web/webtocrm.aspx';
    $requestData['uid'] = '06675580-1b05-4d10-aae9-dabb626a1e75';
    $ch=curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1) ;
    curl_setopt($ch, CURLOPT_POSTFIELDS, $requestData);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    $result = curl_exec($ch);
    curl_close($ch);

    return response('');
});


Route::get('/', 'HomeController@index');
Route::get('home', 'HomeController@index');
Route::get('about', 'PagesController@about');
Route::get('contact', 'PagesController@contact');

Route::get('categories/', 'CategoryController@getCategories');
Route::get('categories/{id}', 'CategoryController@getCategory');
Route::get('categories/{id}/categories', 'CategoryController@getCategories');
Route::get('categories/{id}/parents', 'CategoryController@getParents');
Route::get('categories/{id}/content', 'CategoryController@getCategoryContent');
Route::get('categories/{id}/objects', 'CategoryController@getCategoryObjects');

Route::get('objects/search', 'ObjectController@getSearch');
Route::get('objects/searchPage', 'ObjectController@getSearchPage');
Route::get('objects/map', 'ObjectController@getMap');
Route::get('objects/locations', 'ObjectController@getLocations');
Route::get('objects/{id}/content', 'ObjectController@getContent');
Route::get('objects/{id}', 'ObjectController@get');

Route::pattern('id', '[0-9]+');
Route::get('news/{id}', 'ArticlesController@show');
Route::get('video/{id}', 'VideoController@show');
Route::get('photo/{id}', 'PhotoController@show');

Route::controllers([
    'auth' => 'Auth\AuthController',
    'password' => 'Auth\PasswordController',
]);

Route::group(['prefix' => 'admin', 'middleware' => 'auth', 'namespace' => 'Admin'], function() {
    Route::pattern('id', '[0-9]+');
    Route::pattern('id2', '[0-9]+');

    # Admin Dashboard
    Route::get('dashboard', 'DashboardController@index');

    # Language
    Route::get('language', 'LanguageController@index');
    Route::get('language/create', 'LanguageController@getCreate');
    Route::post('language/create', 'LanguageController@postCreate');
    Route::get('language/{id}/edit', 'LanguageController@getEdit');
    Route::post('language/{id}/edit', 'LanguageController@postEdit');
    Route::get('language/{id}/delete', 'LanguageController@getDelete');
    Route::post('language/{id}/delete', 'LanguageController@postDelete');
    Route::get('language/data', 'LanguageController@data');
    Route::get('language/reorder', 'LanguageController@getReorder');

    # News category
    Route::get('newscategory', 'ArticleCategoriesController@index');
    Route::get('newscategory/create', 'ArticleCategoriesController@getCreate');
    Route::post('newscategory/create', 'ArticleCategoriesController@postCreate');
    Route::get('newscategory/{id}/edit', 'ArticleCategoriesController@getEdit');
    Route::post('newscategory/{id}/edit', 'ArticleCategoriesController@postEdit');
    Route::get('newscategory/{id}/delete', 'ArticleCategoriesController@getDelete');
    Route::post('newscategory/{id}/delete', 'ArticleCategoriesController@postDelete');
    Route::get('newscategory/data', 'ArticleCategoriesController@data');
    Route::get('newscategory/reorder', 'ArticleCategoriesController@getReorder');

    # News
    Route::get('news', 'ArticlesController@index');
    Route::get('news/create', 'ArticlesController@getCreate');
    Route::post('news/create', 'ArticlesController@postCreate');
    Route::get('news/{id}/edit', 'ArticlesController@getEdit');
    Route::post('news/{id}/edit', 'ArticlesController@postEdit');
    Route::get('news/{id}/delete', 'ArticlesController@getDelete');
    Route::post('news/{id}/delete', 'ArticlesController@postDelete');
    Route::get('news/data', 'ArticlesController@data');
    Route::get('news/reorder', 'ArticlesController@getReorder');

    # Photo Album
    Route::get('photoalbum', 'PhotoAlbumController@index');
    Route::get('photoalbum/create', 'PhotoAlbumController@getCreate');
    Route::post('photoalbum/create', 'PhotoAlbumController@postCreate');
    Route::get('photoalbum/{id}/edit', 'PhotoAlbumController@getEdit');
    Route::post('photoalbum/{id}/edit', 'PhotoAlbumController@postEdit');
    Route::get('photoalbum/{id}/delete', 'PhotoAlbumController@getDelete');
    Route::post('photoalbum/{id}/delete', 'PhotoAlbumController@postDelete');
    Route::get('photoalbum/data', 'PhotoAlbumController@data');
    Route::get('photoalbum/reorder', 'PhotoAlbumController@getReorder');

    # Photo
    Route::get('photo', 'PhotoController@index');
    Route::get('photo/create', 'PhotoController@getCreate');
    Route::post('photo/create', 'PhotoController@postCreate');
    Route::get('photo/{id}/edit', 'PhotoController@getEdit');
    Route::post('photo/{id}/edit', 'PhotoController@postEdit');
    Route::get('photo/{id}/delete', 'PhotoController@getDelete');
    Route::post('photo/{id}/delete', 'PhotoController@postDelete');
    Route::get('photo/{id}/itemsforalbum', 'PhotoController@itemsForAlbum');
    Route::get('photo/{id}/{id2}/slider', 'PhotoController@getSlider');
    Route::get('photo/{id}/{id2}/albumcover', 'PhotoController@getAlbumCover');
    Route::get('photo/data/{id}', 'PhotoController@data');
    Route::get('photo/reorder', 'PhotoController@getReorder');

    # Video
    Route::get('videoalbum', 'VideoAlbumController@index');
    Route::get('videoalbum/create', 'VideoAlbumController@getCreate');
    Route::post('videoalbum/create', 'VideoAlbumController@postCreate');
    Route::get('videoalbum/{id}/edit', 'VideoAlbumController@getEdit');
    Route::post('videoalbum/{id}/edit', 'VideoAlbumController@postEdit');
    Route::get('videoalbum/{id}/delete', 'VideoAlbumController@getDelete');
    Route::post('videoalbum/{id}/delete', 'VideoAlbumController@postDelete');
    Route::get('videoalbum/data', 'VideoAlbumController@data');
    Route::get('video/reorder', 'VideoAlbumController@getReorder');

    # Video
    Route::get('video', 'VideoController@index');
    Route::get('video/create', 'VideoController@getCreate');
    Route::post('video/create', 'VideoController@postCreate');
    Route::get('video/{id}/edit', 'VideoController@getEdit');
    Route::post('video/{id}/edit', 'VideoController@postEdit');
    Route::get('video/{id}/delete', 'VideoController@getDelete');
    Route::post('video/{id}/delete', 'VideoController@postDelete');
    Route::get('video/{id}/itemsforalbum', 'VideoController@itemsForAlbum');
    Route::get('video/{id}/{id2}/albumcover', 'VideoController@getAlbumCover');
    Route::get('video/data/{id}', 'VideoController@data');
    Route::get('video/reorder', 'VideoController@getReorder');

    # Users
    Route::get('users/', 'UserController@index');
    Route::get('users/create', 'UserController@getCreate');
    Route::post('users/create', 'UserController@postCreate');
    Route::get('users/{id}/edit', 'UserController@getEdit');
    Route::post('users/{id}/edit', 'UserController@postEdit');
    Route::get('users/{id}/delete', 'UserController@getDelete');
    Route::post('users/{id}/delete', 'UserController@postDelete');
    Route::get('users/data', 'UserController@data');

    # Object Types
    Route::get('object-types/', 'ObjectTypesController@index');
    Route::post('object-types/', 'ObjectTypesController@index');
    Route::get('object-types/create', 'ObjectTypesController@getCreate');
    Route::post('object-types/create', 'ObjectTypesController@postCreate');
    Route::get('object-types/{id}/edit', 'ObjectTypesController@getEdit');
    Route::post('object-types/{id}/edit', 'ObjectTypesController@postEdit');
    Route::post('object-types/{id}/categories', 'ObjectTypesController@postCategory');
    Route::get('object-types/{id}/delete', 'ObjectTypesController@getDelete');
    Route::post('object-types/{id}/delete', 'ObjectTypesController@postDelete');
    Route::get('object-types/{id}/deleteCategory/{id2}', 'ObjectTypesController@getCategoryDelete');
    Route::get('object-types/data', 'ObjectTypesController@data');
    Route::get('object-types/{id}/export', 'ObjectTypesController@getExport');

    Route::get('object-types/{id}/fields', 'ObjectTypesController@getFields');
    Route::get('object-types/fields/{id}/delete', 'ObjectTypesController@deleteField');

    Route::get('object-types/{id}/categories', 'ObjectTypesController@getCategories');

    # Objects
    Route::get('objects/', 'ObjectController@index');
    Route::post('objects/', 'ObjectController@postIndex');
    Route::get('objects/create', 'ObjectController@getCreate');
    Route::post('objects/create', 'ObjectController@postCreate');
    Route::get('objects/{id}/edit', 'ObjectController@getEdit');
    Route::post('objects/{id}/edit', 'ObjectController@postEdit');
    Route::get('objects/{id}/delete', 'ObjectController@getDelete');
    Route::post('objects/{id}/delete', 'ObjectController@postDelete');
    Route::get('objects/data', 'ObjectController@data');

    Route::post('objects/import', 'ObjectController@postImport');

    Route::get('objects/{id}/fields', 'ObjectsController@getFields');
    
    # Categories
    Route::get('categories/', 'CategoryController@index');
    Route::get('categories/create', 'CategoryController@getCreate');
    Route::post('categories/create', 'CategoryController@postCreate');
    Route::get('categories/{id}/edit', 'CategoryController@getEdit');
    Route::post('categories/{id}/edit', 'CategoryController@postEdit');
    Route::get('categories/{id}/delete', 'CategoryController@getDelete');
    Route::post('categories/{id}/delete', 'CategoryController@postDelete');
    Route::get('categories/data', 'CategoryController@data');
    Route::get('categories/search', 'CategoryController@getSearch');
});
