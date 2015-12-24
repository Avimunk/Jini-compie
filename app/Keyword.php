<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Keyword
 * @package App
 */
class Keyword extends Model
{
    protected $fillable = array(
        'content',
    );

    public function object()
    {
        return $this->belongsTo('App\Object', 'object_id', 'id');
    }
}
