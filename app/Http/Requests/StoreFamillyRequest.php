<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFamillyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:families,name,' . $this->route('family'),
            'description' => 'nullable|string|max:500',
        ];
    }
    public function messages()
    {
        return [
            'name.required' => 'Le nom de la famille est obligatoire..',
            'name.string' => 'Le nom de la famille doit être une chaîne de caractères.',
            'name.max' => 'Le nom de la famille ne peut pas dépasser 255 caractères.',
            'name.unique' => 'Ce nom de famille existe déjà. Veuillez saisir un autre.',
            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.max' => 'La description ne peut pas dépasser 500 caractères.',
        ];
    }
}
