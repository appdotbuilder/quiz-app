<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('quiz_package_id')->constrained()->onDelete('cascade');
            $table->json('answers')->comment('User answers for the quiz');
            $table->integer('score')->comment('Final score out of total questions');
            $table->integer('total_questions')->comment('Total number of questions in the quiz');
            $table->timestamp('started_at')->comment('When the quiz was started');
            $table->timestamp('completed_at')->nullable()->comment('When the quiz was completed');
            $table->integer('time_taken_seconds')->nullable()->comment('Total time taken in seconds');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('quiz_package_id');
            $table->index(['user_id', 'completed_at']);
            $table->index(['quiz_package_id', 'score']);
            $table->index('started_at');
            $table->index('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};