<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Object
 * @package App
 */
class ResizesTinypng extends Model
{
    protected $fillable = array(
        'round',
        'file_name',
        'path',
        'run_tiny',
        'error',
    );

    protected $table = 'resizes_tinypng';
}
