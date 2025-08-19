<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\QuizPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizAttemptController extends Controller
{
    /**
     * Store a newly created quiz attempt (start quiz).
     */
    public function store(Request $request, QuizPackage $quizPackage)
    {
        $user = auth()->user();

        if (!$quizPackage->is_active) {
            abort(404);
        }

        if (!$quizPackage->hasRequiredQuestions()) {
            return redirect()->route('quiz-packages.show', $quizPackage)
                ->with('error', 'This quiz package does not have the required 110 questions.');
        }

        // Check if user has an incomplete attempt
        $incompleteAttempt = $user->quizAttempts()
            ->where('quiz_package_id', $quizPackage->id)
            ->whereNull('completed_at')
            ->first();

        if ($incompleteAttempt) {
            return redirect()->route('quiz-attempts.show', [$quizPackage, $incompleteAttempt]);
        }

        // Create new quiz attempt
        $questions = $quizPackage->questions()
            ->orderBy('order_index')
            ->get();

        $attempt = QuizAttempt::create([
            'user_id' => $user->id,
            'quiz_package_id' => $quizPackage->id,
            'answers' => [],
            'score' => 0,
            'total_questions' => $questions->count(),
            'started_at' => now(),
        ]);

        return redirect()->route('quiz-attempts.show', [$quizPackage, $attempt]);
    }

    /**
     * Display the specified quiz attempt (take quiz).
     */
    public function show(QuizPackage $quizPackage, QuizAttempt $attempt)
    {
        $user = auth()->user();

        if ($attempt->user_id !== $user->id) {
            abort(403);
        }

        if ($attempt->isCompleted()) {
            return redirect()->route('quiz-attempts.edit', [$quizPackage, $attempt]);
        }

        // Check if 2 hours have passed
        if ($attempt->started_at->diffInSeconds(now()) > 7200) { // 2 hours = 7200 seconds
            // Auto-complete the quiz with current answers
            $this->completeQuizAttempt($attempt);
            return redirect()->route('quiz-attempts.edit', [$quizPackage, $attempt]);
        }

        $questions = $quizPackage->questions()
            ->orderBy('order_index')
            ->get(['id', 'question_text', 'options']);

        $questionsData = [];
        foreach ($questions as $question) {
            /** @var Question $question */
            $questionsData[] = [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'options' => $question->options,
            ];
        }

        return Inertia::render('quiz/take', [
            'quizPackage' => $quizPackage,
            'attempt' => $attempt,
            'questions' => $questionsData,
            'currentAnswers' => $attempt->answers ?? [],
            'timeLimit' => 7200, // 2 hours in seconds
            'timeRemaining' => 7200 - $attempt->started_at->diffInSeconds(now())
        ]);
    }

    /**
     * Update the specified quiz attempt (submit answers).
     */
    public function update(Request $request, QuizPackage $quizPackage, QuizAttempt $attempt)
    {
        $user = auth()->user();

        if ($attempt->user_id !== $user->id) {
            abort(403);
        }

        if ($attempt->isCompleted()) {
            return redirect()->route('quiz-attempts.edit', [$quizPackage, $attempt]);
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|string'
        ]);

        // Update answers
        $attempt->update([
            'answers' => $request->answers
        ]);

        // Complete the quiz
        $this->completeQuizAttempt($attempt);

        return redirect()->route('quiz-attempts.edit', [$quizPackage, $attempt]);
    }

    /**
     * Show the form for editing the specified resource (show results).
     */
    public function edit(QuizPackage $quizPackage, QuizAttempt $attempt)
    {
        $user = auth()->user();

        if ($attempt->user_id !== $user->id) {
            abort(403);
        }

        if (!$attempt->isCompleted()) {
            return redirect()->route('quiz-attempts.show', [$quizPackage, $attempt]);
        }

        // Get questions with correct answers and user answers
        $allQuestions = $quizPackage->questions()
            ->orderBy('order_index')
            ->get();

        $questions = [];
        foreach ($allQuestions as $question) {
            /** @var Question $question */
            $userAnswer = $attempt->answers[$question->id] ?? null;
            $questions[] = [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'options' => $question->options,
                'correct_answer' => $question->correct_answer,
                'user_answer' => $userAnswer,
                'is_correct' => $userAnswer === $question->correct_answer,
                'explanation' => $question->explanation,
            ];
        }

        return Inertia::render('quiz/result', [
            'quizPackage' => $quizPackage,
            'attempt' => $attempt,
            'questions' => $questions,
            'score' => $attempt->score,
            'totalQuestions' => $attempt->total_questions,
            'percentage' => $attempt->getPercentageScore(),
            'timeTaken' => $attempt->getFormattedTimeTaken()
        ]);
    }

    /**
     * Complete the quiz attempt and calculate score.
     */
    protected function completeQuizAttempt(QuizAttempt $attempt): void
    {
        $questions = Question::where('quiz_package_id', $attempt->quiz_package_id)
            ->orderBy('order_index')
            ->get();

        $score = 0;
        $userAnswers = $attempt->answers ?? [];

        foreach ($questions as $question) {
            $userAnswer = $userAnswers[$question->id] ?? null;
            if ($userAnswer === $question->correct_answer) {
                $score++;
            }
        }

        $timeTaken = $attempt->started_at->diffInSeconds(now());

        $attempt->update([
            'score' => $score,
            'completed_at' => now(),
            'time_taken_seconds' => $timeTaken
        ]);
    }
}