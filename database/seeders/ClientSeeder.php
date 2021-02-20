<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('clients')->insert([
            'nif' => Str::random(7),
            'nom' => Str::random(10),
            'adreca' => Str::random(10),
            'poblacio' => Str::random(10),
        ]);

        DB::table('clients')->insert([
            'nif' => Str::random(7),
            'nom' => Str::random(10),
            'adreca' => Str::random(10),
            'poblacio' => Str::random(10),
        ]);
    }
}
