import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

interface Question {
    id: number;
    question_text: string;
    options: string[];
    correct_answer: string;
    user_answer: string | null;
    is_correct: boolean;
    explanation: string | null;
}

interface QuizPackage {
    id: number;
    name: string;
    description: string;
}

interface QuizAttempt {
    id: number;
    score: number;
    total_questions: number;
    started_at: string;
    completed_at: string;
    time_taken_seconds: number;
}

interface QuizResultProps {
    quizPackage: QuizPackage;
    attempt: QuizAttempt;
    questions: Question[];
    score: number;
    totalQuestions: number;
    percentage: number;
    timeTaken: string;
    [key: string]: unknown;
}

export default function QuizResult() {
    const { quizPackage, questions, score, totalQuestions, percentage, timeTaken } = usePage<QuizResultProps>().props;
    
    const [showReview, setShowReview] = useState(false);
    const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

    const getGradeInfo = () => {
        if (percentage >= 90) return { grade: 'A+', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/20', emoji: '🏆' };
        if (percentage >= 80) return { grade: 'A', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/20', emoji: '🎉' };
        if (percentage >= 70) return { grade: 'B', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20', emoji: '👍' };
        if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/20', emoji: '📖' };
        return { grade: 'D', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20', emoji: '💪' };
    };

    const gradeInfo = getGradeInfo();

    const correctAnswers = questions.filter(q => q.is_correct).length;
    const incorrectAnswers = questions.filter(q => !q.is_correct && q.user_answer).length;
    const unanswered = questions.filter(q => !q.user_answer).length;

    const filteredQuestions = questions.filter(question => {
        if (reviewFilter === 'correct') return question.is_correct;
        if (reviewFilter === 'incorrect') return !question.is_correct && question.user_answer;
        return true;
    });

    return (
        <>
            <Head title={`Quiz Results: ${quizPackage.name}`} />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <div className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                📊 Quiz Completed!
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {quizPackage.name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Results Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8 dark:bg-gray-800">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">{gradeInfo.emoji}</div>
                            <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${gradeInfo.bg} ${gradeInfo.color}`}>
                                Grade: {gradeInfo.grade}
                            </div>
                            <div className="mt-4">
                                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                    {score}/{totalQuestions}
                                </div>
                                <div className="text-lg text-gray-600 dark:text-gray-400">
                                    {percentage.toFixed(1)}% Score
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                                <div className="text-2xl text-green-600 dark:text-green-400 mb-2">✅</div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</div>
                                <div className="text-sm text-green-600/80 dark:text-green-400/80">Correct</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg dark:bg-red-900/20">
                                <div className="text-2xl text-red-600 dark:text-red-400 mb-2">❌</div>
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{incorrectAnswers}</div>
                                <div className="text-sm text-red-600/80 dark:text-red-400/80">Incorrect</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                                <div className="text-2xl text-gray-600 dark:text-gray-400 mb-2">⭕</div>
                                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{unanswered}</div>
                                <div className="text-sm text-gray-600/80 dark:text-gray-400/80">Unanswered</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                                <div className="text-2xl text-blue-600 dark:text-blue-400 mb-2">⏱️</div>
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{timeTaken}</div>
                                <div className="text-sm text-blue-600/80 dark:text-blue-400/80">Time Taken</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setShowReview(!showReview)}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            >
                                📝 {showReview ? 'Hide Review' : 'Review Answers'}
                            </button>
                            <Link
                                href={route('quiz-packages.index')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                📚 Back to Quiz Packages
                            </Link>
                        </div>
                    </div>

                    {/* Answer Review */}
                    {showReview && (
                        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                        📋 Answer Review
                                    </h2>
                                    <div className="flex space-x-2">
                                        {[
                                            { key: 'all', label: 'All', count: questions.length },
                                            { key: 'correct', label: 'Correct', count: correctAnswers },
                                            { key: 'incorrect', label: 'Incorrect', count: incorrectAnswers }
                                        ].map((filter) => (
                                            <button
                                                key={filter.key}
                                                onClick={() => setReviewFilter(filter.key as typeof reviewFilter)}
                                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                    reviewFilter === filter.key
                                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {filter.label} ({filter.count})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredQuestions.map((question) => (
                                    <div key={question.id} className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                Question {questions.indexOf(question) + 1}
                                            </h3>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                question.is_correct 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                    : question.user_answer
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                                {question.is_correct ? '✅ Correct' : question.user_answer ? '❌ Incorrect' : '⭕ Unanswered'}
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            {question.question_text}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            {question.options.map((option, optionIndex) => (
                                                <div 
                                                    key={optionIndex}
                                                    className={`p-3 rounded-md border ${
                                                        option === question.correct_answer 
                                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400'
                                                            : option === question.user_answer && !question.is_correct
                                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-900 dark:text-white">
                                                            {String.fromCharCode(65 + optionIndex)}. {option}
                                                        </span>
                                                        {option === question.correct_answer && (
                                                            <span className="text-green-600 dark:text-green-400 font-medium">✓ Correct</span>
                                                        )}
                                                        {option === question.user_answer && !question.is_correct && (
                                                            <span className="text-red-600 dark:text-red-400 font-medium">Your Answer</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {question.explanation && (
                                            <div className="bg-blue-50 p-4 rounded-md dark:bg-blue-900/20">
                                                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">💡 Explanation</h4>
                                                <p className="text-blue-800 dark:text-blue-300">{question.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {filteredQuestions.length === 0 && (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    No questions match the selected filter.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}