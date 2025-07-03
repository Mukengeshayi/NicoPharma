<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFormRequest;
use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $query = Form::query();

        // Recherche
        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        // Tri
        $sort = $request->sort ?? ['field' => 'id', 'direction' => 'asc'];
        $query->orderBy($sort['field'], $sort['direction']);
        // Pagination
        $perPage = $request->perPage ?? 10;
        $forms = $query->paginate($perPage);

        return Inertia::render('Form/FormPage',[
            'forms' => $forms,
            'filters' => $request->only(['search', 'sort', 'perPage']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFormRequest $request)
    {
        $form = Form::create($request->all());
        return redirect()->route('forms.index')->with([
            'success' => true,
            'message' => 'Forme jouté avec succes.' ,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Form $form)
    {
        return inertia('Form/ShowFormPage', [
        'form' => $form,
    ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Form $form)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Form $form)
    {
        $validated = $request->validate([
            'name' => ['required','string','max:255',Rule::unique('forms')->ignore($form->id),
            ],
        ]);
        $form->update($validated);

        return redirect()->route('forms.index')->with('success', 'La forme a été mise à jour avec succès.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Form $form)
    {
        $form->delete();

        return redirect()->route('forms.index')
            ->with('success', 'La forme a été suprimée avec succès.');
    }
}
