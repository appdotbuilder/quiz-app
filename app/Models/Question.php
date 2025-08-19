<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Question
 *
 * @property int $id
 * @property int $quiz_package_id
 * @property string $question_text
 * @property array $options
 * @property string $correct_answer
 * @property string|null $explanation
 * @property int $order_index
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\QuizPackage $quizPackage
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Question newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Question newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Question query()
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereCorrectAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereExplanation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereOptions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereOrderIndex($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereQuestionText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereQuizPackageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereUpdatedAt($value)
 * @method static \Database\Factories\QuestionFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Question extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'quiz_package_id',
        'question_text',
        'options',
        'correct_answer',
        'explanation',
        'order_index',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'options' => 'array',
        'order_index' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the quiz package that owns the question.
     */
    public function quizPackage(): BelongsTo
    {
        return $this->belongsTo(QuizPackage::class);
    }

    /**
     * Check if the given answer is correct.
     */
    public function isCorrectAnswer(string $answer): bool
    {
        return $this->correct_answer === $answer;
    }
}