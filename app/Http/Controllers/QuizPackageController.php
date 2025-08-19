<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuizPackageRequest;
use App\Http\Requests\UpdateQuizPackageRequest;
use App\Models\QuizPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $quizPackages = QuizPackage::withCount('questions', 'quizAttempts')
                ->latest()
                ->paginate(10);
        } else {
            $quizPackages = QuizPackage::active()
                ->withCount('questions', 'quizAttempts')
                ->latest()
                ->paginate(10);
        }
        
        return Inertia::render('quiz-packages/index', [
            'quizPackages' => $quizPackages,
            'canManage' => $user->isAdmin()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }
        
        return Inertia::render('quiz-packages/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuizPackageRequest $request)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $quizPackage = QuizPackage::create($request->validated());

        return redirect()->route('quiz-packages.show', $quizPackage)
            ->with('success', 'Quiz package created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(QuizPackage $quizPackage)
    {
        $user = auth()->user();
        
        if (!$user->isAdmin() && !$quizPackage->is_active) {
            abort(404);
        }

        $quizPackage->load(['questions' => function ($query) {
            $query->orderBy('order_index');
        }]);

        $userAttempt = $user->quizAttempts()
            ->where('quiz_package_id', $quizPackage->id)
            ->latest()
            ->first();

        return Inertia::render('quiz-packages/show', [
            'quizPackage' => $quizPackage,
            'canManage' => $user->isAdmin(),
            'userAttempt' => $userAttempt,
            'canTakeQuiz' => $quizPackage->hasRequiredQuestions()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QuizPackage $quizPackage)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }
        
        return Inertia::render('quiz-packages/edit', [
            'quizPackage' => $quizPackage
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuizPackageRequest $request, QuizPackage $quizPackage)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $quizPackage->update($request->validated());

        return redirect()->route('quiz-packages.show', $quizPackage)
            ->with('success', 'Quiz package updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QuizPackage $quizPackage)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $quizPackage->delete();

        return redirect()->route('quiz-packages.index')
            ->with('success', 'Quiz package deleted successfully.');
    }
}