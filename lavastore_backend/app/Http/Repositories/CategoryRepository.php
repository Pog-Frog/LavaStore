<?php

namespace App\Http\Repositories;

use App\Models\Category;

class CategoryRepository {
    public function getById(string $id) {
        return Category::findOrFail($id);
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

    public function update(Category $category, array $data) {
        $category->update($data);
    }

    public function delete(Category $category) {
        return $category->delete();
    }
}
