<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ArticleController;
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

/** Factura */
Route::get('/', [FacturaController::class, 'showFactures']);

Route::get('/factura', [FacturaController::class, 'showFactura']);

Route::get('/getFactures', [FacturaController::class, 'getFactures']);

Route::post('/getFactura', [FacturaController::class, 'getFactura']);

Route::post('/upsertFactura', [FacturaController::class, 'upsertFactura']);

Route::post('/deleteFactura', [FacturaController::class, 'deleteFactura']);

/** Client */
Route::post('/getClient', [ClientController::class, 'getClient']);

/** Article */
Route::post('/getArticle', [ArticleController::class, 'getArticle']);