import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="QuizMaster - Test Your Knowledge">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
                {/* Header */}
                <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                    <div className="container mx-auto px-6 py-4">
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">🧠</div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">QuizMaster</h1>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Welcome, {auth.user.name}!
                                        </span>
                                        <Link
                                            href={route('dashboard')}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg font-medium transition-colors dark:text-gray-300 dark:hover:text-indigo-400"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="container mx-auto px-6 py-16">
                    <div className="text-center mb-16">
                        <div className="mb-6">
                            <span className="text-6xl mb-4 block">🎯</span>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6 dark:text-white">
                            Master Your Knowledge with
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> QuizMaster</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                            Challenge yourself with comprehensive quiz packages. Each package contains exactly 110 carefully crafted questions 
                            designed to test your expertise across various subjects.
                        </p>

                        {!auth.user && (
                            <div className="flex justify-center space-x-4">
                                <Link
                                    href={route('register')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-lg"
                                >
                                    Start Quiz Journey 🚀
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20">
                            <div className="text-4xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">Comprehensive Quiz Packages</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Each quiz package contains exactly 110 questions covering various topics in depth. Perfect for thorough knowledge assessment.
                            </p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20">
                            <div className="text-4xl mb-4">⏱️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">Timed Challenges</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                2-hour time limit adds excitement and tests your knowledge under pressure. Track your progress and improve over time.
                            </p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">Instant Results</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Get immediate feedback with detailed explanations. Review correct and incorrect answers to learn and improve.
                            </p>
                        </div>
                    </div>

                    {/* How it Works */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 dark:text-white">
                            How QuizMaster Works
                        </h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl mb-4">1️⃣</div>
                                <h4 className="font-semibold text-gray-900 mb-2 dark:text-white">Choose Package</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Select from available quiz packages covering different subjects</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-4">2️⃣</div>
                                <h4 className="font-semibold text-gray-900 mb-2 dark:text-white">Take Quiz</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Answer 110 questions within the 2-hour time limit</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-4">3️⃣</div>
                                <h4 className="font-semibold text-gray-900 mb-2 dark:text-white">Get Results</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Instantly see your score and detailed breakdown</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-4">4️⃣</div>
                                <h4 className="font-semibold text-gray-900 mb-2 dark:text-white">Improve</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Learn from explanations and track your progress</p>
                            </div>
                        </div>
                    </div>

                    {/* Sample Subjects */}
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 dark:text-white">
                            Available Quiz Categories
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { icon: '🧮', name: 'Mathematics', desc: 'Algebra, Calculus, Statistics' },
                                { icon: '🔬', name: 'Science', desc: 'Physics, Chemistry, Biology' },
                                { icon: '🏛️', name: 'History', desc: 'World History, Civilizations' },
                                { icon: '💼', name: 'Business', desc: 'Management, Marketing, Finance' },
                                { icon: '💻', name: 'Technology', desc: 'Programming, IT, Digital Skills' },
                                { icon: '🌍', name: 'Geography', desc: 'Countries, Capitals, Landmarks' },
                                { icon: '🎨', name: 'Arts', desc: 'Literature, Music, Visual Arts' },
                                { icon: '⚖️', name: 'Law', desc: 'Legal Principles, Case Studies' }
                            ].map((category, index) => (
                                <div key={index} className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/20 text-center hover:bg-white/60 transition-all dark:bg-gray-800/40 dark:border-gray-700/20 dark:hover:bg-gray-800/60">
                                    <div className="text-2xl mb-2">{category.icon}</div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{category.name}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">{category.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Call to Action */}
                    {!auth.user && (
                        <div className="text-center mt-16">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl text-white">
                                <h2 className="text-3xl font-bold mb-4">Ready to Test Your Knowledge? 🎓</h2>
                                <p className="text-xl mb-6 opacity-90">
                                    Join thousands of learners who are already improving their skills with QuizMaster
                                </p>
                                <Link
                                    href={route('register')}
                                    className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all inline-block"
                                >
                                    Create Free Account ✨
                                </Link>
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="text-center py-8 border-t border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-gray-600 dark:text-gray-400">
                        Built with ❤️ using Laravel & React • QuizMaster © 2024
                    </p>
                </footer>
            </div>
        </>
    );
}