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
        Schema::create('quiz_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Name of the quiz package');
            $table->text('description')->nullable()->comment('Description of the quiz package');
            $table->boolean('is_active')->default(true)->comment('Whether the quiz package is active');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('name');
            $table->index('is_active');
            $table->index(['is_active', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_packages');
    }
};