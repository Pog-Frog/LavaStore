<?php

namespace App\Http\Repositories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderRepository
{
    public function getAll()
    {
        return Order::query()
            ->with('orderItems.product')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getById(string $id)
    {
        return Order::query()
            ->where('id', $id)
            ->with('orderItems.product')
            ->first();
    }

    public function getByUser(int $userId)
    {
        return Order::query()
            ->where('user_id', $userId)
            ->with('orderItems.product')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data)
    {
        return Order::create($data);
    }

    public function update(string $id, array $data)
    {
        $order = Order::query()->where('id', $id)->first();
        if(!$order) {
            return null;
        }
        $order->update($data);
        return $order;
    }

    public function createOrder(array $orderData, array $items)
    {
        return DB::transaction(function () use ($orderData, $items) {
            $order = $this->create([
                'user_id' => $orderData['user_id'],
                'total' => 0
            ]);

            foreach ($items as $item) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => Product::find($item['product_id'])->price
                ]);
                $order->total += $orderItem->price * $orderItem->quantity;
            }

            $order->save();

            return $order;
        });
    }

    public function updateOrderItem(string $id, array $items) {
        $order = Order::query()->where('id', $id)->first();
        if(!$order) {
            return null;
        }

        $order->orderItems()->delete();
        $order->total = 0;

        foreach ($items as $item) {
            $orderItem = OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => Product::find($item['product_id'])->price
            ]);
            $order->total += $orderItem->price * $orderItem->quantity;
        }

        $order->save();
        return $order;
    }

    public function updateStatus(string $id, string $status)
    {
        $order = Order::find($id);
        if (!$order) {
            return null;
        }
        $order->update(['status' => $status]);
        return $order;
    }

    public function delete(string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return null;
        }
        return $order->delete();
    }
} 