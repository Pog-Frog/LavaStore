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
        $product->dietaryPreferences()->attach($data['dietary_preferences']);
        return $product;
    }

    public function update(string $id, array $data) {
        $product = Product::find($id);
        if(!$product) {
            return null;
        }
        $product->update($data);
        $product->dietaryPreferences()->sync($data['dietary_preferences']);
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
}