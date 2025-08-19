import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface DashboardProps {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export default function Dashboard() {
    const { auth } = usePage<DashboardProps>().props;
    const user = auth.user;

    return (
        <AppShell>
            <Head title="Dashboard" />
            
            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Welcome back, {user.name}! 👋
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            {user.role === 'admin' ? 'Manage your quiz platform' : 'Continue your learning journey'}
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                        <Link
                            href={route('quiz-packages.index')}
                            className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-indigo-500 hover:shadow-md transition-all dark:border-gray-600 dark:bg-gray-800 dark:hover:border-indigo-400"
                        >
                            <div className="flex items-center">
                                <div className="text-3xl mr-4">📚</div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                        Quiz Packages
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Browse available quizzes
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {user.role === 'admin' && (
                            <>
                                <Link
                                    href={route('admin.dashboard')}
                                    className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-indigo-500 hover:shadow-md transition-all dark:border-gray-600 dark:bg-gray-800 dark:hover:border-indigo-400"
                                >
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-4">⚡</div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                Admin Panel
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Platform analytics & stats
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    href={route('quiz-packages.create')}
                                    className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-indigo-500 hover:shadow-md transition-all dark:border-gray-600 dark:bg-gray-800 dark:hover:border-indigo-400"
                                >
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-4">➕</div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                Create Package
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Add new quiz package
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    href={route('admin.users')}
                                    className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-indigo-500 hover:shadow-md transition-all dark:border-gray-600 dark:bg-gray-800 dark:hover:border-indigo-400"
                                >
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-4">👥</div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                Manage Users
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                View user activity
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Recent Activity or Stats */}
                    <div className="bg-white rounded-lg shadow dark:bg-gray-800">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                {user.role === 'admin' ? 'Platform Overview' : 'Your Activity'}
                            </h2>
                        </div>
                        <div className="p-6">
                            {user.role === 'admin' ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                                        <div className="text-2xl text-blue-600 dark:text-blue-400 mb-2">📊</div>
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin</div>
                                        <div className="text-sm text-blue-600/80 dark:text-blue-400/80">Platform Manager</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                                        <div className="text-2xl text-green-600 dark:text-green-400 mb-2">🎯</div>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">Manage</div>
                                        <div className="text-sm text-green-600/80 dark:text-green-400/80">Quiz Packages</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                                        <div className="text-2xl text-purple-600 dark:text-purple-400 mb-2">👤</div>
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Monitor</div>
                                        <div className="text-sm text-purple-600/80 dark:text-purple-400/80">User Progress</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🎯</div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Ready to Start Learning?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        Explore our quiz packages and test your knowledge across various subjects.
                                    </p>
                                    <Link
                                        href={route('quiz-packages.index')}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                    >
                                        Browse Quiz Packages 🚀
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}