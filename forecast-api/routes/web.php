<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/products', function () {

    $products = [];
    // Replicating the 100 product generation logic from the frontend
    for ($i = 1; $i <= 100; $i++) {
        $products[] = [
            'id' => $i,
            'name' => "Product " . $i,
            'inventory' => rand(1, 100),
            'avgSales' => rand(5, 54),
            'leadTime' => rand(1, 7),
        ];
    }
    
    return response()->json($products);
})->middleware('cors_fix');