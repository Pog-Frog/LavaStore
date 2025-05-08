<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class DietaryPreferenceProduct extends Model
{
    use HasFactory;
    
    protected $fillable = ['product_id', 'dietary_preference_id'];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function dietaryPreference() {
        return $this->belongsTo(DietaryPreference::class);
    }
}
