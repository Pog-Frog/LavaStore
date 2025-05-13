<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total',
        'status',
        // 'shipping_address',
        // 'billing_address',
        // 'payment_method',
        // 'payment_status',
        // 'notes'
    ];

    protected $casts = [
        'total' => 'decimal:2',
        // 'shipping_address' => 'array',
        // 'billing_address' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'order_items')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function calculateTotal(): void
    {
        $this->total = $this->orderItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });
        $this->save();
    }
} 