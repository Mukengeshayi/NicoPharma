<?php

use App\Http\Controllers\FamilyController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UnitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('forms', FormController::class)->except(['create','edit']);
    Route::resource('families',FamilyController::class)->except(['create','edit']);

    Route::resource('/medicines', MedicineController::class)->except(['create','edit']);
    Route::post('medicines/mass-destroy', [MedicineController::class, 'massDestroy'])->name('medicines.mass-destroy');
    Route::get('medicines/{medicine}/packaging/create-bulk', [MedicineController::class, 'createBulk'])->name('medicines.packaging.create-bulk');
    Route::post('medicines/{medicine}/packaging/store-bulk', [MedicineController::class, 'storeBulk'])->name('medicines.packaging.store-bulk');

    Route::resource('/units', UnitController::class)->except(['create','edit'])->except(['create','edit']);
    Route::post('units/mass-destroy', [UnitController::class, 'massDestroy'])->name('units.mass-destroy');





});

require __DIR__.'/auth.php';
