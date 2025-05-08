<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;
use App\Models\DietaryPreference;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DietaryPreferenceProduct>
 */
class DietaryPreferenceProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'dietary_preference_id' => DietaryPreference::factory(),
        ];
    }
}
