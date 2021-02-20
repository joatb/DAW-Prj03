<?php

namespace Database\Seeders;

use Brick\Math\BigInteger;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Date;
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
        $gener2019 = 1546300800;

        DB::table('factures')->insert([
            'data' => date("Y-m-d", rand($gener2019, 1613217654)),
            'pagada' => rand(0,1),
            'client_id' => 1,
            'iva' => rand(0, 21),
            'descompte' => rand(0, 50)
        ]);

        DB::table('factures')->insert([
            'data' => date("Y-m-d", rand($gener2019, 1613217654)),
            'pagada' => rand(0,1),
            'client_id' => 2,
            'iva' => rand(0, 21),
            'descompte' => rand(0, 50)
        ]);
    }
}
