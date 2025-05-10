<?php

namespace App\Http\Repositories;

use App\Models\DietaryPreference;

class DietaryPreferenceRepository {
    public function getById(string $id) {
        return DietaryPreference::findOrFail($id);
    }

    public function getAll() {
        return DietaryPreference::all();
    }

    public function create(array $data) {
        $dietaryPreference = new DietaryPreference();   
        $dietaryPreference->name = $data['name'];
        if(!$dietaryPreference->save()) {
            return null;
        }
        return $dietaryPreference;
    }

    public function update(DietaryPreference $dietaryPreference, array $data) {
        $dietaryPreference->update($data);
    }

    public function delete(DietaryPreference $dietaryPreference) {
        return $dietaryPreference->delete();
    }
}