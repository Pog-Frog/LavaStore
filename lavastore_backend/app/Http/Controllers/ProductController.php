<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductUpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Repositories\ProductRepository;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    use AuthorizesRequests;
    
    public function __construct(protected ProductRepository $productRepository)
    {
        $this->authorizeResource(Product::class, 'product');
    }

    public function index(Request $request): JsonResponse
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters(Product::allowedFilters())
            ->allowedSorts(Product::allowedSorts())
            ->allowedIncludes(Product::allowedIncludes())
            ->paginate()
            ->appends($request->query());

        return response()->json([
            'message' => 'Products retrieved successfully',
            'data' => $products
        ], 200);
    }

    public function store(ProductCreateRequest $request): JsonResponse
    {
        $product = $this->productRepository->create($request->validated());

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $product = $this->productRepository->getById($id);

        if($product == null) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Product retrieved successfully',
            'data' => $product
        ], 200);
    }

    public function update(ProductUpdateRequest $request, string $id): JsonResponse
    {
        $product = $this->productRepository->update($id, $request->validated());

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->productRepository->delete($id);

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
