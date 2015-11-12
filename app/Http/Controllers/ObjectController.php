<?php namespace App\Http\Controllers;

use App\Object;

use App\Http\Controllers\Controller;
use App\ObjectMeta;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;


class ObjectController extends Controller {
    private function processObject(&$object) {
        if ($featuredImageId = ObjectMeta::getValue($object->id, '_featured_image')) {
            $object->featured_image  = Url('/uploads/' . getImageSrc($featuredImageId, 'medium'));
        }


        if ($contentImageId = ObjectMeta::getValue($object->id, '_content_image')) {
            $object->content_image  = Url('/uploads/' . getImageSrc($contentImageId, 'medium'));
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
            $object->french_speakers= 'Franchophone';
        }

        $object->promoted= ObjectMeta::getValue($object->id, '_field_promoted' );
    }
    
    public function get($id) {
        if ( $object = Object::select( array( 'objects.id', 'objects.name', 'objects.title', 'objects.excerpt', 'objects.content' ) )
            ->where('id', $id)
            ->first() ) {
            $this->processObject($object);

            return $object;
        }
    }
    
    public function getSearch() {
        $categoryId = Input::get('categoryid');
        $index = Input::get('index') ?: 0;
        $search = Input::get('query');

        $objects = null;

        if ( $categoryId ) {
            // Category Image
            $featuredImageUrl = '';
            if ($categoryFeaturedImageId = ObjectMeta::getValue($categoryId, '_featured_image')) {
                $featuredImageUrl = getImageSrc($categoryFeaturedImageId, 'thumbnail');
            }

            $objects = Object::whereNotIn('objects.type', ['object_type', 'image','category'])
                ->where(function( $query ) use ( $search ) {
                    $query->where('objects.title', 'LIKE', '%' . $search . '%')
                        ->orWhere('objects.name', 'LIKE', '%' . $search . '%');
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
                ->select(DB::raw("'$featuredImageUrl' AS featured_image"),'cat.id AS catID', 'cat.title AS catTitle', 'cat.name AS catName','obj.id AS objID', 'obj.name AS objName', 'objects.id', 'objects.excerpt', 'objects.parent_id', 'objects.name', 'objects.type', 'objects.title')
                ->orderBy('objects.score','DESC')
            ;
            $objects = $objects->get();
            foreach ($objects as $object) {
                $this->processObject($object);
            }
            return $objects;
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
                            ->orWhere('name', 'LIKE', '%' . $search . '%');
                    })
                    ->select('id', 'parent_id', 'name', 'type', 'title')
                    ->orderBy('score','DESC')
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

    public function getSearchPage() {

        $categoryId = Input::get('categoryid');
        $index = Input::get('index') ?: 0;
        $search = Input::get('query');

        $objects = null;

        if ( $categoryId ) {

            // Category Image
            $featuredImageUrl = '';
            if ($categoryFeaturedImageId = ObjectMeta::getValue($categoryId, '_featured_image')) {
                $featuredImageUrl = getImageSrc($categoryFeaturedImageId, 'thumbnail');
            }

            $objects = Object::whereNotIn('objects.type', ['object_type', 'image','category'])
                    ->where(function( $query ) use ( $search ) {
                        $query->where('objects.title', 'LIKE', '%' . $search . '%')
                            ->orWhere('objects.name', 'LIKE', '%' . $search . '%');
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
                    ->select(DB::raw("'$featuredImageUrl' AS featured_image"),'cat.id AS catID', 'cat.title AS catTitle', 'cat.name AS catName','obj.id AS objID', 'obj.name AS objName', 'objects.id', 'objects.excerpt', 'objects.parent_id', 'objects.name', 'objects.type', 'objects.title')
                    ->orderBy('objects.score','DESC')
                ;
            $objects = $objects->get();
            foreach ($objects as $object) {
                $this->processObject($object);
            }
            return $objects;

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
                            ->orWhere('objects.name', 'LIKE', '%' . $search . '%');
                    })
                    ->join('objects as obj', function ($join){
                        $join->on('obj.name', '=', DB::raw("concat( '_object_type_', objects.type )"));
                    })
                    ->select('obj.id AS objID', 'obj.name AS objName', 'objects.id', 'objects.excerpt', 'objects.parent_id', 'objects.name', 'objects.type', 'objects.title')
                    ->orderBy('objects.score','DESC')
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
                        foreach($categories as $k => $item)
                        {
                            foreach($objects as $v)
                            {
                                if(in_array($v['objID'], $item['parents']))
                                {
                                    $categories[$k]['items'][] = $v;
                                }
                            }

                            $categories[$k]['itemsCount'] = count($categories[$k]['items']);
                            $categories[$k]['items'] = array_slice($categories[$k]['items'], 0, 3);

                        }
                        return [
                            'data' => $categories,
                            'count' => count($objects),
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
        $results = $this->getSearchPage();

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
                            'excerpt' => $result->excerpt
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
