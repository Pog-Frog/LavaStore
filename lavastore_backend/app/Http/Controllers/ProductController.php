<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters(Product::allowedFilters())
            ->allowedSorts(Product::allowedSorts())
            ->allowedIncludes(Product::allowedIncludes())
            ->paginate()
            ->appends($request->query());

        return response()->json($products);
    }
} 