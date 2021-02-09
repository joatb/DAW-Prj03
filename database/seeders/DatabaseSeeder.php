<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
         //\App\Models\FacturaSeeder::factory(10)->create();
         $this->call(ClientSeeder::class);
         $this->call(FacturaSeeder::class);
         $this->call(ArticleSeeder::class);
         $this->call(LiniaFacturaSeeder::class);
    }
}
