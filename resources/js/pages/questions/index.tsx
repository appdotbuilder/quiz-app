import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Question {
    id: number;
    question_text: string;
    options: string[];
    correct_answer: string;
    explanation: string | null;
    order_index: number;
    created_at: string;
}

interface QuizPackage {
    id: number;
    name: string;
    description: string;
    questions_count: number;
}

interface PaginatedQuestions {
    data: Question[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    meta: {
        current_page: number;
        total: number;
        per_page: number;
    };
}

interface QuestionsIndexProps {
    quizPackage: QuizPackage;
    questions: PaginatedQuestions;
    [key: string]: unknown;
}

export default function QuestionsIndex() {
    const { quizPackage, questions } = usePage<QuestionsIndexProps>().props;

    const canAddMore = quizPackage.questions_count < 110;

    return (
        <AppShell>
            <Head title={`Questions - ${quizPackage.name}`} />
            
            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('quiz-packages.show', quizPackage.id)}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4"
                        >
                            ← Back to {quizPackage.name}
                        </Link>
                        
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    📝 Questions Management
                                </h1>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                    {quizPackage.name} • {quizPackage.questions_count}/110 questions
                                </p>
                                {!canAddMore && (
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            ✅ Complete (110/110)
                                        </span>
                                    </div>
                                )}
                            </div>
                            {canAddMore && (
                                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                                    <Link
                                        href={route('questions.create', quizPackage.id)}
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                                    >
                                        ➕ Add Question
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                            <div 
                                className={`h-3 rounded-full transition-all ${
                                    quizPackage.questions_count === 110 ? 'bg-green-600' : 'bg-indigo-600'
                                }`}
                                style={{ width: `${Math.min((quizPackage.questions_count / 110) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {quizPackage.questions_count} of 110 questions created 
                            ({((quizPackage.questions_count / 110) * 100).toFixed(1)}%)
                        </p>
                    </div>

                    {/* Questions List */}
                    <div className="bg-white shadow-sm rounded-lg dark:bg-gray-800">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Questions List
                            </h3>
                        </div>

                        {questions.data.length > 0 ? (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {questions.data.map((question) => (
                                    <div key={question.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-3">
                                                        #{question.order_index}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                        {question.options.length} options
                                                    </span>
                                                </div>
                                                
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                    {question.question_text.length > 100 
                                                        ? `${question.question_text.substring(0, 100)}...` 
                                                        : question.question_text
                                                    }
                                                </h4>
                                                
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Correct Answer: <span className="font-medium">{question.correct_answer}</span>
                                                    {question.explanation && ' • Has explanation'}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 ml-4">
                                                <Link
                                                    href={route('questions.show', [quizPackage.id, question.id])}
                                                    className="text-indigo-600 hover:text-indigo-500 text-sm font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    View
                                                </Link>
                                                <span className="text-gray-300 dark:text-gray-600">•</span>
                                                <Link
                                                    href={route('questions.edit', [quizPackage.id, question.id])}
                                                    className="text-gray-600 hover:text-gray-900 text-sm font-medium dark:text-gray-400 dark:hover:text-white"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">📝</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No Questions Yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Start by creating the first question for this quiz package.
                                </p>
                                <Link
                                    href={route('questions.create', quizPackage.id)}
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                                >
                                    ➕ Create First Question
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {questions.data.length > 0 && questions.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <nav className="flex items-center justify-center">
                                    <div className="flex space-x-2">
                                        {questions.links.map((link, index) => (
                                            <div key={index}>
                                                {link.url ? (
                                                    <Link
                                                        href={link.url}
                                                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                            link.active
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'bg-white text-gray-500 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        className="px-3 py-2 text-sm font-medium text-gray-400 dark:text-gray-600"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-gray-50 rounded-lg p-6 dark:bg-gray-800/50">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={route('quiz-packages.show', quizPackage.id)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                👁️ Preview Package
                            </Link>
                            <Link
                                href={route('quiz-packages.edit', quizPackage.id)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                ✏️ Edit Package
                            </Link>
                            {canAddMore && (
                                <Link
                                    href={route('questions.create', quizPackage.id)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    ➕ Add Question ({110 - quizPackage.questions_count} remaining)
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}