<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SubSlika
 * @package App
 */
class SubSlika extends Model
{
    protected $fillable = array(
        'approve_number',
        'data',
        'sum',
    );

    protected $table = 'sub_slika';

    public function parent()
    {
        return $this->belongsTo('App\Slika', 'parent_id', 'id');
    }
}
