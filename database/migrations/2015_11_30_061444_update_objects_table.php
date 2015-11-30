<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateObjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('objects', function($table)
        {
            $table->string('url', 500)->nullable();
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
            $table->dropColumn('url');
            $table->dropColumn('target');
        });
    }
}
