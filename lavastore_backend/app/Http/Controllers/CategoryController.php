<?php

namespace App\Http\Controllers;

use App\Http\Repositories\CategoryRepository;
use App\Http\Requests\CategoryCreateRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    public function __construct(protected CategoryRepository $categoryRepository) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Category::class);
        $categories = $this->categoryRepository->getAll();

        return response()->json([
            'message' => 'Categories retrieved successfully',
            'data' => CategoryResource::collection($categories)
        ], 200);
    }

    public function store(CategoryCreateRequest $request): JsonResponse
    {
        $this->authorize('create', Category::class);
        $category = $this->categoryRepository->create($request->validated());

        return response()->json([
            'message' => 'Category created successfully',
            'data' => new CategoryResource($category)
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $category = $this->categoryRepository->getById($id);
        if (!$category) {
            return response()->json([
                'message' => 'Category not found',
            ], 404);
        }

        $this->authorize('view', $category);
        return response()->json([
            'message' => 'Category retrieved successfully',
            'data' => new CategoryResource($category)
        ], 200);
    }

    public function update(CategoryUpdateRequest $request, string $id): JsonResponse
    {
        $category = $this->categoryRepository->getById($id);
        if (!$category) {
            return response()->json([
                'message' => 'Category not found',
            ], 404);
        }

        $this->authorize('update', $category);
        $category = $this->categoryRepository->update($id, $request->validated());

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => new CategoryResource($category)
        ], 200);
    }

    public function destroy(string $id): JsonResponse
    {
        $category = $this->categoryRepository->getById($id);
        if (!$category) {
            return response()->json([
                'message' => 'Category not found',
            ], 404);
        }

        $this->authorize('delete', $category);
        $this->categoryRepository->delete($id);

        return response()->json([
            'message' => 'Category deleted successfully'
        ], 200);
    }
}
