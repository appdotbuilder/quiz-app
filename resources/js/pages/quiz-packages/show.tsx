import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Question {
    id: number;
    question_text: string;
    options: string[];
    order_index: number;
}

interface QuizPackage {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    questions: Question[];
    created_at: string;
}

interface QuizAttempt {
    id: number;
    score: number;
    total_questions: number;
    completed_at: string;
    started_at: string;
}

interface QuizPackageShowProps {
    quizPackage: QuizPackage;
    canManage: boolean;
    userAttempt: QuizAttempt | null;
    canTakeQuiz: boolean;
    [key: string]: unknown;
}

export default function ShowQuizPackage() {
    const { quizPackage, canManage, userAttempt, canTakeQuiz } = usePage<QuizPackageShowProps>().props;

    const handleStartQuiz = () => {
        router.post(route('quiz-attempts.store', quizPackage.id));
    };

    const getStatusBadge = () => {
        if (!quizPackage.is_active) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    📴 Inactive
                </span>
            );
        }
        
        if (quizPackage.questions.length < 110) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    ⚠️ Incomplete ({quizPackage.questions.length}/110 questions)
                </span>
            );
        }
        
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                ✅ Ready to Take
            </span>
        );
    };

    return (
        <AppShell>
            <Head title={quizPackage.name} />
            
            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <Link
                                href={route('quiz-packages.index')}
                                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                ← Back to Quiz Packages
                            </Link>
                            {getStatusBadge()}
                        </div>
                        
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            📚 {quizPackage.name}
                        </h1>
                        
                        {quizPackage.description && (
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                {quizPackage.description}
                            </p>
                        )}
                    </div>

                    {/* Quiz Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
                            <div className="text-2xl text-blue-600 dark:text-blue-400 mb-2">📝</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {quizPackage.questions.length}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Questions Available</div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
                            <div className="text-2xl text-purple-600 dark:text-purple-400 mb-2">⏱️</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">2 Hours</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Time Limit</div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
                            <div className="text-2xl text-green-600 dark:text-green-400 mb-2">🎯</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {userAttempt ? 'Completed' : 'Not Taken'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Your Status</div>
                        </div>
                    </div>

                    {/* User Attempt Status */}
                    {userAttempt && (
                        <div className="bg-blue-50 rounded-lg p-6 mb-8 dark:bg-blue-900/20">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="text-2xl text-blue-600 dark:text-blue-400">📊</div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200">
                                        Your Last Attempt
                                    </h3>
                                    <div className="mt-2 text-blue-800 dark:text-blue-300">
                                        <p>Score: {userAttempt.score}/{userAttempt.total_questions} ({((userAttempt.score / userAttempt.total_questions) * 100).toFixed(1)}%)</p>
                                        <p>Completed: {new Date(userAttempt.completed_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={route('quiz-attempts.edit', [quizPackage.id, userAttempt.id])}
                                            className="text-blue-700 hover:text-blue-800 font-medium dark:text-blue-300 dark:hover:text-blue-200"
                                        >
                                            View Full Results →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Take Quiz Section */}
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8 dark:bg-gray-800">
                        <div className="text-center">
                            {canTakeQuiz && quizPackage.is_active ? (
                                <>
                                    <div className="text-4xl mb-4">🎯</div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Ready to Test Your Knowledge?
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                                        This quiz contains {quizPackage.questions.length} questions and you'll have 2 hours to complete it. 
                                        Make sure you have a stable internet connection and won't be interrupted.
                                    </p>
                                    <button
                                        onClick={handleStartQuiz}
                                        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                    >
                                        🚀 Start Quiz
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="text-4xl mb-4">⚠️</div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Quiz Not Available
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        {!quizPackage.is_active 
                                            ? 'This quiz package is currently inactive.'
                                            : `This quiz package needs exactly 110 questions to be available. Currently has ${quizPackage.questions.length} questions.`
                                        }
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {canManage && (
                        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                🔧 Admin Actions
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={route('questions.index', quizPackage.id)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    📝 Manage Questions ({quizPackage.questions.length})
                                </Link>
                                <Link
                                    href={route('quiz-packages.edit', quizPackage.id)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    ✏️ Edit Package
                                </Link>
                                {quizPackage.questions.length < 110 && (
                                    <Link
                                        href={route('questions.create', quizPackage.id)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        ➕ Add Questions
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}