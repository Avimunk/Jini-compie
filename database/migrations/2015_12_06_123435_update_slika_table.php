<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSlikaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('slika', function($table)
        {
            $table->integer('userID');
            $table->string('target')->default('_self');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('objects', function($table)
        {
            $table->dropColumn('userID');
            $table->dropColumn('slika');
        });
    }
}
