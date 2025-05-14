<?php

namespace App\Http\Controllers;

use App\Http\Repositories\OrderRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    use AuthorizesRequests;

    public function __construct(protected OrderRepository $orderRepository) {}

    public function index(): JsonResponse // Get all orders
    {
        $orders = $this->orderRepository->getAll();

        return response()->json([
            'message' => 'Orders retrieved successfully',
            'data' => $orders
        ]);
    }

    public function getByUser(): JsonResponse // Get all orders by user ID
    {
        $id = Auth::id();
        $orders = $this->orderRepository->getByUser($id);

        return response()->json([
            'message' => 'Orders retrieved successfully',
            'data' => $orders
        ]);
    }

    public function show(string $id): JsonResponse // Get a single order by ID
    {
        $order = $this->orderRepository->getById($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        // $this->authorize('view', $order);

        return response()->json([
            'message' => 'Order retrieved successfully',
            'data' => $order
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        $orderData = [
            'user_id' => Auth::id(),
            'total' => collect($request->items)->sum(fn($item) => $item['quantity'] * $item['price'])
        ];

        $order = $this->orderRepository->createOrder($orderData, $request->items);

        return response()->json([
            'message' => 'Order created successfully',
            'data' => $order
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'  
        ]);

        $order = $this->orderRepository->getById($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        // $this->authorize('update', $order);
        
        $order = $this->orderRepository->updateOrderItem($id, $request->items);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }   

        return response()->json([
            'message' => 'Order updated successfully',
            'data' => $order
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:pending,delivered,cancelled'
        ]);

        $order = $this->orderRepository->getById($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        // $this->authorize('update', $order);

        $order = $this->orderRepository->updateStatus($id, $request->status);

        return response()->json([
            'message' => 'Order status updated successfully',
            'data' => $order
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $order = $this->orderRepository->getById($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        // $this->authorize('delete', $order);

        $this->orderRepository->delete($id);

        return response()->json([
            'message' => 'Order deleted successfully'
        ]);
    }
} 