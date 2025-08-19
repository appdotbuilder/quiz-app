<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizAttemptController;
use App\Http\Controllers\QuizPackageController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Quiz Packages
    Route::resource('quiz-packages', QuizPackageController::class);

    // Questions (nested under quiz packages)
    Route::prefix('quiz-packages/{quizPackage}')->group(function () {
        Route::get('questions', [QuestionController::class, 'index'])->name('questions.index');
        Route::get('questions/create', [QuestionController::class, 'create'])->name('questions.create');
        Route::post('questions', [QuestionController::class, 'store'])->name('questions.store');
        Route::get('questions/{question}', [QuestionController::class, 'show'])->name('questions.show');
        Route::get('questions/{question}/edit', [QuestionController::class, 'edit'])->name('questions.edit');
        Route::put('questions/{question}', [QuestionController::class, 'update'])->name('questions.update');
        Route::delete('questions/{question}', [QuestionController::class, 'destroy'])->name('questions.destroy');
    });

    // Quiz Attempts (nested under quiz packages)
    Route::prefix('quiz-packages/{quizPackage}')->group(function () {
        Route::post('attempts', [QuizAttemptController::class, 'store'])->name('quiz-attempts.store');
        Route::get('attempts/{attempt}', [QuizAttemptController::class, 'show'])->name('quiz-attempts.show');
        Route::put('attempts/{attempt}', [QuizAttemptController::class, 'update'])->name('quiz-attempts.update');
        Route::get('attempts/{attempt}/edit', [QuizAttemptController::class, 'edit'])->name('quiz-attempts.edit');
    });

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
        Route::get('users', [UserController::class, 'index'])->name('admin.users');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
