<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Repositories\ProductRepository;
use Spatie\QueryBuilder\QueryBuilder;

//TODO: Add route to get the products that will be displayed in the index page
class ProductController extends Controller
{
    use AuthorizesRequests;

    public function __construct(protected ProductRepository $productRepository) {}

    public function index(Request $request): JsonResponse
    {
        $result = QueryBuilder::for(Product::class)
            ->allowedFilters(Product::allowedFilters())
            ->allowedSorts(Product::allowedSorts())
            ->allowedIncludes(Product::allowedIncludes())
            ->paginate()
            ->appends($request->query());
            

        return response()->json([
            'message' => 'Products retrieved successfully',
            'data' => $result
        ]);
    }

    public function store(ProductCreateRequest $request): JsonResponse
    {
        $this->authorize('create', Product::class);
        $product = $this->productRepository->create($request->validated());

        return response()->json([
            'message' => 'Product created successfully',
            'data' => new ProductResource($product)
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $product = $this->productRepository->getById($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Product retrieved successfully',
            'data' => new ProductResource($product)
        ]);
    }

    public function update(ProductUpdateRequest $request, string $id): JsonResponse
    {
        $product = $this->productRepository->getById($id);
        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }
        $this->authorize('update', $product);
        $data = [
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'original_price' => $request->input('original_price'),
            'image_url' => $request->input('image_url'),
            'category_id' => $request->input('category_id'),
            'is_featured' => $request->input('is_featured') === 'true' ? true : false,
            'badge' => $request->input('badge'),
            'dietary_preferences' => $request->input('dietary_preferences')
        ];

        if($request->has('image')) {
            $data['image_url'] = $request->input('image');
        } else {
            $data['image_url'] = $product->image_url;
        }

        $product = $this->productRepository->update($id, $data);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => new ProductResource($product)
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $product = $this->productRepository->getById($id);
        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }
        
        $this->authorize('delete', $product);
        $this->productRepository->delete($id);

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    public function getFeaturedProducts(): JsonResponse
    {
        $products = $this->productRepository->getFeaturedProducts();

        return response()->json([
            'message' => 'Products retrieved successfully',
            'data' => $products
        ]);
    }
}
