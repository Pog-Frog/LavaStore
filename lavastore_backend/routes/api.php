<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DietaryPreferenceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get('/products/featured', [ProductController::class, 'getFeaturedProducts']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('users')->group(function () {
        Route::post('/profile-update', [UserController::class, 'updateUser']);
    });

    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('/search', [ProductController::class, 'search']);
        Route::get('/{id}', [ProductController::class, 'show']);
        Route::post('/', [ProductController::class, 'store']);
        Route::post('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/{id}', [CategoryController::class, 'show']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });

    Route::prefix('dietary-preferences')->group(function () {
        Route::get('/', [DietaryPreferenceController::class, 'index']);
        Route::get('/{id}', [DietaryPreferenceController::class, 'show']);
        Route::post('/', [DietaryPreferenceController::class, 'store']);
        Route::put('/{id}', [DietaryPreferenceController::class, 'update']);
        Route::delete('/{id}', [DietaryPreferenceController::class, 'destroy']);
    });

    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/user', [OrderController::class, 'getByUser']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::post('/', [OrderController::class, 'store']);
        Route::put('/{id}', [OrderController::class, 'update']);
        Route::patch('/{id}/status', [OrderController::class, 'updateStatus']);
        Route::delete('/{id}', [OrderController::class, 'destroy']);
    });
});

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
