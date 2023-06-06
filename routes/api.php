<?php

use App\Http\Controllers\CallController;
use App\Http\Controllers\MessageClasseController;
use App\Http\Controllers\MessagePriveController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Route::get('/tuteurs/{id}/discussions' , [UsersController::class , 'getDiscussionsTuteur']);
// Route::get('/professeurs/{id}/discussions' , [UsersController::class , 'getDiscussionsProfesseur']);
Route::get('/users/{userType}/{id}/discussions' , [UsersController::class , 'getDiscussions']);
Route::get('classe-messages/{id}' , [MessageClasseController::class , 'getClasseMessages']);
Route::post('classe-message/send' , [MessageClasseController::class , 'sendMessage']);
Route::get('privates-messages/{id}' , [MessagePriveController::class , 'getPrivateMessages']);
Route::post('private-message/send' , [MessagePriveController::class , 'sendMessage']);
Route::post('call' , [CallController::class , 'call']);
