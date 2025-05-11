<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'original_price',
        'image_url',
        'category_id',
        'is_featured',
        'badge'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    public static function allowedFilters()
    {
        return [
            AllowedFilter::exact('category_id'),
            AllowedFilter::exact('is_featured'),
            AllowedFilter::exact('badge'),
            AllowedFilter::scope('price_between'),
            AllowedFilter::scope('has_dietary_preference'),
            AllowedFilter::callback('dietary_preferences', function ($query, $value) {
                if (is_array($value)) {
                    foreach ($value as $preferenceId) {
                        $query->whereHas('dietaryPreferences', function ($query) use ($preferenceId) {
                            $query->where('dietary_preferences.id', $preferenceId);
                        });
                    }
                }
            }),
        ];
    }

    public static function allowedSorts()
    {
        return [
            AllowedSort::field('name'),
            AllowedSort::field('price'),
            AllowedSort::field('created_at'),
        ];
    }

    public static function allowedIncludes()
    {
        return [
            'category',
            'dietaryPreferences',
        ];
    }

    public function scopePriceBetween($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    public function scopeHasDietaryPreference($query, $preferenceId)
    {
        return $query->whereHas('dietaryPreferences', function ($query) use ($preferenceId) {
            $query->where('dietary_preferences.id', $preferenceId);
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function dietaryPreferences(): BelongsToMany
    {
        return $this->belongsToMany(DietaryPreference::class, 'dietary_preference_product');
    }
}
