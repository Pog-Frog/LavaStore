<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0', 'max:999999.99'],
            'original_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'image_url' => ['sometimes', 'string', 'url', 'max:255'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'is_featured' => ['sometimes', 'boolean'],
            'badge' => ['nullable', 'string', 'max:50', 'in:NEW,POPULAR,BEST SELLER'],
            'dietary_preferences' => ['sometimes', 'array'],
            'dietary_preferences.*' => ['exists:dietary_preferences,id']
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.string' => 'The product name must be a string.',
            'name.max' => 'The product name cannot exceed 255 characters.',
            'description.string' => 'The product description must be a string.',
            'price.numeric' => 'The product price must be a number.',
            'price.min' => 'The product price must be at least 0.',
            'price.max' => 'The product price cannot exceed 999,999.99.',
            'original_price.numeric' => 'The original price must be a number.',
            'original_price.min' => 'The original price must be at least 0.',
            'original_price.max' => 'The original price cannot exceed 999,999.99.',
            'image_url.string' => 'The product image URL must be a string.',
            'image_url.url' => 'The product image must be a valid URL.',
            'image_url.max' => 'The product image URL cannot exceed 255 characters.',
            'category_id.exists' => 'The selected category is invalid.',
            'is_featured.boolean' => 'The featured status must be true or false.',
            'badge.in' => 'The badge must be one of: NEW, POPULAR, BEST SELLER.',
            'dietary_preferences.array' => 'The dietary preferences must be an array.',
            'dietary_preferences.*.exists' => 'One or more selected dietary preferences are invalid.'
        ];
    }
} 