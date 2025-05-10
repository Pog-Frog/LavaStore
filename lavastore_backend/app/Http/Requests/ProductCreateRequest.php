<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductCreateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'original_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99', 'gt:price'],
            'image_url' => ['required', 'string', 'url', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'is_featured' => ['boolean'],
            'badge' => ['nullable', 'string', 'max:50', 'in:NEW,POPULAR,BEST SELLER'],
            'dietary_preferences' => ['array'],
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
            'name.required' => 'The product name is required.',
            'description.required' => 'The product description is required.',
            'price.required' => 'The product price is required.',
            'price.min' => 'The product price must be at least 0.',
            'price.max' => 'The product price cannot exceed 999,999.99.',
            'original_price.gt' => 'The original price must be greater than the current price.',
            'image_url.required' => 'The product image URL is required.',
            'image_url.url' => 'The product image must be a valid URL.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'The selected category is invalid.',
            'badge.in' => 'The badge must be one of: NEW, POPULAR, BEST SELLER.',
            'dietary_preferences.*.exists' => 'One or more selected dietary preferences are invalid.'
        ];
    }
} 