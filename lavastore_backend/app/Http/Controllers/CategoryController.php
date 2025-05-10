<?php

namespace App\Http\Controllers;

use App\Http\Repositories\CategoryRepository;
use App\Http\Requests\CategoryCreateRequest;
use App\Http\Requests\CategoryUpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Category;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    public function __construct(protected CategoryRepository $categoryRepository) {
        $this->authorizeResource(Category::class, 'category');
    }

    public function index(): JsonResponse {
        $categories = $this->categoryRepository->getAll();

        return response()->json([
            'message' => 'Categories retrieved successfully',
            'data' => $categories
        ], 200);
    }

    public function store(CategoryCreateRequest $request): JsonResponse {
        $category = $this->categoryRepository->create($request->all());
        if(!$category) {
            return response()->json([
                'message' => 'Category not created',
            ], 400);
        }

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    public function show(string $id): JsonResponse {
        $category = $this->categoryRepository->getById($id);
        if(!$category) {
            return response()->json([
                'message' => 'Category not found',
            ], 404);
        }
        return response()->json([
            'message' => 'Category retrieved successfully',
            'data' => $category
        ], 200);
    }
    
    public function update(CategoryUpdateRequest $request, string $id): JsonResponse {
        $category = $this->categoryRepository->update($id, $request->all());
        if(!$category) {
            return response()->json([
                'message' => 'Category not updated',
            ], 400);
        }
        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ], 200);
    }

    public function destroy(string $id): JsonResponse {
        $category = $this->categoryRepository->delete($id);

        return response()->json([
            'message' => 'Category deleted successfully'
        ], 200);
    }
    
}
