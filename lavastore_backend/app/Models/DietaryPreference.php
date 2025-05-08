<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DietaryPreference extends Model
{
    use HasFactory;
    
    protected $fillable = ['name'];

    /**
     * Get the products that have this dietary preference.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'dietary_preference_product');
    }
} 