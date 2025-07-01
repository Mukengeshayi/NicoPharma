<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFormRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:forms,name,' . $this->route('form'),
        ];
    }
    public function messages()
    {
        return [
            'name.required' => 'Le nom de la forme est obligatoire.',
            'name.string' => 'Le nom de la forme doit être une chaîne de caractères.',
            'name.max' => 'Le nom de la forme ne peut pas dépasser 255 caractères.',
            'name.unique' => 'Ce nom de forme existe déjà. Veuillez saisir un autre.',
        ];
    }
}
