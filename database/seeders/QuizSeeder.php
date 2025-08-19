<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\QuizPackage;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create an admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create some regular users
        $users = User::factory(10)->create();

        // Create quiz packages
        $mathPackage = QuizPackage::create([
            'name' => '🧮 Advanced Mathematics Quiz',
            'description' => 'Test your knowledge of advanced mathematical concepts including calculus, algebra, and statistics.',
            'is_active' => true,
        ]);

        $sciencePackage = QuizPackage::create([
            'name' => '🔬 Science Fundamentals Quiz',
            'description' => 'Explore the fundamentals of physics, chemistry, and biology in this comprehensive science quiz.',
            'is_active' => true,
        ]);

        $historyPackage = QuizPackage::create([
            'name' => '🏛️ World History Quiz',
            'description' => 'Journey through major historical events, civilizations, and influential figures from around the world.',
            'is_active' => false,
        ]);

        // Create 110 questions for the math package
        $this->createQuestionsForPackage($mathPackage, $this->getMathQuestions());

        // Create 110 questions for the science package
        $this->createQuestionsForPackage($sciencePackage, $this->getScienceQuestions());

        // Create some partial questions for history package (to show incomplete package)
        $this->createQuestionsForPackage($historyPackage, array_slice($this->getHistoryQuestions(), 0, 50));

        // Create some quiz attempts
        foreach ($users as $user) {
            // Some completed attempts
            if (random_int(1, 10) > 3) { // 70% chance
                QuizAttempt::create([
                    'user_id' => $user->id,
                    'quiz_package_id' => $mathPackage->id,
                    'answers' => $this->generateRandomAnswers($mathPackage->questions),
                    'score' => random_int(60, 110),
                    'total_questions' => 110,
                    'started_at' => now()->subDays(random_int(1, 30)),
                    'completed_at' => now()->subDays(random_int(0, 29)),
                    'time_taken_seconds' => random_int(3600, 7200),
                ]);
            }

            if (random_int(1, 10) > 5) { // 50% chance
                QuizAttempt::create([
                    'user_id' => $user->id,
                    'quiz_package_id' => $sciencePackage->id,
                    'answers' => $this->generateRandomAnswers($sciencePackage->questions),
                    'score' => random_int(50, 105),
                    'total_questions' => 110,
                    'started_at' => now()->subDays(random_int(1, 20)),
                    'completed_at' => now()->subDays(random_int(0, 19)),
                    'time_taken_seconds' => random_int(4000, 7200),
                ]);
            }
        }
    }

    protected function createQuestionsForPackage(QuizPackage $package, array $questions)
    {
        foreach ($questions as $index => $questionData) {
            Question::create([
                'quiz_package_id' => $package->id,
                'question_text' => $questionData['question'],
                'options' => $questionData['options'],
                'correct_answer' => $questionData['correct'],
                'explanation' => $questionData['explanation'] ?? null,
                'order_index' => $index + 1,
            ]);
        }
    }

    protected function generateRandomAnswers($questions)
    {
        $answers = [];
        foreach ($questions as $question) {
            $answers[$question->id] = $question->options[array_rand($question->options)];
        }
        return $answers;
    }

    protected function getMathQuestions(): array
    {
        return [
            [
                'question' => 'What is the derivative of x²?',
                'options' => ['2x', 'x', '2', 'x²'],
                'correct' => '2x',
                'explanation' => 'The derivative of x² is 2x using the power rule.'
            ],
            [
                'question' => 'What is the integral of 2x dx?',
                'options' => ['x²', 'x² + C', '2x²', '2x² + C'],
                'correct' => 'x² + C',
                'explanation' => 'The integral of 2x is x² + C, where C is the constant of integration.'
            ],
            [
                'question' => 'What is the value of sin(90°)?',
                'options' => ['0', '1', '-1', '0.5'],
                'correct' => '1',
                'explanation' => 'sin(90°) = 1 as 90° corresponds to π/2 radians.'
            ],
            [
                'question' => 'What is the quadratic formula?',
                'options' => ['x = -b ± √(b² - 4ac) / 2a', 'x = -b ± √(b² + 4ac) / 2a', 'x = b ± √(b² - 4ac) / 2a', 'x = -b ± √(b² - 4ac) / a'],
                'correct' => 'x = -b ± √(b² - 4ac) / 2a',
                'explanation' => 'The quadratic formula is used to solve equations of the form ax² + bx + c = 0.'
            ],
            [
                'question' => 'What is the value of log₁₀(100)?',
                'options' => ['1', '2', '10', '100'],
                'correct' => '2',
                'explanation' => 'log₁₀(100) = 2 because 10² = 100.'
            ],
            // Add more questions to reach 110
            ...array_fill(0, 105, [
                'question' => 'Sample math question ' . (random_int(1, 1000)),
                'options' => ['A', 'B', 'C', 'D'],
                'correct' => ['A', 'B', 'C', 'D'][random_int(0, 3)],
                'explanation' => 'This is a sample explanation for demonstration purposes.'
            ])
        ];
    }

    protected function getScienceQuestions(): array
    {
        return [
            [
                'question' => 'What is the chemical symbol for gold?',
                'options' => ['Go', 'Gd', 'Au', 'Ag'],
                'correct' => 'Au',
                'explanation' => 'Au comes from the Latin word "aurum" meaning gold.'
            ],
            [
                'question' => 'What is the speed of light in vacuum?',
                'options' => ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
                'correct' => '3 × 10⁸ m/s',
                'explanation' => 'The speed of light in vacuum is approximately 299,792,458 meters per second.'
            ],
            [
                'question' => 'How many chambers does a human heart have?',
                'options' => ['2', '3', '4', '5'],
                'correct' => '4',
                'explanation' => 'The human heart has 4 chambers: 2 atria and 2 ventricles.'
            ],
            [
                'question' => 'What is the most abundant gas in Earth\'s atmosphere?',
                'options' => ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
                'correct' => 'Nitrogen',
                'explanation' => 'Nitrogen makes up about 78% of Earth\'s atmosphere.'
            ],
            [
                'question' => 'What is the powerhouse of the cell?',
                'options' => ['Nucleus', 'Mitochondria', 'Ribosome', 'Cytoplasm'],
                'correct' => 'Mitochondria',
                'explanation' => 'Mitochondria produce ATP, the energy currency of the cell.'
            ],
            // Add more questions to reach 110
            ...array_fill(0, 105, [
                'question' => 'Sample science question ' . (random_int(1, 1000)),
                'options' => ['A', 'B', 'C', 'D'],
                'correct' => ['A', 'B', 'C', 'D'][random_int(0, 3)],
                'explanation' => 'This is a sample explanation for demonstration purposes.'
            ])
        ];
    }

    protected function getHistoryQuestions(): array
    {
        return [
            [
                'question' => 'In which year did World War II end?',
                'options' => ['1944', '1945', '1946', '1947'],
                'correct' => '1945',
                'explanation' => 'World War II ended in 1945 with the surrender of Japan on September 2, 1945.'
            ],
            [
                'question' => 'Who was the first President of the United States?',
                'options' => ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'],
                'correct' => 'George Washington',
                'explanation' => 'George Washington served as the first President from 1789 to 1797.'
            ],
            [
                'question' => 'The Great Wall of China was primarily built to protect against which group?',
                'options' => ['Mongols', 'Japanese', 'Koreans', 'Vietnamese'],
                'correct' => 'Mongols',
                'explanation' => 'The Great Wall was built to protect against invasions from northern nomadic groups, particularly the Mongols.'
            ],
            // Add more questions
            ...array_fill(0, 107, [
                'question' => 'Sample history question ' . (random_int(1, 1000)),
                'options' => ['A', 'B', 'C', 'D'],
                'correct' => ['A', 'B', 'C', 'D'][random_int(0, 3)],
                'explanation' => 'This is a sample explanation for demonstration purposes.'
            ])
        ];
    }
}