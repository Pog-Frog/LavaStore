<?php

namespace App\Http\Repositories;

use App\Models\Product;

class ProductRepository {

    public function getById(string $id) {
        $product = Product::query()->where('id', $id)->with('dietaryPreferences')->first();
        if(!$product) {
            return null;
        }
        return $product;
    }

    public function getAll() {
        return Product::all()->with('dietaryPreferences');
    }

    public function create(array $data) {
        $product = Product::create($data);
        if(!$product) {
            return null;
        }
        if(isset($data['dietary_preferences'])) {
            $product->dietaryPreferences()->attach($data['dietary_preferences']);
        }
        return $product;
    }

    public function update(string $id, array $data) {
        $product = Product::find($id);
        if(!$product) {
            return null;
        }
        $product->update($data);
        if(isset($data['dietary_preferences'])) {
            $product->dietaryPreferences()->detach();
            $product->dietaryPreferences()->attach($data['dietary_preferences']);
        }
        return $product;
    }   

    public function delete(string $id) {
        $product = Product::find($id);
        if(!$product) {
            return null;
        }
        $product->dietaryPreferences()->detach();
        return $product->delete();
    }

    public function getFeaturedProducts() {
        return Product::query()->where('is_featured', true)->limit(4)->get();
    }
}