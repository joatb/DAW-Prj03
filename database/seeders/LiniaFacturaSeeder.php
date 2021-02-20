<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LiniaFacturaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('liniesFactures')->insert([
            'factura_id' => 1,
            'article_id' => 1,
            'unitats' => rand(0, 50),
        ]);

        DB::table('liniesFactures')->insert([
            'factura_id' => 1,
            'article_id' => 1,
            'unitats' => rand(0, 50),
        ]);

        DB::table('liniesFactures')->insert([
            'factura_id' => 2,
            'article_id' => 1,
            'unitats' => rand(0, 50),
        ]);
    }
}
