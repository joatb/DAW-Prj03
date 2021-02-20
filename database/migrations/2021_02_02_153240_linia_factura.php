<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class LiniaFactura extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('liniesFactures', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('factura_id');
            $table->unsignedBigInteger('article_id');
            $table->unsignedInteger('unitats');
            $table->timestamps();

            $table->foreign('factura_id')->references('id')->on('factures')->onDelete("cascade");
            $table->foreign('article_id')->references('id')->on('articles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('liniesFactures');
    }
}
