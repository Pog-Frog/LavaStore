<?php

namespace App\Http\Repositories;

use App\Models\Product;

class ProductRepository {

    public function getById(string $id) {
        return Product::findOrFail($id)->with('dietaryPreferences');
    }

    public function getAll() {
        return Product::all()->with('dietaryPreferences');
    }

    public function create(array $data) {
        $product = Product::create($data);
        if(!$product) {
            return null;
        }
        $product->dietaryPreferences()->attach($data['dietary_preferences']);
        return $product;
    }

    public function update(Product $product, array $data) {
        $product->update($data);
        $product->dietaryPreferences()->sync($data['dietary_preferences']);
        return $product;
    }   

    public function delete(Product $product) {
        $product->dietaryPreferences()->detach();
        return $product->delete();
    }
}