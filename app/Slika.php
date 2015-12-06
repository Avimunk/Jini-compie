<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Object
 * @package App
 */
class Slika extends Model
{
    protected $fillable = array(
        'data',
    );

    protected $table = 'slika';
}
