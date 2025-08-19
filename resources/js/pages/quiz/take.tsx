import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';

interface Question {
    id: number;
    question_text: string;
    options: string[];
}

interface QuizPackage {
    id: number;
    name: string;
    description: string;
}

interface QuizAttempt {
    id: number;
    started_at: string;
}

interface TakeQuizProps {
    quizPackage: QuizPackage;
    attempt: QuizAttempt;
    questions: Question[];
    currentAnswers: Record<number, string>;
    timeLimit: number;
    timeRemaining: number;
    [key: string]: unknown;
}

export default function TakeQuiz() {
    const { quizPackage, attempt, questions, currentAnswers, timeRemaining } = usePage<TakeQuizProps>().props;
    
    const [answers, setAnswers] = useState<Record<number, string>>(currentAnswers || {});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeRemaining);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (!isSubmitting) {
                        setIsSubmitting(true);
                        router.put(route('quiz-attempts.update', [quizPackage.id, attempt.id]), { answers });
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitting, answers, quizPackage.id, attempt.id]);

    // Format time display
    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };



    const handleSubmit = () => {
        if (isSubmitting) return;
        
        const unanswered = questions.filter(q => !answers[q.id]).length;
        if (unanswered > 0) {
            if (!confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
                return;
            }
        }
        
        setIsSubmitting(true);
        router.put(route('quiz-attempts.update', [quizPackage.id, attempt.id]), { answers });
    };

    const answeredCount = Object.keys(answers).length;
    const progressPercentage = (answeredCount / totalQuestions) * 100;

    return (
        <>
            <Head title={`Taking Quiz: ${quizPackage.name}`} />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header with Timer and Progress */}
                <div className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    📝 {quizPackage.name}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Question {currentQuestionIndex + 1} of {totalQuestions}
                                </p>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                                {/* Progress */}
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Progress: {answeredCount}/{totalQuestions}
                                    </div>
                                    <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full transition-all"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {/* Timer */}
                                <div className={`text-right ${timeLeft < 600 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                                    <div className="text-sm font-medium">Time Remaining</div>
                                    <div className="text-2xl font-bold font-mono">
                                        ⏰ {formatTime(timeLeft)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-sm p-8 dark:bg-gray-800">
                        {/* Question */}
                        <div className="mb-8">
                            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                                Question {currentQuestionIndex + 1}
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                {currentQuestion.question_text}
                            </p>
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-3 mb-8">
                            {currentQuestion.options.map((option, index) => (
                                <label 
                                    key={index}
                                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                        answers[currentQuestion.id] === option
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question_${currentQuestion.id}`}
                                        value={option}
                                        checked={answers[currentQuestion.id] === option}
                                        onChange={(e) => handleAnswerSelect(e.target.value)}
                                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                                    />
                                    <span className="ml-3 text-gray-900 dark:text-white flex-1">
                                        {String.fromCharCode(65 + index)}. {option}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Navigation and Submit */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                ← Previous
                            </button>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : '🏁 Submit Quiz'}
                                </button>

                                <button
                                    onClick={handleNext}
                                    disabled={currentQuestionIndex === totalQuestions - 1}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Question Overview */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Question Overview
                        </h3>
                        <div className="grid grid-cols-10 gap-2">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={`w-8 h-8 text-xs rounded-md border transition-all ${
                                        index === currentQuestionIndex
                                            ? 'border-indigo-500 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-400'
                                            : answers[questions[index].id]
                                            ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-green-100 border border-green-500 rounded dark:bg-green-900/20 dark:border-green-400"></div>
                                <span>Answered</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-indigo-100 border border-indigo-500 rounded dark:bg-indigo-900/20 dark:border-indigo-400"></div>
                                <span>Current</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-white border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"></div>
                                <span>Unanswered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}