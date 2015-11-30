<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTinypngTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resizes_tinypng', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('round');
            $table->string('file_name', 1000);
            $table->text('path');
            $table->tinyInteger('run_tiny')->default(0);
            $table->text('error');
            $table->integer('time_tiny');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('resizes_tinypng');
    }
}
