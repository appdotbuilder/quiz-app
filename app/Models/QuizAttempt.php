<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\QuizAttempt
 *
 * @property int $id
 * @property int $user_id
 * @property int $quiz_package_id
 * @property array $answers
 * @property int $score
 * @property int $total_questions
 * @property \Illuminate\Support\Carbon $started_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property int|null $time_taken_seconds
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\QuizPackage $quizPackage
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt query()
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereAnswers($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereQuizPackageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereTimeTakenSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereTotalQuestions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizAttempt completed()
 * @method static \Database\Factories\QuizAttemptFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class QuizAttempt extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'quiz_package_id',
        'answers',
        'score',
        'total_questions',
        'started_at',
        'completed_at',
        'time_taken_seconds',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'answers' => 'array',
        'score' => 'integer',
        'total_questions' => 'integer',
        'time_taken_seconds' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the quiz attempt.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the quiz package that owns the quiz attempt.
     */
    public function quizPackage(): BelongsTo
    {
        return $this->belongsTo(QuizPackage::class);
    }

    /**
     * Scope a query to only include completed quiz attempts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->whereNotNull('completed_at');
    }

    /**
     * Calculate the percentage score.
     */
    public function getPercentageScore(): float
    {
        return $this->total_questions > 0 ? ($this->score / $this->total_questions) * 100 : 0;
    }

    /**
     * Get the formatted time taken.
     */
    public function getFormattedTimeTaken(): string
    {
        if (!$this->time_taken_seconds) {
            return 'N/A';
        }

        $hours = intval($this->time_taken_seconds / 3600);
        $minutes = intval(($this->time_taken_seconds % 3600) / 60);
        $seconds = $this->time_taken_seconds % 60;

        if ($hours > 0) {
            return sprintf('%d:%02d:%02d', $hours, $minutes, $seconds);
        }

        return sprintf('%d:%02d', $minutes, $seconds);
    }

    /**
     * Check if the quiz attempt is completed.
     */
    public function isCompleted(): bool
    {
        return !is_null($this->completed_at);
    }
}