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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_package_id')->constrained()->onDelete('cascade');
            $table->text('question_text')->comment('The question text');
            $table->json('options')->comment('Multiple choice options');
            $table->string('correct_answer')->comment('The correct answer');
            $table->text('explanation')->nullable()->comment('Explanation for the correct answer');
            $table->integer('order_index')->default(0)->comment('Order of the question in the package');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('quiz_package_id');
            $table->index(['quiz_package_id', 'order_index']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};