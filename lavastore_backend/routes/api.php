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
    Route::post('/users/profile-update', [UserController::class, 'updateUser']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{id}', [CategoryController::class, 'update']);
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

    Route::get('/dietary-preferences', [DietaryPreferenceController::class, 'index']);
    Route::get('/dietary-preferences/{id}', [DietaryPreferenceController::class, 'show']);
    Route::post('dietary-preferences', [DietaryPreferenceController::class, 'store']);
    Route::put('dietary-preferences/{id}', [DietaryPreferenceController::class, 'update']);
    Route::delete('dietary-preferences/{id}', [DietaryPreferenceController::class, 'destroy']);

    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::get('orders/user', [OrderController::class, 'getByUser']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::put('orders/{id}', [OrderController::class, 'update']);
    Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::delete('orders/{id}', [OrderController::class, 'destroy']);
});

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
