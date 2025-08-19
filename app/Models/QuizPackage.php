<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\QuizPackage
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\QuizAttempt> $quizAttempts
 * @property-read int|null $quiz_attempts_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage query()
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizPackage active()
 * @method static \Database\Factories\QuizPackageFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class QuizPackage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the questions for the quiz package.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('order_index');
    }

    /**
     * Get the quiz attempts for the quiz package.
     */
    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Scope a query to only include active quiz packages.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Check if the quiz package has exactly 110 questions.
     */
    public function hasRequiredQuestions(): bool
    {
        return $this->questions()->count() === 110;
    }

    /**
     * Get the completion rate for this quiz package.
     */
    public function getCompletionRate(): float
    {
        $totalAttempts = $this->quizAttempts()->count();
        $completedAttempts = $this->quizAttempts()->whereNotNull('completed_at')->count();
        
        return $totalAttempts > 0 ? ($completedAttempts / $totalAttempts) * 100 : 0;
    }
}