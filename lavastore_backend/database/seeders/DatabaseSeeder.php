<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
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

        $user = User::factory()->create([
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

        $orders = Order::factory(2)->create([
            'user_id' => $user->id,
            'status' => 'pending',
            'total' => 100,
        ]);

        foreach ($orders as $order) {
            OrderItem::factory(2)->create([
                'order_id' => $order->id,
                'product_id' => Product::inRandomOrder()->take(1)->pluck('id')->toArray()[0],
                'quantity' => 1,
                'price' => Product::inRandomOrder()->take(1)->pluck('price')->toArray()[0],
            ]);
        }   

    }
}
