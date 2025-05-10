<?php

namespace App\Http\Repositories;

use App\Models\Category;

class CategoryRepository {
    public function getById(string $id) {
        $category = Category::query()->where('id', $id)->first();
        if(!$category) {
            return null;
        }
        return $category;
    }

    public function getAll() {
        return Category::all();
    }

    public function create(array $data) {
        $category = new Category();
        $category->name = $data['name'];
        if(!$category->save()) {
            return null;
        }
        return $category;
    }

    public function update(string $id, array $data) {
        $category = Category::query()->where('id', $id)->first();
        if(!$category) {
            return null;
        }
        $category->update($data);
        return $category;
    }

    public function delete(string $id) {
        $category = Category::query()->where('id', $id)->first();
        if(!$category) {
            return null;
        }
        return $category->delete();
    }
}
