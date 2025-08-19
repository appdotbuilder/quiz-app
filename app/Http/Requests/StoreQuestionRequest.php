<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user() && auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'question_text' => 'required|string',
            'options' => 'required|array|min:2|max:6',
            'options.*' => 'required|string|max:255',
            'correct_answer' => 'required|string|in_array:options.*',
            'explanation' => 'nullable|string',
            'order_index' => 'required|integer|min:1',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'question_text.required' => 'Question text is required.',
            'options.required' => 'Question options are required.',
            'options.min' => 'At least 2 options are required.',
            'options.max' => 'Maximum 6 options are allowed.',
            'options.*.required' => 'All option fields must be filled.',
            'correct_answer.required' => 'Correct answer must be selected.',
            'correct_answer.in_array' => 'Correct answer must be one of the provided options.',
            'order_index.required' => 'Order index is required.',
            'order_index.min' => 'Order index must be at least 1.',
        ];
    }
}