<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSlikaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('slika', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('userID');
            $table->string('transaction_id', 250);
            $table->string('sum', 250);
            $table->string('name', 250);
            $table->integer('cause');
            $table->string('identity', 250);
            $table->string('response_number', 5);
            $table->string('four_digits', 10);
            $table->string('credit_expired', 10);
            $table->string('approve_number', 50);
            $table->string('token', 50);
            $table->text('data');
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
        Schema::drop('slika');
    }
}
