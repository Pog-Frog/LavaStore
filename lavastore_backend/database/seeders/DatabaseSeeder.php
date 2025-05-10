<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\DietaryPreference;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@lavastore.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        User::factory()->create([
            'name' => 'User',
            'email' => 'user@lavastore.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);

        Category::factory(10)->create();

        // Create specific dietary preferences
        $dietaryPreferences = [
            'Vegan',
            'Gluten-Free',
            'Organic',
            'Vegetarian',
            'Dairy-Free',
            'Nut-Free',
            'Keto',
            'Paleo',
            'Low-Carb',
            'Sugar-Free'
        ];

        foreach ($dietaryPreferences as $preference) {
            DietaryPreference::create(['name' => $preference]);
        }

        Product::factory(100)->create()->each(function ($product) {
            $product->dietaryPreferences()->attach(
                DietaryPreference::inRandomOrder()->take(rand(1, 3))->pluck('id')->toArray()
            );
        });
    }
}
