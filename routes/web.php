<?php

use App\Http\Controllers\FacturaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [FacturaController::class, 'showFactures']);

Route::get('/factura', [FacturaController::class, 'showFactura']);

Route::get('/getFactures', [FacturaController::class, 'getFactures']);

Route::post('/deleteFactura', [FacturaController::class, 'deleteFactura']);

