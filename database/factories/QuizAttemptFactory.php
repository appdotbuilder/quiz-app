<?php

namespace Database\Factories;

use App\Models\QuizPackage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizAttempt>
 */
class QuizAttemptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalQuestions = 110;
        $score = fake()->numberBetween(0, $totalQuestions);
        $startedAt = fake()->dateTimeBetween('-1 month', 'now');
        $completed = fake()->boolean(80); // 80% chance of being completed

        return [
            'user_id' => User::factory(),
            'quiz_package_id' => QuizPackage::factory(),
            'answers' => [],
            'score' => $score,
            'total_questions' => $totalQuestions,
            'started_at' => $startedAt,
            'completed_at' => $completed ? fake()->dateTimeBetween($startedAt, 'now') : null,
            'time_taken_seconds' => $completed ? fake()->numberBetween(1800, 7200) : null, // 30 minutes to 2 hours
        ];
    }

    /**
     * Indicate that the quiz attempt is completed.
     */
    public function completed(): static
    {
        return $this->state(function (array $attributes) {
            $startedAt = $attributes['started_at'];
            return [
                'completed_at' => fake()->dateTimeBetween($startedAt, 'now'),
                'time_taken_seconds' => fake()->numberBetween(1800, 7200),
            ];
        });
    }

    /**
     * Indicate that the quiz attempt is incomplete.
     */
    public function incomplete(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_at' => null,
            'time_taken_seconds' => null,
        ]);
    }
}