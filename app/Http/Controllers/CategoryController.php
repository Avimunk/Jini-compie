<?php namespace App\Http\Controllers;

use App\Object;

use App\Http\Controllers\Controller;
use App\ObjectMeta;
use Illuminate\Support\Facades\DB;


class CategoryController extends Controller {

    public function getCategory($id) {
        if ( $category = Object::select( array( 'objects.id', 'objects.name', 'objects.title', 'objects.excerpt' ) )
            ->where('id', $id)
            ->first() ) {

            return response()->json( $this->processCategory( $category ) );
        }
    }

    private function processCategory(&$category) {
        if ($contentImageId = ObjectMeta::getValue($category->id, '_content_image')) {
            if ($contentImageUrl = getImageSrc($contentImageId, 'medium') ) {
                $category['contentImageUrl'] = url().'/uploads/' . $contentImageUrl;
            }
        }

        if ($featuredImageId = ObjectMeta::getValue($category->id, '_featured_image')) {
            if ($featuredImageUrl = getImageSrc($featuredImageId, 'small')) {
                $category['featuredImageUrl'] = url().'/uploads/' . $featuredImageUrl;


//                    $path = __DIR__ . '/../../../public/uploads/' . $featuredImageUrl;
//                    echo $path . '<br />' . file_exists($path) . '<br />';
//                    if (file_exists($path)) {
//                        $type = pathinfo($path, PATHINFO_EXTENSION);
//                        $data = file_get_contents($path);
//                        $category['featuredImageUrl'] = base64_encode($data);
//                    }
            }
        }

        $category['childrenCount'] = Object::where('objects.type', 'category')
            ->where('parent_id', $category['id'])
            ->count();


        $category['itemsCount'] = ObjectMeta::join('objects', 'object_meta.object_id', '=', 'objects.id')
            ->where('meta_key', '_category_id')
            ->where('meta_value', $category['id'])
            ->where('objects.type', '<>', 'category')
            ->groupBy('object_id')
            ->count();

        return $category;
    }

    private $items;
    private $itemsParents;
    private function itemArray() {
        $result = collect();
        foreach($this->items as $item) {
            if ($item->parent_id == null) {
                $a = [];
                $items = $this->itemWithChildren($item, $a);
                if(!$items->isEmpty())
                {
                    $item['items_count'] = $items->count();
                    $item['items'] = $items;
                }
                $this->itemsParents[$item->id] = array_merge($a,[$item->id]);
                $result->push($item);
            }
        }
        return $result;
    }
    private function itemWithChildren($item, $a) {
        $result = collect();
        $children = $this->childrenOf($item);
        $a[] = $item->id;
        foreach ($children as $child) {
            $items = $this->itemWithChildren($child, $a);
            if(!$items->isEmpty())
            {
                $child['items_count'] = $items->count();
                $child['items'] = $items;
            }
            $this->itemsParents[$child->id] = array_merge($a,[$child->id]);
            $result->push($child);
        }
        return $result;
    }
    private function childrenOf($item) {
        $result = collect();
        foreach($this->items as $i) {
            if ($i->parent_id == $item->id) {
                $result->push($i);
            }
        }
        return $result;
    }

    private function fetchCategories()
    {
        if(!$this->items)
            $this->items = Object::where('objects.type', 'category')
                ->leftJoin('objects as parent', 'parent.id', '=', 'objects.parent_id')
                ->select(array('objects.id', 'objects.title', 'objects.name', 'objects.parent_id', 'parent.parent_id as grandParentID'))
                ->get();
            return $this->items;
    }

    private $parents = [];
    private function getParent($id)
    {
        if($id != null)
        {
            $parentID = collect($this->fetchCategories()->where('id', intval($id))->first())->get('parent_id');
            if($parentID)
            {
                $this->getParent($parentID);
                $this->parents[] = $parentID;
            }
        }
    }
    public function getParents($id = null)
    {
        if(!$id)
            return [];

        $this->getParent($id);
        $this->parents[] = intval($id);
        return $this->parents;
    }

    public function getCategories($id = null) {
        //Config::set('laravel-debugbar::config.enabled', false);

        /*
        $categories = Object::where('objects.type', 'category')
            ->where('parent_id', $id)
            ->select(array('objects.id', 'objects.title', 'objects.name'))
            ->get();

        $response = $categories;

        foreach ($categories as $category) {

            $this->processCategory($category);
        }
        */

        $this->fetchCategories();

        foreach ($this->items as $category) {
            if ($contentImageId = ObjectMeta::getValue($category->id, '_content_image')) {
                if ($contentImageUrl = getImageSrc($contentImageId, 'medium') ) {
                    $category['contentImageUrl'] = $contentImageUrl;
                }
            }

            if ($featuredImageId = ObjectMeta::getValue($category->id, '_featured_image')) {
                if ($featuredImageUrl = getImageSrc($featuredImageId, 'small')) {
                    $category['featuredImageUrl'] = $featuredImageUrl;
                }
            }
        }

        $this->itemsParents[0] = [];
        return response()->json( [
            'categories' => $this->itemArray(),
//            'parents' => $this->getParents($id),
            'parents' => $this->itemsParents,
        ] );
    }

    public function getCategoryContent($id) {
        if ($id) {
            $category = Object::find($id);

            return $category->content;

        }
    }

    public function getCategoryObjects($id = null) {
        $objects = Object::join('object_meta', 'objects.id', '=', 'object_meta.object_id')
            ->where('object_meta.meta_key', '_category_id')
            ->where('object_meta.meta_value', $id)
            ->where('objects.type', '<>', 'category')
            ->select( array( 'objects.id', 'objects.name', 'objects.title' ) )
            ->get();

        return $objects;
    }
}
