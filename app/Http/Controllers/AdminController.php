<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\QuizAttempt;
use App\Models\QuizPackage;
use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $totalUsers = User::count();
        $totalQuizPackages = QuizPackage::count();
        $totalAttempts = QuizAttempt::count();
        $completedAttempts = QuizAttempt::completed()->count();

        $recentAttempts = QuizAttempt::with(['user', 'quizPackage'])
            ->latest()
            ->limit(10)
            ->get();

        $packageStats = QuizPackage::withCount(['questions', 'quizAttempts'])
            ->with(['quizAttempts' => function ($query) {
                $query->completed();
            }])
            ->get()
            ->map(function ($package) {
                $completedAttempts = $package->quizAttempts->count();
                $totalAttempts = $package->quiz_attempts_count;
                
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'questions_count' => $package->questions_count,
                    'total_attempts' => $totalAttempts,
                    'completed_attempts' => $completedAttempts,
                    'completion_rate' => $totalAttempts > 0 ? round(($completedAttempts / $totalAttempts) * 100, 1) : 0,
                    'average_score' => $package->quizAttempts->avg('score') ?? 0,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalQuizPackages' => $totalQuizPackages,
                'totalAttempts' => $totalAttempts,
                'completedAttempts' => $completedAttempts,
                'completionRate' => $totalAttempts > 0 ? round(($completedAttempts / $totalAttempts) * 100, 1) : 0,
            ],
            'recentAttempts' => $recentAttempts,
            'packageStats' => $packageStats
        ]);
    }


}