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

Route::get('/addressError', function(){
    $list = \App\Object::whereNotIn('objects.type', ['image','category'])
        ->join('object_meta as om',function($join){
            $join->on('om.object_id', '=', 'objects.id');
        })
        ->where(function($where){
            $where->where('om.meta_key', '=', '_field_address-address')
                ->orWhere('om.meta_key', '=', '_field_address-city')
                ->orWhere('om.meta_key', '=', '_field_address-country')
                ->orWhere('om.meta_key', '=', '_field_address-location-g')
                ->orWhere('om.meta_key', '=', '_field_address-location-k')
            ;
        })
        ->select('om.id', 'om.object_id', 'om.meta_key', 'om.meta_value')
        ->orderBy('om.object_id', 'ASC')
    ;

    $items = array();
    foreach($list->get() as $item)
    {
        $items[$item->object_id][$item->meta_key] = array(
            'id' => $item->id,
            'value' => $item->meta_value,
        );
    }

    if(!isset($_GET['type']))
        $_GET['type'] = '';

    switch($_GET['type'])
    {
        case 'address':
            $addresses = array();
            foreach($items as $k => $item)
            {
                $tempAddress =
                    $item['_field_address-address']['value']. ' ' .
                    $item['_field_address-city']['value']. ' ' .
                    $item['_field_address-country']['value']
                ;

                if(!trim($tempAddress))
                    $addresses[] = $k;
            }

            if(empty($addresses))
                die('No address error!');

            $items = \App\Object::whereIn('id', $addresses)->select('id', 'title', 'type')->get()->toArray();

            echo '<h2>'.(count($items)).' Objects without address:</h2>';
            echo '<table style="border-color: #048108 !important;border-spacing: 0;" border="1" cellpadding="0">';
            echo '<thead style="background: #048108; color: white; font-weight: bold;">';
            echo '<tr>';
            echo '<td style="text-align: center">#</td>';
            echo '<td>Type</td>';
            echo '<td>Title</td>';
            echo '<td>Object ID</td>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';
            foreach($items as $k => $item)
            {
                echo '<tr>';
                echo '<td style="text-align: center">'.($k + 1).'</td>';
                echo '<td>'.$item['type'].'</td>';
                echo '<td>'.$item['title'].'</td>';
                echo '<td style="text-align: center"><a href="'.url("admin/objects/{$item['id']}/edit").'">'.$item['id'].'</a></td>';
                echo '</tr>';
            }
            echo '</tbody>';
            echo '<table>';
            echo '<style>td{padding: 2px 5px;}</style><pre>';

            break;
        case 'coordinates':
            $coordinates = array();
            foreach($items as $k => $item)
            {
                if((!isset($item['_field_address-location-k']['value']) || !trim($item['_field_address-location-k']['value'])) || !isset($item['_field_address-location-g']['value']) || !trim($item['_field_address-location-g']['value']))
                {
                    $coordinates[] = $k;
                }
            }

            if(empty($coordinates))
                die('No address error!');

            $items = \App\Object::whereIn('id', $coordinates)->select('id', 'title', 'type')->get()->toArray();

            echo '<h2>'.(count($items)).' Objects without coordinates:</h2>';
            echo '<table style="border-color: #048108 !important;border-spacing: 0;" border="1" cellpadding="0">';
            echo '<thead style="background: #048108; color: white; font-weight: bold;">';
            echo '<tr>';
            echo '<td style="text-align: center">#</td>';
            echo '<td>Type</td>';
            echo '<td>Title</td>';
            echo '<td>Object ID</td>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';
            foreach($items as $k => $item)
            {
                echo '<tr>';
                echo '<td style="text-align: center">'.($k + 1).'</td>';
                echo '<td>'.$item['type'].'</td>';
                echo '<td>'.$item['title'].'</td>';
                echo '<td style="text-align: center"><a href="'.url("admin/objects/{$item['id']}/edit").'">'.$item['id'].'</a></td>';
                echo '</tr>';
            }
            echo '</tbody>';
            echo '<table>';
            echo '<style>td{padding: 2px 5px;}</style><pre>';
            break;

        default:
            die('Please pass a type (address / coordinates)');
    }
});
Route::get('/fixAddresses', function(){

    ini_set('max_execution_time', 300);
    $list = \App\Object::whereNotIn('objects.type', ['image','category'])
        ->join('object_meta as om',function($join){
            $join->on('om.object_id', '=', 'objects.id');
        })
        ->where(function($where){
            $where->where('om.meta_key', '=', '_field_address-address')
                ->orWhere('om.meta_key', '=', '_field_address-city')
                ->orWhere('om.meta_key', '=', '_field_address-country')
                ->orWhere('om.meta_key', '=', '_field_address-location-g')
                ->orWhere('om.meta_key', '=', '_field_address-location-k')
            ;
        })
        ->select('om.id', 'om.object_id', 'om.meta_key', 'om.meta_value')
        ->orderBy('om.object_id', 'ASC')
    ;

    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : false;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : false;
    $print = isset($_GET['print']) ? true : false;

    if(!$limit)
        die('You did not send a limit');

    $items = array();
    foreach($list->get() as $item)
    {
        $items[$item->object_id][$item->meta_key] = array(
            'id' => $item->id,
            'value' => $item->meta_value,
        );
    }

    $items = array_slice($items, $offset, $limit, true);

    if($print)
        dd($items);

    $startCounter = $offset;
    foreach($items as $id => &$item)
    {
        echo $startCounter .': '.$id . '<hr>';

        $address =
            $item['_field_address-address']['value']. ' ' .
            $item['_field_address-city']['value']. ' ' .
            $item['_field_address-country']['value']
        ;

        if(trim($address))
        {
            if($response = getFrenchAddress($address))
            {
                $newAddress = explode(',', $response['formatted_address']);

                $countNewAddress = count($newAddress);
                if($countNewAddress == 1)
                {
                    $item['_field_address-country']['new']  = $newAddress[0];
                }
                elseif($countNewAddress == 2)
                {
                    $item['_field_address-city']['new']  = $newAddress[0];
                    $item['_field_address-country']['new']  = $newAddress[1];
                }
                elseif($countNewAddress == 3)
                {
                    $item['_field_address-address']['new']  = $newAddress[0];
                    $item['_field_address-city']['new']     = $newAddress[1];
                    $item['_field_address-country']['new']  = $newAddress[2];
                }
                else
                {
                    $item['_field_address-address']['new']  = implode(',', array_slice($newAddress, 0, $countNewAddress - 2));
                    $item['_field_address-city']['new']     = $newAddress[$countNewAddress - 2];
                    $item['_field_address-country']['new']  = $newAddress[$countNewAddress - 1];
                }

                // Update
                if($countNewAddress > 2)
                {
                    $address = \App\ObjectMeta::find($item['_field_address-address']['id']);
                    $address->meta_value = trim($item['_field_address-address']['new']);
                    $address->save();
                }

                if($countNewAddress > 1)
                {
                    $city = \App\ObjectMeta::find($item['_field_address-city']['id']);
                    $city->meta_value = trim($item['_field_address-city']['new']);
                    $city->save();
                }

                if($countNewAddress > 0)
                {
                    $country = \App\ObjectMeta::find($item['_field_address-country']['id']);
                    $country->meta_value = trim($item['_field_address-country']['new']);
                    $country->save();
                }
            }
        }

        $startCounter++;
    }
    if($items)
    {
        die('<meta http-equiv="refresh" content="1; url='.url('/fixAddresses?offset='.($offset + $limit).'&limit=' . $limit).'">Refresh!');
    }

    die('No Items!');
});

function getFrenchAddress($address)
{
    $url = 'http://maps.google.com/maps/api/geocode/json?address=' . urlencode($address) . '&sensor=true&language=fr';
    $content = @file_get_contents($url);
    $contentObj = json_decode($content, 1);

    if(@$contentObj['status'] == "OK")
        return $contentObj['results'][0];

    return false;
}

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

Route::get('/contactToCRMclub', function(\Illuminate\Http\Request $request){
    $options = array(
        'accountname',
        'systemfield60',
        'idnumber',
        'telephone1',
        'emailaddress1',
        'systemfield86',
        'systemfield88',
        'accounttypecode',
        'systemfield12',
    );
    $requestData = array();
    foreach($request->all() AS $k => $v)
        if(in_array($k, $options))
            $requestData[$k] = urldecode($v);

    if(count($requestData) != count($options))
        return response('',403);

    $JiniClubMemmber = $request->get('JiniClubMemmber', false);
    if($JiniClubMemmber)
        $requestData['JiniClubMemmber'] = $JiniClubMemmber;

    $url = 'https://secure.powerlink.co.il/web/webtoaccount.aspx';
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

Route::get('/', function(){
    return redirect('admin/dashboard');
});

/* Delete categories and objects.
use App\Object;
use App\ObjectMeta;
Route::get('check', function(){
    $categories = Object::whereIn('id', [226, 227, 204, 13, 203])
        ->select('id', 'type', 'name', 'parent_id')
    ;

    $cats = [];
    $allCats = [];
    foreach($categories->get()->getDictionary() as $item)
    {
        $temp = Object::where('parent_id', '=', $item['id'])
            ->select('id', 'type', 'name', 'parent_id')
            ->get()
            ->getDictionary()
        ;

        $allCats[$item['id']] = $item;
        $allCats = array_replace($allCats, $temp);

        foreach($temp as &$v)
        {
            $temp2 = Object::where('parent_id', '=', $v['id'])
                ->select('id', 'type', 'name', 'parent_id')
                ->get()
                ->getDictionary()
            ;

            $allCats = array_replace($allCats, $temp2);
            $v['children'] = $temp2 ?: false;
        }

        $item['children'] = $temp ?: false;
        $cats[] = $item;

    }

    echo 'SELECT * FROM `objects` WHERE id = ';
    foreach($allCats as $k => $v)
        echo $k . ($v !== end($allCats) ? ' OR id = ' : '');

    echo '<br><br><br>SELECT * FROM `object_meta` WHERE object_id = ';
    foreach($allCats as $k => $v)
    {
        $catsIDS[] = $k;
        echo $k . ($v !== end($allCats) ? ' OR object_id = ' : '');
    }

    $images = [];
    foreach(
        ObjectMeta::whereIn('meta_key',['_featured_image', '_content_image'])
        ->whereIn('object_id' ,$catsIDS)
        ->get()
    as $x
    )
    {
        $images[] = $x->meta_value;
    }

    echo '<br><br><br>SELECT * FROM `objects` WHERE id = ';
    foreach($images as $v)
        echo $v . ($v !== end($images) ? ' OR id = ' : '');

    echo '<br><br><br>SELECT * FROM `object_meta` WHERE object_id = ';
    foreach($images as $v)
    {
        if(!trim($v))
            continue;
        echo $v . ($v !== end($images) ? ' OR object_id = ' : '');
    }

    echo '<h2>categories: ('.count($allCats).')</h2>';
    echo '<table style="border-color: #048108 !important;border-spacing: 0;" border="1" cellpadding="0">';
    echo '<thead style="background: #048108; color: white; font-weight: bold;">';
    echo '<tr>';
    echo '<td>#</td>';
    echo '<td>Title</td>';
    echo '<td>Admin url</td>';
    echo '</tr>';
    echo '</thead>';
    echo '<tbody>';
    foreach($cats as $a)
    {
        echo '<tr>';
            echo '<td>'.$a->id.'</td>';
            echo '<td>'.$a->name.'</td>';
            echo '<td style="text-align: center"><a href="'.url('admin/categories/'.$a->id.'/edit').'">'.$a->id.'</a></td>';
        echo '</tr>';
        if($a['children'])
        {
            foreach($a['children'] as $b)
            {
                echo '<tr>';
                echo '<td>##'.$b->id.'</td>';
                echo '<td>'.$b->name.'</td>';
                echo '<td style="text-align: center"><a href="'.url('admin/categories/'.$b->id.'/edit').'">'.$b->id.'</a></td>';
                echo '</tr>';
                if($b['children'])
                {
                    foreach($b['children'] as $c)
                    {
                        echo '<tr>';
                        echo '<td>####'.$c->id.'</td>';
                        echo '<td>'.$c->name.'</td>';
                        echo '<td style="text-align: center"><a href="'.url('admin/categories/'.$c->id.'/edit').'">'.$c->id.'</a></td>';
                        echo '</tr>';
                    }
                }
            }
        }
    }
    echo '</tbody>';
    echo '<table>';
    echo '<style>td{padding: 2px 5px;}</style>';

    $objectTypes = [];
    $objectTypes2 = [];
    foreach($allCats as $catID => $catData)
    {
        $temp = ObjectMeta::where('object_meta.meta_key', '=', '_category_id')
            ->where('object_meta.meta_value', '=', $catID)
            ->whereNotIn('object_meta.object_id',[2881, 2883, 1272])
            ->join('objects as obj', function ($join){
                $join->on('obj.id', '=', 'object_meta.object_id');
            })
            ->select('obj.id', 'object_meta.meta_value as categoryID', 'obj.title', 'obj.name')
            ->get()
            ->toArray()
        ;
        $objectTypes = array_merge($objectTypes, $temp);
        foreach($temp as $x)
        {
            $objectTypes2[$x['id']] = $x;
        }
    }

    $duplicates = [];
    foreach($objectTypes as $x)
    {
        if(isset($duplicates[$x['id']]))
            $duplicates[$x['id']]++;
        else
            $duplicates[$x['id']] = 1;
    }

    echo 'SELECT * FROM `objects` WHERE id = ';
    foreach($objectTypes2 as $k => $v)
        echo $k . ($v !== end($objectTypes2) ? ' OR id = ' : '');

   echo '<br><br><br>SELECT * FROM `object_meta` WHERE object_id = ';
    foreach($objectTypes2 as $k => $v)
        echo $k . ($v !== end($objectTypes2) ? ' OR object_id = ' : '');

    echo '<h2>Object Types: ('.count($objectTypes2).')</h2>';
    echo '<table style="border-color: #048108 !important;border-spacing: 0;" border="1" cellpadding="0">';
    echo '<thead style="background: #048108; color: white; font-weight: bold;">';
    echo '<tr>';
    echo '<td>#</td>';
    echo '<td>Title</td>';
    echo '<td>Admin url</td>';
    echo '<td>Belong To Category</td>';
    echo '</tr>';
    echo '</thead>';
    echo '<tbody>';
    foreach($objectTypes as $a)
    {
        echo '<tr>';
        echo '<td>'.($duplicates[$a['id']] > 1 ? '#' : '').$a['id'].'</td>';
        echo '<td>'.$a['title'].'</td>';
        echo '<td style="text-align: center"><a href="'.url('admin/object-types/'.$a['id'].'/edit').'">'.$a['id'].'</a></td>';
        echo '<td style="text-align: center"><a href="'.url('admin/categories/'.$a['categoryID'].'/edit').'">'.$a['categoryID'].'</a></td>';
        echo '</tr>';
    }
    echo '</tbody>';
    echo '<table>';
    echo '<style>td{padding: 2px 5px;}</style>';

    $totalObjects = [];
    foreach($objectTypes2 as $typeID => $type)
    {
        $objects = Object::where('type', '=', str_replace('_object_type_', '', $type['name']))
            ->select('id', 'title', 'type')
            ->get()
            ->toArray()
        ;
        foreach($objects as $x)
        {
            $x['typeID'] = $typeID;
            $totalObjects[$x['id']] = $x;
        }
    }

    echo 'SELECT * FROM `objects` WHERE id = ';
    foreach($totalObjects as $k => $v)
        echo $k . ($v !== end($totalObjects) ? ' OR id = ' : '');
    die;
    echo '<h2>Objects: ('.count($totalObjects).')</h2>';
    echo '<table style="border-color: #048108 !important;border-spacing: 0;" border="1" cellpadding="0">';
    echo '<thead style="background: #048108; color: white; font-weight: bold;">';
    echo '<tr>';
    echo '<td>#</td>';
    echo '<td>Title</td>';
    echo '<td>Admin url</td>';
    echo '<td>Belong To Type</td>';
    echo '</tr>';
    echo '</thead>';
    echo '<tbody>';
    foreach($totalObjects as $a)
    {
        echo '<tr>';
        echo '<td>'.$a['id'].'</td>';
        echo '<td>'.$a['title'].'</td>';
        echo '<td style="text-align: center"><a href="'.url('admin/objects/'.$a['id'].'/edit').'">'.$a['id'].'</a></td>';
        echo '<td style="text-align: center"><a href="'.url('admin/object-types/'.$a['typeID'].'/edit').'">'.$a['type'].'</a></td>';
        echo '</tr>';
    }
    echo '</tbody>';
    echo '<table>';
    echo '<style>td{padding: 2px 5px;}</style>';
    die;
});
*/
/*
Route::get('/', 'HomeController@index');
Route::get('home', 'HomeController@index');
Route::get('about', 'PagesController@about');
Route::get('contact', 'PagesController@contact');
*/
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
/*
Route::get('news/{id}', 'ArticlesController@show');
Route::get('video/{id}', 'VideoController@show');
Route::get('photo/{id}', 'PhotoController@show');
*/

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


    Route::get('slika/start', 'SlikaController@index');
    Route::post('slika/getIframe', 'SlikaController@getIframe');
    Route::get('slika/showUserCards/{id}',  'SlikaController@showUserCards');
    Route::post('slika/initTokenPayment/{id}/{id2}',  'SlikaController@initTokenPayment');

    Route::match(['get', 'post'], 'slika/{id?}/{id2?}', function($id = false, $id2 = 0){
        $id = $id ?: (isset($_POST['id']) && intval($_POST['id']) ? intval($_POST['id']) : false);
        $sum = $id2 ?: (isset($_POST['sum']) && intval($_POST['sum']) ? intval($_POST['sum']) : false);

        $creditCaredResponseErrors = array(
            '001' => 'חסום .',
            '002' => 'גנוב .',
            '003' => 'התקשר לחברת האשראי.',
            '004' => 'סירוב.',
            '005' => 'מזויף .',
            '006' => 'ת.ז. או CVV שגויים.',
            '007' => 'ECI או UCAF/CAVV שגויים.',
            '008' => 'תקלה בבניית מפתח גישה לקובץ חסומים.',
            '009' => 'לא הצליח להתקשר, התקשר לחברת האשראי.',
            '010' => 'תוכנית הופסקה עפ"י הוראת המפעיל (ESC) או COM PORT לא ניתן לפתיחה (WINDOWS).',
            '011' => 'אין אישור סולק למטבע ISO',
            '012' => 'אין אישור למותג למטבע ISO',
            '013' => 'אין אישור לעסקת פריקה/טעינה.',
            '014' => 'כרטיס לא נתמך.',
            '015' => 'אין התאמה בין המספר שהוקלד לפס המגנטי.',
            '016' => 'נתונים נוספים אינם או ישנם בניגוד להגדרות המסוף.',
            '017' => 'לא הוקלדו 4 ספרות האחרונות.',
            '019' => 'רשומה בקובץ INT_IN קצרה מ- 16 תווים.',
            '020' => 'קובץ קלט (IN_INT) לא קיים.',
            '021' => 'קובץ חסומים (NEG) לא קיים או לא מעודכן - בצע שידור או בקשה לאישור עבור כל עסקה.',
            '022' => 'אחד מקבצי פרמטרים או ווקטורים לא קיים.',
            '023' => 'קובץ תאריכים (DATA) לא קיים.',
            '024' => 'קובץ אתחול (START) לא קיים.',
            '025' => 'הפרש בימים בקליטת חסומים גדול מדי -בצע שידור או בקשה לאישור עבור כל עסקה.',
            '026' => 'הפרש דורות בקליטת חסומים גדול מידי – בצע שידור או בקשה לאישור עבור כל עסקה.',
            '027' => 'כאשר לא הוכנס פס מגנטי כולו הגדר עסקה כעסקה טלפונית או כעסקת חתימה בלבד.',
            '028' => 'מספר מסוף מרכזי לא הוכנס למסוף המוגדר לעבודה כרב ספק.',
            '029' => 'מספר מוטב לא הוכנס למסוף המוגדר לעבודה כרב מוטב.',
            '030' => 'מסוף שאינו מעודכן כרב ספק/רב מוטב והוקלד מס\' ספק/מס\' מוטב.',
            '031' => 'מסוף מעודכן כרב ספק והוקלד גם מס\' מוטב.',
            '032' => 'תנועות ישנות בצע שידור או בקשה לאישור עבור כל עסקה.',
            '033' => 'כרטיס לא תקין.',
            '034' => 'כרטיס לא רשאי לבצע במסוף זה או אין אישור לעסקה כזאת.',
            '035' => 'כרטיס לא רשאי לבצע עסקה עם סוג אשראי זה.',
            '036' => 'פג תוקף.',
            '037' => 'שגיאה בתשלומים - סכום עסקה צריך להיות שווה תשלום ראשון + (תשלום קבוע כפול מס\' תשלומים)',
            '038' => 'לא ניתן לבצע עסקה מעל תקרה לכרטיס לאשראי חיוב מיידי.',
            '039' => 'סיפרת בקורת לא תקינה.',
            '040' => 'מסוף שמוגדר כרב מוטב הוקלד מס\' ספק.',
            '041' => 'מעל תקרה, אך קובץ הקלט מכיל הוראה לא לבצע שאילתא (J1,J2,J3 )',
            '042' => 'חסום בספק, אך קובץ הקלט מכיל הוראה לא לבצע שאילתא (J1,J2,J3 )',
            '043' => 'אקראית, אך קובץ הקלט מכיל הוראה לא לבצע שאילתא (J1,J2,J3 )',
            '044' => 'מסוף לא רשאי לבקש אישור ללא עסקה, אך קובץ הקלט מכיל (5J).',
            '045' => 'מסוף לא רשאי לבקש אישור ביוזמתו, אך קובץ הקלט מכיל (6J).',
            '046' => 'יש לבקש אישור, אך קובץ הקלט מכיל הוראה לא לבצע שאילתא (J1,J2,J3 )',
            '047' => 'יש לבקש אישור בשל בעיה הקשורה לקכ"ח אך קובץ הקלט מכיל הוראה לא לבצע שאילתא.',
            '051' => 'מספר רכב לא תקין.',
            '052' => 'מד מרחק לא הוקלד.',
            '053' => 'מסוף לא מוגדר כתחנת דלק. (הועבר כרטיס דלק או קוד עסקה לא מתאים)',
            '057' => 'לא הוקלד מספר תעודת זהות.',
            '058' => 'לא הוקלד CVV2 .',
            '059' => 'לא הוקלדו מספר תעודת הזהות וה- CVV2 .',
            '060' => 'צרוף ABS לא נמצא בהתחלת נתוני קלט בזיכרון.',
            '061' => 'מספר כרטיס לא נמצא או נמצא פעמיים.',
            '062' => 'סוג עסקה לא תקין.',
            '063' => 'קוד עסקה לא תקין.',
            '064' => 'סוג אשראי לא תקין.',
            '065' => 'מטבע לא תקין.',
            '066' => 'קיים תשלום ראשון ו/או תשלום קבוע לסוג אשראי שונה מתשלומים.',
            '067' => 'קיים מספר תשלומים לסוג אשראי שאינו דורש זה.',
            '068' => 'לא ניתן להצמיד לדולר או למדד לסוג אשראי שונה מתשלומים.',
            '069' => 'אורך הפס המגנטי קצר מידי.',
            '079' => 'מטבע לא קיים בווקטור 59 .',
            '080' => 'הוכנס "קוד מועדון" לסוג אשראי לא מתאים.',
            '090' => 'עסקת ביטול אסורה בכרטיס. יש לבצע עסקת טעינה.',
            '091' => 'עסקת ביטול אסורה בכרטיס. יש לבצע עסקת פריקה.',
            '092' => 'עסקת ביטול אסורה בכרטיס. יש לבצע עסקת זיכוי.',
            '099' => 'לא מצליח לקרוא/ לכתוב/ לפתוח קובץ TRAN.',
            '101' => 'אין אישור מחברת אשראי לעבודה.',
            '106' => 'למסוף אין אישור לביצוע שאילתא לאשראי חיוב מיידי.',
            '107' => 'סכום העסקה גדול מידי – חלק למספר העסקאות.',
            '108' => 'למסוף אין אישור לבצע עסקאות מאולצות.',
            '109' => 'למסוף אין אישור לכרטיס עם קוד השרות 587.',
            '110' => 'למסוף אין אישור לכרטיס חיוב מיידי.',
            '111' => 'למסוף אין אישור לעסקה בתשלומים.',
            '112' => 'למסוף אין אישור לעסקה טלפון/ חתימה בלבד בתשלומים.',
            '113' => 'למסוף אין אישור לעסקה טלפונית.',
            '114' => 'למסוף אין אישור לעסקה "חתימה בלבד".',
            '115' => 'למסוף אין אישור לעסקאות במטבע זר או עסקה לא מאושרת.',
            '116' => 'למסוף אין אישור לעסקת מועדון.',
            '117' => 'למסוף אין אישור לעסקת כוכבים/נקודות/מיילים.',
            '118' => 'למסוף אין אישור לאשראי ישראקרדיט.',
            '119' => 'למסוף אין אישור לאשראי אמקס קרדיט.',
            '120' => 'למסוף אין אישור להצמדה לדולר.',
            '121' => 'למסוף אין אישור להצמדה למדד.',
            '122' => 'למסוף אין אישור להצמדה למדד לכרטיסי חו"ל.',
            '123' => 'למסוף אין אישור לעסקת כוכבים/נקודות/מיילים לסוג אשראי זה.',
            '124' => 'למסוף אין אישור לאשראי קרדיט בתשלומים לכרטיסי ישראכרט',
            '125' => 'למסוף איו אישור לאשראי קרדיט בתשלומים לכרטיסי אמקס',
            '126' => 'למסוף אין אישור לקוד מועדון זה.',
            '127' => 'למסוף אין אישור לעסקת חיוב מיידי פרט לכרטיסי חיוב מיידי.',
            '128' => 'למסוף אין אישור לקבל כרטיסי ויזה אשר מתחילים ב - 3.',
            '129' => 'למסוף אין אישור לבצע עסקת זכות מעל תקרה.',
            '130' => 'כרטיס לא רשאי לבצע עסקת מועדון.',
            '131' => 'כרטיס לא רשאי לבצע עסקת כוכבים/נקודות/מיילים.',
            '132' => 'כרטיס לא רשאי לבצע עסקאות בדולרים (רגילות או טלפוניות).',
            '133' => 'כרטיס לא תקף על פי רשימת כרטיסים תקפים של ישראכרט.',
            '134' => 'כרטיס לא תקין עפ”י הגדרת המערכת (VECTOR1 של ישראכרט)- מס\' הספרות בכרטיס- שגוי.',
            '135' => 'כרטיס לא רשאי לבצע עסקאות דולריות עפ”י הגדרת המערכת (VECTOR1 של ישראכרט).',
            '136' => 'הכרטיס שייך לקבוצת כרטיסים שאינה רשאית לבצע עסקאות עפ”י הגדרת המערכת VECTOR20 של ויזה.',
            '137' => 'קידומת הכרטיס (7 ספרות) לא תקפה עפ”י הגדרת המערכת (21VECTOR של דיינרס).',
            '138' => 'כרטיס לא רשאי לבצע עסקאות בתשלומים על פי רשימת כרטיסים תקפים של ישראכרט.',
            '139' => 'מספר תשלומים גדול מידי על פי רשימת כרטיסים תקפים של ישראכרט.',
            '140' => 'כרטיסי ויזה ודיינרס לא רשאים לבצע עסקאות מועדון בתשלומים.',
            '141' => 'סידרת כרטיסים לא תקפה עפ”י הגדרת המערכת. (VECTOR5 של ישראכרט).',
            '142' => 'קוד שרות לא תקף עפ”י הגדרת המערכת (VECTOR6 של ישראכרט).',
            '143' => 'קידומת הכרטיס (2 ספרות) לא תקפה עפ”י הגדרת המערכת. (VECTOR7 של ישראכרט).',
            '144' => 'קוד שרות לא תקף עפ”י הגדרת המערכת. (VECTOR12 של ויזה).',
            '145' => 'קוד שרות לא תקף עפ”י הגדרת המערכת. (VECTOR13 של ויזה).',
            '146' => 'לכרטיס חיוב מיידי אסור לבצע עסקת זכות.',
            '147' => 'כרטיס לא רשאי לבצע עסקאות בתשלומים עפ"י וקטור 31 של לאומיקארד.',
            '148' => 'כרטיס לא רשאי לבצע עסקאות טלפוניות וחתימה בלבד עפ"י ווקטור 31 של לאומיקארד.',
            '149' => 'כרטיס אינו רשאי לבצע עסקאות טלפוניות עפ"י וקטור 31 של לאומיקארד.',
            '150' => 'אשראי לא מאושר לכרטיסי חיוב מיידי.',
            '151' => 'אשראי לא מאושר לכרטיסי חו"ל.',
            '152' => 'קוד מועדון לא תקין.',
            '153' => 'כרטיס לא רשאי לבצע עסקאות אשראי גמיש (עדיף/ +30) עפ"י הגדרת מערכת 21VECTOR של דיינרס.',
            '154' => 'כרטיס לא רשאי לבצע עסקאות חיוב מיידי עפ"י הגדרת המערכת. (VECTOR21 של דיינרס).',
            '155' => 'סכום המינמלי לתשלום בעסקת קרדיט קטן מידי.',
            '156' => 'מספר תשלומים לעסקת קרדיט לא תקין.',
            '157' => 'תקרה 0 לסוג כרטיס זה בעסקה עם אשראי רגיל או קרדיט.',
            '158' => 'תקרה 0 לסוג כרטיס זה בעסקה עם אשראי חיוב מיידי.',
            '159' => 'תקרה 0 לסוג כרטיס זה בעסקת חיוב מיידי בדולרים.',
            '160' => 'תקרה 0 לסוג כרטיס זה בעסקה טלפונית.',
            '161' => 'תקרה 0 לסוג כרטיס זה בעסקת זכות.',
            '162' => 'תקרה 0 לסוג כרטיס זה בעסקת תשלומים.',
            '163' => 'כרטיס אמריקן אקספרס אשר הונפק בחו"ל לא רשאי לבצע עסקאות בתשלומים.',
            '164' => 'כרטיסיJCB רשאי לבצע עסקאות רק באשראי רגיל.',
            '165' => 'סכום בכוכבים/נקודות/מיילים גדול מסכום העסקה.',
            '166' => 'כרטיס מועדון לא בתחום של המסוף.',
            '167' => 'לא ניתן לבצע עסקת כוכבים/נקודות/מיילים בדולרים.',
            '168' => 'למסוף אין אישור לעסקה דולרית עם סוג אשראי זה.',
            '169' => 'לא ניתן לבצע עסקת זכות עם אשראי שונה מהרגיל',
            '170' => 'סכום הנחה בכוכבים/נקודות/מיילים גדול מהמותר.',
            '171' => 'לא ניתן לבצע עסקה מאולצת לכרטיס/אשראי חיוב מיידי.',
            '172' => 'לא ניתן לבטל עסקה קודמת (עסקת זכות או מספר כרטיס אינו זהה).',
            '173' => 'עסקה כפולה.',
            '174' => 'למסוף אין אישור להצמדה למדד לאשראי זה.',
            '175' => 'למסוף אין אישור להצמדה לדולר לאשראי זה.',
            '176' => 'כרטיס אינו תקף עפ”י הגדרת ה מערכת (וקטור 1 של ישראכרט).',
            '177' => 'בתחנות דלק לא ניתן לבצע "שרות עצמי" אלא "שרות עצמי בתחנות דלק".',
            '178' => 'אסור לבצע עסקת זכות בכוכבים/נקודות/מיילים.',
            '179' => 'אסור לבצע עסקת זכות בדולר בכרטיס תייר.',
            '180' => 'בכרטיס מועדון לא ניתן לבצע עסקה טלפונית.',
            '200' => 'שגיאה יישומית.',
            '201' => 'תקלה בקבלת נתונים מוצפנים.',
            '999' => 'שגיאה לא ידועה.',
        );

        $isFail = isset($_GET['fail']) && $_GET['fail'] ? $_GET['fail'] : false;
        if($isFail) {
        ?>
            <script>
                alert('הסליקה נכשלה:' + "\n" + '<?=$creditCaredResponseErrors[$_POST['Response']]?>');
                top.location.reload();
            </script>
        <?php
        die;
        }

        $isSuccess = isset($_GET['success']) && $_GET['success'] ? $_GET['success'] : false;
        if($isSuccess) {
            ?>
            <style>
                div {
                    text-align: center;
                    direction: rtl;
                    font-size: 50px;
                    font-family: arial;
                    color: #676767;
                    margin-top: 100px;
                }
            </style>
            <div>הסליקה בוצעה בהצלחה!</div>
            <?php
            die;
        }

        return redirect('admin/slika/start?userid=' . $id);

        if(!$id || !$sum)
        {
            ?>
            <style>
                body{
                    background: #ddd;
                }
                div {
                    margin: 150px auto;
                    width: 300px;
                    text-align: center;
                    direction: rtl;
                }

                input {
                    font-size: 20px;
                    text-align: center;
                    margin: 20px 10px;
                    border: 1px solid #B9B9B9;
                    padding: 5px;
                    color: #3A3A3A;
                }

                button {
                    font-size: 20px;
                    color: #3A3A3A;
                    margin-top: 20px;
                }
            </style>
                <div>
                    <input type="text" id="userid" placeholder="מזהה משתמש" />
                    <input type="text" id="sum"  placeholder="מחיר"/>
                    <button id="btn">טען דף תשלום</button>
                    <script>
                        var btn = document.getElementById('btn').onclick = function(){
                            var userid = document.getElementById('userid').value;
                            var sum = document.getElementById('sum').value;
                            if(!userid || !sum)
                                return alert('יש להזין מזהה משתמש וסכום על מנת להמשיך.');

                            top.location.href = '<?=url('admin/slika')?>/' + userid + '/' + sum;
                        };
                    </script>
                </div>

            <?php
            die;
        }

        ?>
        <DOCTYPE html>
        <html>
            <head>
                <title>דף סליקה ג'יני</title>
                <style>
                    body{
                        background: #ddd;
                    }
                    .container
                    {
                        margin: 30px auto 0;
                        max-width: 500px;
                        display: block;
                    }
                    iframe{
                        width: 500px;
                        height: 500px;
                        border: none;
                        background: #ECECEC;
                    }
                    .container > div {
                        color: #676767;
                        direction: rtl;
                        font-size: 30px;
                        font-family: arial;
                        text-align: center;
                        margin: -20px 0 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div>
                        User ID: <?=$id?>
                    </div>

                    <div>
                        <input type="text" id="sum"  placeholder="שנה סכום"/>
                        <button id="btn">שנה סכום</button>
                        <script>
                            var btn = document.getElementById('btn').onclick = function(){
                                var sum = document.getElementById('sum').value;
                                if(!sum)
                                    return alert('יש להזין סכום על מנת להמשיך.');

                                top.location.href = '<?=url('admin/slika')?>/' + <?=$id?> + '/' + sum;
                            };
                        </script>
                    </div>

                    <iframe src="https://direct.tranzila.com/jiniclub/iframe.php?<?=http_build_query($_GET)?>&currency=1&trBgColor=dddddd&nologo=1&trTextColor=676767&lang=il&trButtonColor=676767&sum=<?=$sum?>&tranmode=AK&userid=<?=$id?>"></iframe>
                </div>
            </body>
        </html>
        <?php
    });
});

use Illuminate\Http\Request;
use App\Slika;
Route::post('slika/notify',  function(Request $request){

    $json = json_encode(array(
        "POST"   =>  $_POST,
        "GET"    =>  $_GET,
    ));

    $Response = $request->get('Response', false);
    $transaction_id = $request->get('transaction_id', false);

    if($Response && $transaction_id)
    {
        $slikaRow = Slika::where('transaction_id', '=', $transaction_id)->where('response_number', '=', '');
        if($slikaRow->count())
        {
            $four_digits = $request->get('ccno', '0000');
            $credit_expired = $request->get('expmonth', '00') . '/' . $request->get('expyear', '00');
            $approve_number = $request->get('Tempref', '');
            $token = $request->get('TranzilaTK', '');
            $sum = $request->get('sum', 0);
            if($sum == $slikaRow->first()->sum)
            {
                $slikaRow->update([
                    'data'              => $json,
                    'response_number'   => $Response,
                    'four_digits'       => $four_digits,
                    'credit_expired'    => $credit_expired,
                    'approve_number'    => $approve_number,
                    'token'             => $token,
                ]);

            }
            else
            {
                mail('nk@leado.co.il', 'Jini slika error3', 'sum not right: '. $json);
            }
        }
    }
});

Route::get('{slug}', function($slug) {

    die('
	<div style="margin: 100px auto; width: 700px; text-align: center; font-family: arial; font-size: 20px; line-height: 30px;">
		The url : <span style="color:#C1C1C1">"'.env('APP_URL').'/'.$slug.'"</span> does not exists. <br>
		Please login to the <a href="'.url('admin/dashboard').'">dashboard</a>
	</div>
	');

})->where('slug', '^.*');