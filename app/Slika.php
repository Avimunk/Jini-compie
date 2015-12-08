<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Slika
 * @package App
 */
class Slika extends Model
{
    protected $fillable = array(
        'data',
        'userID',
        'response_number',
        'four_digits',
        'credit_expired',
        'approve_number',
        'token',
        'transaction_id',
        'name',
        'cause',
        'identity',
        'sum',
    );

    protected $table = 'slika';

    public function children()
    {
        return $this->hasMany('App\SubSlika', 'parent_id', 'id');
    }
}
