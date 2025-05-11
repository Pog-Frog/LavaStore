<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'original_price' => $this->original_price,
            'image_url' => $this->image_url,
            'is_featured' => $this->is_featured,
            'badge' => $this->badge,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'category' => $this->category,
            'dietary_preferences' => $this->dietaryPreferences,
        ];
    }
} 