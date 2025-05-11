<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 1, 100),
            'original_price' => function ($attributes) {
                $randInt = fake()->numberBetween(0, 1);
                if ($randInt == 0) {
                    return null;
                }
                return $attributes['price'] + fake()->randomFloat(2, 1, 100);
            },
            'image_url' => 'https://placehold.co/400x400',
            'category_id' => Category::factory(),
            'is_featured' => fake()->boolean(),
            'badge' => fake()->randomElement(['NEW', 'POPULAR', 'BEST SELLER']),
            
        ];
    }
}
