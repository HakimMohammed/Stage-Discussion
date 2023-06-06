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
        Schema::create('message_classes', function (Blueprint $table) {
            $table->id();
            $table->text('contenu');
            $table->string('type')->default('text');
            $table->foreignId('tuteur_id')->default(0);
            $table->foreignId('professeur_id')->default(0);
            $table->foreignId('discussion_id')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_classes');
    }
};
