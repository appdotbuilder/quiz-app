<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $users = User::withCount('quizAttempts')
            ->with(['quizAttempts' => function ($query) {
                $query->completed()->latest()->limit(5);
            }])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/users', [
            'users' => $users
        ]);
    }
}