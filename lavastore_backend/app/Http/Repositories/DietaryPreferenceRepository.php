<?php

namespace App\Http\Repositories;

use App\Models\DietaryPreference;

class DietaryPreferenceRepository {
    public function getById(string $id) {
        $dietaryPreference = DietaryPreference::findOrFail($id);
        if(!$dietaryPreference) {
            return null;
        }
        return $dietaryPreference;
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

    public function update(string $id, array $data) {
        $dietaryPreference = DietaryPreference::findOrFail($id);
        if(!$dietaryPreference) {
            return null;
        }
        $dietaryPreference->update($data);
        return $dietaryPreference;
    }

    public function delete(string $id) {
        $dietaryPreference = DietaryPreference::findOrFail($id);
        if(!$dietaryPreference) {
            return null;
        }
        return $dietaryPreference->delete();
    }
}