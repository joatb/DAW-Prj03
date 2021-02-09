<?php

namespace Database\Seeders;

use Brick\Math\BigInteger;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FacturaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {   



        DB::table('factures')->insert([
            'data' => Str::random(10),
            'pagada' => rand(0,1),
            'client_id' => 1,
            'iva' => rand(0, 21),
            'descompte' => rand(0, 50)
        ]);
    }
}
