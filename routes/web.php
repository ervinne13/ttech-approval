<?php

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

Route::get('/', 'HomeController@index');

Route::get('/logout', "Auth\LoginController@logout");
Route::auth();

Route::get("/test", "TestController@testConnectivity");
Route::get("/testAuth", "TestController@testAuth");

Route::group(['middleware' => ['auth']], function() {
    Route::resource('tracking', 'DocumentTrackingController');
    Route::get('tracking/datatable', 'DocumentTrackingController@datatable');

    Route::resource('purchase-order', 'Purchasing\PurchaseOrderController');
    Route::resource('purchase-request', 'Purchasing\PurchaseRequestController');

    Route::post('approval/{moduleId}/{action}', 'ApprovalController@action');

    Route::get('change-password', 'UsersController@changePassword');
    Route::post('change-password', 'UsersController@updatePassword');
});
