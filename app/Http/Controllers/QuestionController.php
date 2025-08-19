<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\Question;
use App\Models\QuizPackage;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(QuizPackage $quizPackage)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $questions = $quizPackage->questions()
            ->orderBy('order_index')
            ->paginate(20);

        return Inertia::render('questions/index', [
            'quizPackage' => $quizPackage,
            'questions' => $questions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(QuizPackage $quizPackage)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        // Check if package already has 110 questions
        if ($quizPackage->questions()->count() >= 110) {
            return redirect()->route('questions.index', $quizPackage)
                ->with('error', 'Quiz package already has the maximum number of questions (110).');
        }

        $nextOrderIndex = $quizPackage->questions()->max('order_index') + 1;

        return Inertia::render('questions/create', [
            'quizPackage' => $quizPackage,
            'nextOrderIndex' => $nextOrderIndex
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuestionRequest $request, QuizPackage $quizPackage)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        // Check if package already has 110 questions
        if ($quizPackage->questions()->count() >= 110) {
            return redirect()->route('questions.index', $quizPackage)
                ->with('error', 'Quiz package already has the maximum number of questions (110).');
        }

        $validated = $request->validated();
        $validated['quiz_package_id'] = $quizPackage->id;

        Question::create($validated);

        return redirect()->route('questions.index', $quizPackage)
            ->with('success', 'Question created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(QuizPackage $quizPackage, Question $question)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        if ($question->quiz_package_id !== $quizPackage->id) {
            abort(404);
        }

        return Inertia::render('questions/show', [
            'quizPackage' => $quizPackage,
            'question' => $question
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QuizPackage $quizPackage, Question $question)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        if ($question->quiz_package_id !== $quizPackage->id) {
            abort(404);
        }

        return Inertia::render('questions/edit', [
            'quizPackage' => $quizPackage,
            'question' => $question
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionRequest $request, QuizPackage $quizPackage, Question $question)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        if ($question->quiz_package_id !== $quizPackage->id) {
            abort(404);
        }

        $question->update($request->validated());

        return redirect()->route('questions.show', [$quizPackage, $question])
            ->with('success', 'Question updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QuizPackage $quizPackage, Question $question)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        if ($question->quiz_package_id !== $quizPackage->id) {
            abort(404);
        }

        $question->delete();

        return redirect()->route('questions.index', $quizPackage)
            ->with('success', 'Question deleted successfully.');
    }
}