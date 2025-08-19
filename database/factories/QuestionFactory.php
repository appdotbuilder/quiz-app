<?php

namespace Database\Factories;

use App\Models\QuizPackage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $options = [
            fake()->sentence(3),
            fake()->sentence(3),
            fake()->sentence(3),
            fake()->sentence(3),
        ];

        return [
            'quiz_package_id' => QuizPackage::factory(),
            'question_text' => fake()->sentence() . '?',
            'options' => $options,
            'correct_answer' => fake()->randomElement($options),
            'explanation' => fake()->paragraph(),
            'order_index' => fake()->numberBetween(1, 110),
        ];
    }
}