import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface QuizPackage {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    questions_count: number;
    quiz_attempts_count: number;
    created_at: string;
}

interface PaginatedQuizPackages {
    data: QuizPackage[];
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

interface QuizPackagesIndexProps {
    quizPackages: PaginatedQuizPackages;
    canManage: boolean;
    [key: string]: unknown;
}

export default function QuizPackagesIndex() {
    const { quizPackages, canManage } = usePage<QuizPackagesIndexProps>().props;

    const getStatusBadge = (quizPackage: QuizPackage) => {
        if (!quizPackage.is_active) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Inactive
                </span>
            );
        }
        
        if (quizPackage.questions_count < 110) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Incomplete ({quizPackage.questions_count}/110)
                </span>
            );
        }
        
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Ready (110/110) ✓
            </span>
        );
    };

    return (
        <AppShell>
            <Head title="Quiz Packages" />
            
            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                📚 Quiz Packages
                            </h1>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                {canManage 
                                    ? 'Manage quiz packages and their questions'
                                    : 'Choose a quiz package to test your knowledge'
                                }
                            </p>
                        </div>
                        {canManage && (
                            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                                <Link
                                    href={route('quiz-packages.create')}
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto transition-colors"
                                >
                                    ➕ Add Package
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quiz Packages Grid */}
                    <div className="mt-8 grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        {quizPackages.data.map((quizPackage) => (
                            <div
                                key={quizPackage.id}
                                className="relative group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all dark:bg-gray-800 dark:border-gray-700"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                {quizPackage.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                                                {quizPackage.description || 'No description available.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mb-4">
                                        {getStatusBadge(quizPackage)}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <span>📊 {quizPackage.quiz_attempts_count} attempts</span>
                                        <span>📝 {quizPackage.questions_count} questions</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={route('quiz-packages.show', quizPackage.id)}
                                            className="text-indigo-600 hover:text-indigo-500 font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            View Details →
                                        </Link>

                                        {canManage && (
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('questions.index', quizPackage.id)}
                                                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                                                >
                                                    Manage Questions
                                                </Link>
                                                <Link
                                                    href={route('quiz-packages.edit', quizPackage.id)}
                                                    className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-md transition-colors dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 dark:text-indigo-400"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Take Quiz Button for Regular Users */}
                                    {!canManage && quizPackage.is_active && quizPackage.questions_count === 110 && (
                                        <div className="mt-4">
                                            <Link
                                                href={route('quiz-packages.show', quizPackage.id)}
                                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                                            >
                                                🎯 Take Quiz
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {quizPackages.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No Quiz Packages Yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {canManage 
                                    ? 'Get started by creating your first quiz package.'
                                    : 'Quiz packages will appear here once they\'re available.'
                                }
                            </p>
                            {canManage && (
                                <Link
                                    href={route('quiz-packages.create')}
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                                >
                                    ➕ Create First Package
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {quizPackages.data.length > 0 && quizPackages.links.length > 3 && (
                        <div className="mt-8">
                            <nav className="flex items-center justify-center">
                                <div className="flex space-x-2">
                                    {quizPackages.links.map((link, index) => (
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
            </div>
        </AppShell>
    );
}