<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $query = Unit::query();

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('abbreviation', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Tri
        $sort = $request->sort ?? ['field' => 'name', 'direction' => 'asc'];
        $query->orderBy($sort['field'], $sort['direction']);

        // Pagination
        $perPage = $request->perPage ?? 25;
        $units = $query->paginate($perPage);

        return Inertia::render('Units/UnitPage', [
            'units' => $units,
            'filters' => $request->only(['search', 'sort', 'perPage']),
            'unitTypes' => ['primary', 'measure', 'container'],
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:units,name',
            'abbreviation' => 'nullable|string|max:10',
            'type' => 'required|in:primary,measure,container',
            'description' => 'nullable|string',
        ]);

        try {
            Unit::create($validated);
            return redirect()->route('units.index')->with('success', 'Unité créée avec succès');
        } catch (\Exception $e) {
            return back()->withInput()->withErrors(['database' => 'Erreur lors de la création: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unit $unit)
    {
         $validated = $request->validate([
            'name' => 'required|string|max:100|unique:units,name,' . $unit->id,
            'abbreviation' => 'nullable|string|max:10',
            'type' => 'required|in:primary,measure,container',
            'description' => 'nullable|string',
        ]);

        try {
            $unit->update($validated);
            return redirect()
                ->route('units.index')
                ->with('success', 'Unité mise à jour avec succès');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['database' => 'Erreur lors de la mise à jour']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        Validator::make(['id' => $unit->id], [
            'id' => 'required|exists:units,id',
        ])->validate();

        try {
            $unit->delete();
            return redirect()->route('units.index')->with('success', 'Unité supprimée avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['database' => 'Erreur lors de la suppression']);
        }
    }
    public function massDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:units,id',
        ]);

        Unit::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Unités supprimées avec succès');
    }
}
