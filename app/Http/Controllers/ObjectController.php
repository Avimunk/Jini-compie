<?php namespace App\Http\Controllers;

use App\Object;

use App\Http\Controllers\Controller;
use App\ObjectMeta;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;


class ObjectController extends Controller {
    private function processObject(&$object) {
        if ($featuredImageId = ObjectMeta::getValue($object->id, '_featured_image')) {
//            $object->featured_image  = getImageSrc($featuredImageId, 'medium');
            $object->featured_image = 'cropped/' . getTheImageSize(getImageSrc($featuredImageId), '_featured_image');
//            $object->featured_image  = Url('/uploads/' . getImageSrc($featuredImageId, 'medium'));
        }


        if ($contentImageId = ObjectMeta::getValue($object->id, '_content_image')) {
//            $object->content_image  = getImageSrc($contentImageId, 'medium');
            $object->content_image = 'cropped/' . getTheImageSize(getImageSrc($contentImageId), '_content_image');
//            $object->content_image  = Url('/uploads/' . getImageSrc($contentImageId, 'medium'));
        }

        $object->excerpt = htmlentities( strlen($object->excerpt) > 50 ? substr($object->excerpt, 1, 50) . '...' : $object->excerpt );

        $object->phone = ObjectMeta::getValue($object->id, '_field_phone' );
        $object->email = ObjectMeta::getValue($object->id, '_field_email' );
        $object->occupation= ObjectMeta::getValue($object->id, '_field_occupation' );
        $object->address= ObjectMeta::getValue($object->id, '_field_address' );
        $object->address_location_g= ObjectMeta::getValue($object->id, '_field_address-location-g' );
        $object->address_location_k= ObjectMeta::getValue($object->id, '_field_address-location-k' );
        $object->address_street= ObjectMeta::getValue($object->id, '_field_address-address' );
        $object->address_city= ObjectMeta::getValue($object->id, '_field_address-city' );
        $object->address_country= ObjectMeta::getValue($object->id, '_field_address-country' );

        if ( $french_speakers = ObjectMeta::getValue($object->id, '_field_french_speakers' ) ) {
            $object->french_speakers= 'francophone';
        }

        $object->promoted= ObjectMeta::getValue($object->id, '_field_promoted' );
    }

    private function processObject2(&$object, $getAll = true)
    {
        $objectData = ObjectMeta::where('object_id' , '=', $object->id)->orWhere('object_id' , '=', $object->objectTypeID)->get();

        $objectFinal = $object->toArray();
        if($getAll)
        {
            $objectTypeData = $objectData->filter(function($v) use($object){
                if($v->object_id == $object->objectTypeID)
                    return true;

                return false;
            });
            foreach($objectTypeData as $item)
            {
                // Get categories
                if($item->meta_key == '_category_id')
                {
                    if(isset($objectFinal['categories']))
                        $objectFinal['categories'][] = $item->meta_value;
                    else
                        $objectFinal['categories'] = array(
                            $item->meta_value
                        );
                    continue;
                }

                // Get fields
                if(strpos($item->meta_key, '_field_') === 0)
                {
                    $content = unserialize($item->meta_value);
                    if(isset($objectFinal['fields']))
                        $objectFinal['fields'][$content['name']] = $content;
                    else
                        $objectFinal['fields'] = array(
                            $content['name'] => $content
                        );
                }
            }
        }

//        dd($objectFinal);
        $objectData = $objectData->filter(function($v) use($object){
            if($v->object_id == $object->id)
                return true;

            return false;
        });
        $objectFinal['map'] = false;
//        dd($objectData->toArray());
        foreach($objectData as $item)
        {
            $itemKey = $item->meta_key;
            $itemVal = $item->meta_value;

            // Address
            if(strpos($itemKey, '_field_address') === 0)
            {
                // Get the current key
                $key = str_replace(array('_field_address-'), '', $itemKey);

                // check if map exists
                if(($key == 'location-g' || $key == 'location-k'))
                {
                    if($itemVal == '')
                        $objectFinal['map'] = false;
                    else
                        $objectFinal['map'] = true;

                    $key = str_replace('-', '_', $key);
                }

                // add the current address data to the array
                if(isset($objectFinal['address']))
                    $objectFinal['address'][$key] = $itemVal;
                else
                    $objectFinal['address'] = array(
                        $key => $itemVal
                    );
                continue;
            }

            // Images
            if($itemKey == '_content_image' || $itemKey == '_featured_image')
            {
                $objectFinal[$itemKey] = 'cropped/' . getTheImageSize(getImageSrc($itemVal), $itemKey);
//                $objectFinal[$itemKey] = getImageSrc($itemVal, 'medium');

                continue;
            }

            if($getAll)
            {
                // Set phone
                if($itemKey == '_field_phone')
                {
                    $objectFinal['phone'] = $itemVal;
                    continue;
                }

                // Set email
                if($itemKey == '_field_email')
                {
                    $objectFinal['phone'] = $itemVal;
                    continue;
                }

                /* Get more info */
                if($itemKey == '_field_occupation')
                {
                    if(isset($objectFinal['more']))
                    {
                        array_unshift($objectFinal['more'], array(
                            'type'  => 'text',
                            'key'   => 'Occupation',
                            'value' => $itemVal,
                        ));
                    }
                    else
                    {
                        $objectFinal['more'] = array(
                            array(
                                'type'  => 'text',
                                'key'   => 'Occupation',
                                'value' => $itemVal,
                            )
                        );
                    }

                    continue;
                }

                if($itemKey == '_field_french_speakers')
                {
                    if(isset($objectFinal['more']))
                    {
                        array_unshift($objectFinal['more'], array(
                            'type'  => 'checkbox',
                            'key'   => 'francophone',
                            'value' => (bool) $itemVal,
                        ));
                    }
                    else
                    {
                        $objectFinal['more'] = array(
                            array(
                                'type'  => 'checkbox',
                                'key'   => 'francophone',
                                'value' => (bool) $itemVal,
                            )
                        );
                    }

                    continue;
                }

                // extra fields
                if(strpos($itemKey, '_field_') === 0)
                {
                    $key = str_replace('_field_', '', $itemKey);
                    if(isset($objectFinal['fields'][$key]))
                    {
                        $current = $objectFinal['fields'][$key];
                        $type = $current['type'];
                        $label = $current['label'];

                        $ignoreTypes = array(
                            'select',
                            'radio',
//                            'boolean',
                            'map',
                        );
                        if(in_array($type, $ignoreTypes))
                            continue;

                        if(isset($objectFinal['more']))
                        {
                            $objectFinal['more'][] = array(
                                'type'  => $type,
                                'key'   => $label,
                                'value' => $type == 'checkbox' ? (bool) $itemVal : $itemVal,
                            );
                        }
                        else
                        {
                            $objectFinal['more'] = array(
                                array(
                                    'type'  => $type,
                                    'key'   => $label,
                                    'value' => $type == 'checkbox' ? (bool) $itemVal : $itemVal,
                                )
                            );
                        }
                    }
                }
            }
        }


        if($getAll)
        {
            $objectFinal['hasContact']          = (bool) (isset($objectFinal['email']) && $objectFinal['email']) || (isset($objectFinal['phone']) && $objectFinal['phone']);
            $objectFinal['hasContactAddress']   = (bool) isset($objectFinal['address']) && ((isset($objectFinal['address']['address']) && $objectFinal['address']['address']) ||(isset($objectFinal['address']['city']) && $objectFinal['address']['city']));
            $objectFinal['hasMore']             = (bool) isset($objectFinal['more']);
        }
        unset($objectFinal['fields']);
        $object = $objectFinal;
    }
    
    public function get($id) {
        $object = Object::select(
                array(
                    'objects.id',
                    'obj.id AS objectTypeID',
                    'objects.type',
                    'objects.name',
                    'objects.title',
                    'objects.excerpt',
                    'objects.content',
                    'objects.score'
                )
            )
            ->join('objects as obj', function ($join){
                $join->on('obj.name', '=', DB::raw("concat( '_object_type_', objects.type )"));
            })
            ->where('objects.id', $id)
            ->first();

        if ($object)
        {
            $this->processObject2($object);
            return $object;
        }
    }
    
    public function getSearch() {
        $categoryId = Input::get('categoryid');
        $index = Input::get('index') ?: 0;
        $search = Input::get('query');
        $offset = (integer) Input::get('offset');
        $limit = 10;

        $objects = null;

        if ( $categoryId ) {
            // Category Image
            $featuredImageUrl = '';
            if ($categoryFeaturedImageId = ObjectMeta::getValue($categoryId, '_featured_image')) {
//                $featuredImageUrl = getImageSrc($categoryFeaturedImageId, 'thumbnail');
                $featuredImageUrl = 'cropped/' . getTheImageSize(getImageSrc($categoryFeaturedImageId), '_featured_image');
            }

            $objects = Object::whereNotIn('objects.type', ['object_type', 'image','category'])
                ->where(function( $query ) use ( $search ) {
                    $query->where('objects.title', 'LIKE', '%' . $search . '%')
                        ->orWhere('objects.content', 'LIKE', '%' . $search . '%');
                })
                ->join('objects as obj', function ($join){
                    $join->on('obj.name', '=', DB::raw("concat( '_object_type_', objects.type )"));
                })
                ->join('object_meta', function ($join){
                    $join->on('object_meta.object_id', '=', 'obj.id')
                        ->where('object_meta.meta_key', '=', '_category_id');
                })
                ->join('objects as cat', function ($join){
                    $join->on('cat.id', '=', 'object_meta.meta_value');
                })
                ->where('object_meta.meta_value', $categoryId)
                ->select(DB::raw("'$featuredImageUrl' AS featured_image"),'cat.id AS catID', 'cat.title AS catTitle', 'cat.name AS catName','obj.id AS objID', 'obj.name AS objName', 'objects.id', 'objects.excerpt', 'objects.parent_id', 'objects.name', 'objects.type', 'objects.title', 'objects.score')
                ->orderBy('objects.score','DESC')
                ->orderBy('objects.title','ASC')
                ->take($limit)
                ->skip($offset)
            ;
//            dd($objects->toSql());
            $objects = $objects->get();

            foreach ($objects as $object) {
                $this->processObject($object);
            }

            foreach($objects as &$object)
            {
                unset($object['address']);
                unset($object['address_city']);
                unset($object['address_country']);
                unset($object['address_street']);
                unset($object['catID']);
                unset($object['catName']);
                unset($object['catTitle']);
                unset($object['email']);
                unset($object['objID']);
                unset($object['objName']);
                unset($object['occupation']);
                unset($object['parent_id']);
                unset($object['phone']);
                unset($object['promoted']);
                unset($object['type']);
                if($featuredImageUrl == $object['featured_image'])
                    unset($object['featured_image']);
            }
//            dd($objects->toArray());
            return [
                'items' => $objects,
                'offset' => count($objects) >= $limit ? $offset + $limit : 0,
            ];
//            return $objects;
            /*
            // Category Image
            $featuredImageUrl = '';
            if ($categoryFeaturedImageId = ObjectMeta::getValue($categoryId, '_featured_image')) {
                $featuredImageUrl = getImageSrc($categoryFeaturedImageId, 'thumbnail');
            }

            // Get objects where in category
            $objects = Object::Where('type', 'object_type')
                ->whereExists(function ( $query ) use ( $categoryId ) {
                    $query->select(DB::raw(1))
                    ->from('object_meta')
                    ->whereRaw(DB::getTablePrefix() . 'object_meta.object_id = ' . DB::getTablePrefix() . 'objects.id')
                    ->where('meta_key', '_category_id')
                    ->where('meta_value', $categoryId);
                })
                ->select(DB::raw('substr(name, 14) as field_name'))
                ->get()
                ->toArray();

            $types = array_map(function($v) {
                return $v['field_name'];
            }, $objects);

            $objects = DB::table('objects')
                ->whereIn('type', $types)
                ->select( array( 'objects.id', DB::raw( '"'. $featuredImageUrl . '"' . ' as featured_image'), 'objects.name', 'objects.title', 'objects.excerpt', 'objects.content' ) );

            $objects = DB::table('objects')
                ->whereIn('type', $types)
                ->select( array( 'objects.id', DB::raw( '"'. $featuredImageUrl . '"' . ' as featured_image'), 'objects.name', 'objects.title', 'objects.excerpt', 'objects.content' ) )
                ->whereExists(function ( $query ) {
                    $query->select(DB::raw(1))
                        ->from('object_meta')
                        ->whereRaw(DB::getTablePrefix() . 'object_meta.object_id = ' . DB::getTablePrefix() . 'objects.id')
                        ->where('meta_key', '_field_promoted')
                        ->where('meta_value', '1');
                })->
                union($objects);
                */
        } else {
            if ( $search ) {
                $objects = Object::whereNotIn('type', ['object_type', 'image'])
                    ->where(function( $query ) use ( $search ) {
                        $query->where('title', 'LIKE', '%' . $search . '%')
                            ->orWhere('content', 'LIKE', '%' . $search . '%');
                    })
                    ->select('id', 'parent_id', 'name', 'type', 'title', 'score')
                    ->orderBy('score','DESC')
                    ->orderBy('title','ASC')
                    ->take(50)
                    ->get();

                $objects->each(function($v){
                    if($v->type != 'category')
                    {
                        $parentObject = Object::where('type','object_type')->where('name', '_object_type_'.$v->type)->first();
                        if($parentObject)
                        {
                            $parentCategories = Object::where('type','category')
                                ->whereExists(function ( $query ) use ( $parentObject ) {
                                    $query->select(DB::raw(1))
                                        ->from('object_meta')
                                        ->whereRaw(DB::getTablePrefix() . 'object_meta.meta_value = ' . DB::getTablePrefix() . 'objects.id')
                                        ->where('meta_key', '_category_id')
                                        ->where('object_id', $parentObject->id);
                                })
                                ->first();
                            $v->category = array(
                                'id' => $parentCategories ? $parentCategories->id : '0',
                                'name' => $parentCategories ? $parentCategories->name : 'Home',
                            );
                        }

                    }
                    return $v;
                });
//                dd($objects);
                return response( $objects );
            }
        }
//        dd($objects);
//dd($objects->toSql());

        if ( $objects ) {
            $objects = $objects
            ->skip($index)
            ->take(50)
            ->get();

            foreach ($objects as $object) {
                $this->processObject($object);
            }
        }

        return $objects;
    }

    public function getSearchPage($fromLocation = false) {

        $categoryId = Input::get('categoryid');
        $index = Input::get('index') ?: 0;
        $search = Input::get('query');
        $offset = (integer) Input::get('offset');
        $limit = 10;

        $objects = null;

        if ( $categoryId ) {
            // Category Image
            $featuredImageUrl = '';
            if ($categoryFeaturedImageId = ObjectMeta::getValue($categoryId, '_featured_image')) {
//                $featuredImageUrl = getImageSrc($categoryFeaturedImageId, 'thumbnail');
                $featuredImageUrl = 'cropped/' . getTheImageSize(getImageSrc($categoryFeaturedImageId), '_featured_image');
            }

            $objects = Object::whereNotIn('objects.type', ['object_type', 'image','category'])
                    ->where(function( $query ) use ( $search ) {
                        $query->where('objects.title', 'LIKE', '%' . $search . '%')
                            ->orWhere('objects.content', 'LIKE', '%' . $search . '%');
                    })
                    ->join('objects as obj', function ($join){
                        $join->on('obj.name', '=', DB::raw("concat( '_object_type_', objects.type )"));
                    })
                    ->join('object_meta', function ($join){
                        $join->on('object_meta.object_id', '=', 'obj.id')
                            ->where('object_meta.meta_key', '=', '_category_id');
                    })
                    ->join('objects as cat', function ($join){
                        $join->on('cat.id', '=', 'object_meta.meta_value');
                    })
                    ->where('object_meta.meta_value', $categoryId)
                    ->select(DB::raw("'$featuredImageUrl' AS featured_image"),'cat.id AS catID', 'cat.title AS catTitle', 'cat.name AS catName','obj.id AS objID', 'obj.name AS objName', 'objects.id', 'objects.excerpt', 'objects.parent_id', 'objects.name', 'objects.type', 'objects.title', 'objects.score')
                    ->orderBy('objects.score','DESC')
                    ->orderBy('objects.title','ASC')
                ;

            if(!$fromLocation)
            {
                $objects->take($limit)
                        ->skip($offset)
                    ;
            }
            $objects = $objects->get();
            foreach ($objects as $object) {
                $this->processObject($object);
            }
            if(!$fromLocation)
            {
                foreach($objects as &$object)
                {
                    unset($object['address']);
                    unset($object['address_city']);
                    unset($object['address_country']);
                    unset($object['address_street']);
                    unset($object['catID']);
                    unset($object['catName']);
                    unset($object['catTitle']);
                    unset($object['email']);
                    unset($object['objID']);
                    unset($object['objName']);
                    unset($object['occupation']);
                    unset($object['parent_id']);
                    unset($object['phone']);
                    unset($object['promoted']);
                    unset($object['type']);
                    if($featuredImageUrl == $object['featured_image'])
                        unset($object['featured_image']);

                    $object['excerpt'] = substr($object['excerpt'], 0, 200);
                }
            }

            return [
                'items' => $objects,
                'offset' => count($objects) >= $limit ? $offset + $limit : 0,
            ];

            /*
            dd($objects->toArray());

            // Category Image
            $featuredImageUrl = '';
            if ($categoryFeaturedImageId = ObjectMeta::getValue($categoryId, '_featured_image')) {
                $featuredImageUrl = getImageSrc($categoryFeaturedImageId, 'thumbnail');
            }


            // Get objects where in category
            $objects = Object::Where('type', 'object_type')
                ->whereExists(function ( $query ) use ( $categoryId ) {
                    $query->select(DB::raw(1))
                    ->from('object_meta')
                    ->whereRaw(DB::getTablePrefix() . 'object_meta.object_id = ' . DB::getTablePrefix() . 'objects.id')
                    ->where('meta_key', '_category_id')
                    ->where('meta_value', $categoryId);
                })
                ->select(DB::raw('substr(name, 14) as field_name'))
                ->get()
                ->toArray();


            $types = array_map(function($v) {
                return $v['field_name'];
            }, $objects);

            $objects = DB::table('objects')
                ->whereIn('type', $types)
                ->select( array( 'objects.id', DB::raw( '"'. $featuredImageUrl . '"' . ' as featured_image'), 'objects.name', 'objects.title', 'objects.excerpt', 'objects.content' ) );
//            dd($objects->get());
            $objects = DB::table('objects')
                ->whereIn('type', $types)
                ->where(function( $query ) use ( $search ) {
                    $query->where('title', 'LIKE', '%' . $search . '%')
                        ->orWhere('name', 'LIKE', '%' . $search . '%');
                })
                ->orderBy('score','DESC')
                ->select( array( 'objects.id', DB::raw( '"'. $featuredImageUrl . '"' . ' as featured_image'), 'objects.name', 'objects.title', 'objects.excerpt', 'objects.content' ) )
                ->whereExists(function ( $query ) {
                    $query->select(DB::raw(1))
                        ->from('object_meta')
                        ->whereRaw(DB::getTablePrefix() . 'object_meta.object_id = ' . DB::getTablePrefix() . 'objects.id')
                        ->where('meta_key', '_field_promoted')
                        ->where('meta_value', '1');
                })->
                union($objects);
            dd($objects->toSql());
            */

        } else {
            if ( $search ) {
                $objects = Object::whereNotIn('objects.type', ['object_type', 'image','category'])
                    ->where(function( $query ) use ( $search ) {
                        $query->where('objects.title', 'LIKE', '%' . $search . '%')
                            ->orWhere('objects.content', 'LIKE', '%' . $search . '%');
                    })
                    ->join('objects as obj', function ($join){
                        $join->on('obj.name', '=', DB::raw("concat( '_object_type_', objects.type )"));
                    })
                    ->select('obj.id AS objID', 'obj.name AS objName', 'objects.id', 'objects.excerpt', 'objects.parent_id', 'objects.name', 'objects.type', 'objects.title')
                    ->orderBy('objects.score','DESC')
                    ->orderBy('objects.title','ASC')
//                    ->take(10)
                    ->get();


                $parentObjects = array_unique($objects->map(function($v){return $v->objID;})->toArray());
                if($parentObjects)
                {
                    $_categories = ObjectMeta::whereIn('object_meta.object_id', $parentObjects)
                        ->where('object_meta.meta_key', '_category_id')
                        ->join('objects as cat', function ($join){
                            $join->on('cat.id', '=', 'object_meta.meta_value');
                        })
                        ->orderBy('cat.score','DESC')
                        ->orderBy('cat.title','ASC')
                        ->select('cat.id', 'cat.title', 'cat.name', 'object_meta.object_id')
                        ->get();

                    if($_categories)
                    {
                        $categories = [];
                        foreach($_categories->toArray() as $item)
                        {
                            if(isset($categories[$item['id']]))
                            {
                                $categories[$item['id']]['parents'][] = $item['object_id'];
                            }
                            else
                            {
                                $categories[$item['id']] = array(
                                    'id'    => $item['id'],
                                    'title' => $item['title'],
                                    'name'  => $item['name'],
                                    'parents' => array(
                                        $item['object_id'],
                                    ),
                                );
                            }
                        }

                        $objects = $objects->toArray();
                        $counter = 0;
                        foreach($categories as $k => $item)
                        {
                            foreach($objects as $v)
                            {
                                if(in_array($v['objID'], $item['parents']))
                                {
                                    $v['excerpt'] = substr($v['excerpt'], 0, 200);
                                    $categories[$k]['items'][] = $v;
                                }
                            }

                            $categories[$k]['itemsCount'] = count($categories[$k]['items']);
                            $counter += $categories[$k]['itemsCount'];
                            $categories[$k]['items'] = array_slice($categories[$k]['items'], 0, 3);

                        }

                        if($limit)
                        {
                            $categories = array_slice($categories, $offset, $limit);
                        }

                        return [
                            'data' => $categories,
                            'count' => $counter,
                            'offset' => count($categories) >= $limit ? $offset + $limit : 0,
                        ];
                    }
                }
                return [];
            }
        }
//        dd($objects);
//dd($objects->toSql());

        if ( $objects ) {
            $objects = $objects
//            ->skip($index)
//            ->take(50)
            ->get();
dd($objects);
            foreach ($objects as $object) {
                $this->processObject($object);
            }
        }

        return $objects;
    }

    public function getLocations() {
        $results = $this->getSearchPage(true);
        $results = $results['items'];
//        dd($results->toArray());
        $data = array();
        $locations = array(
            'type' => 1,
            'userMsg' => false
        );

        if ( !empty( $results ) ) {
            foreach ( $results as $result ) {
                if ( $lat = ObjectMeta::getValue($result->id, '_field_address-location-g') ) {
                    if ( $long = ObjectMeta::getValue($result->id, '_field_address-location-k' ) )  {
                        $location = array(
                            'id' => $result->id,
                            'geo_latitude' => $lat,
                            'geo_longitude' => $long,
                            'location' => '',
                            'title' => $result->title,
                            'name' => $result->name,
                            'excerpt' => $result->excerpt,
                            'score' => $result->score,
                        );

                        if ($contentImageId = ObjectMeta::getValue($result->id, '_content_image')) {
                            $location['content_image']  = Url('/uploads/' . getImageSrc($contentImageId, 'medium'));
                        } else {
                            $location['content_image'] = '';
                        }

                        $location['address_street']= ObjectMeta::getValue($result->id, '_field_address-address' );
                        $location['address_city']= ObjectMeta::getValue($result->id, '_field_address-city' );
                        $location['address_country']= ObjectMeta::getValue($result->id, '_field_address-country' );


                        $location['promoted'] = ObjectMeta::getValue($result->id, '_field_promoted' );

                        $data[] = $location;
                    }
                }
            }
        }
        $options = array();
        foreach($data as &$item)
        {
            if(isset($options[$item['geo_latitude'].'_'.$item['geo_longitude']]))
            {
                $options[$item['geo_latitude'].'_'.$item['geo_longitude']] += 1;
                $current = $options[$item['geo_latitude'].'_'.$item['geo_longitude']] - 1;
                $lat = substr($item['geo_latitude'], -3);

                if($lat + ($current * 10) < 1000)
                {
                    $lat = $lat + ($current * 10);
                    $subLat = substr($item['geo_latitude'], 0, strlen($item['geo_latitude']) - 3);
                    $item['geo_latitude'] = $subLat . $lat;
                }
                else
                {
                    $lat = substr($item['geo_latitude'], -4);
                    $lat = $lat + ($current * 10);
                    $subLat = substr($item['geo_latitude'], 0, strlen($item['geo_latitude']) - 4);
                    $item['geo_latitude'] = $subLat . $lat;
                }

            }
            else
            {
                $options[$item['geo_latitude'].'_'.$item['geo_longitude']] = 1;
            }
        }

        $locations['data'] = $data;
        return $locations;
        //return view('partials.map', compact( 'locations' ));
    }

    public function getContent($id) {
        if ($id) {
            if ($object = Object::find($id)) {
                return $object->content;
            }
        }
    }

    public function getMap() {
        if ( $queryString = $_SERVER['QUERY_STRING'] ) {
            $criteria = '?' . $queryString;
        }

        return view('partials.map', compact( 'criteria' ));
    }
}
