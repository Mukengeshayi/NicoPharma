<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFamillyRequest;
use App\Models\Family;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FamilyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Family::query();

        // Recherche
        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        // Tri
        $sort = $request->sort ?? ['field' => 'id', 'direction' => 'asc'];
        $query->orderBy($sort['field'], $sort['direction']);
        // Pagination
        $perPage = $request->perPage ?? 10;
        $families = $query->paginate($perPage);
         return Inertia::render('Family/FamilyPage',[
            'families' => $families,
            'filters' => $request->only(['search', 'sort', 'perPage'])
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
    public function store(StoreFamillyRequest $request)
    {
        $family = Family::create($request->all());
        return redirect()->route('families.index')->with([
            'success' => true,
            'message' => 'Familles Ajouté avec succes.' ,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Family $family)
    {

        return inertia('Family/ShowFamilyPage', [
            'family' => $family,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Family $family)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Family $family)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('forms')->ignore($family->id),
            ],
            'description' => 'nullable|string|max:1000',
        ]);

        $family->update($validated);

        return redirect()->back()->with('success', 'La forme a été mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Family $family)
    {
        $family->delete();
        return redirect()->route('families.index')->with('success', 'La famille a été suprimée avec succès.');
    }
}
