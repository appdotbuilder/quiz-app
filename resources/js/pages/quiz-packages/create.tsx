import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface QuizPackageFormData {
    name: string;
    description: string;
    is_active: boolean;
    [key: string]: string | boolean;
}

export default function CreateQuizPackage() {
    const { data, setData, post, processing, errors } = useForm<QuizPackageFormData>({
        name: '',
        description: '',
        is_active: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('quiz-packages.store'));
    };

    return (
        <AppShell>
            <Head title="Create Quiz Package" />
            
            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            ➕ Create New Quiz Package
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Create a new quiz package that will contain exactly 110 questions.
                        </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg dark:bg-gray-800">
                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            {/* Package Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Package Name *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="e.g., Advanced Mathematics Quiz"
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Describe what topics this quiz covers..."
                                    />
                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Optional: Provide a brief description of the quiz content.
                                </p>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="is_active"
                                        name="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="is_active" className="font-medium text-gray-700 dark:text-gray-300">
                                        Active Package
                                    </label>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        When active, users can see and take this quiz (once it has 110 questions).
                                    </p>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <span className="text-blue-400">ℹ️</span>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Important Information
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Each quiz package must contain exactly 110 questions</li>
                                                <li>Users will have 2 hours to complete the quiz</li>
                                                <li>Questions must be added after creating the package</li>
                                                <li>Only active packages with 110 questions can be taken by users</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating...' : 'Create Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}