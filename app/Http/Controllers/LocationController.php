<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLocationRequest;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Location::query();

        // Search
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('code', 'like', '%'.$request->search.'%');
            });
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        // Sort
        $sort = $request->sort ?? ['field' => 'id', 'direction' => 'asc'];
        $query->orderBy($sort['field'], $sort['direction']);

        // Pagination
        $perPage = $request->perPage ?? 10;
        $locations = $query->paginate($perPage);

        return Inertia::render('Locations/LocationPage', [
            'locations' => $locations,
            'filters' => $request->only(['search', 'sort', 'perPage', 'is_active']),
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
    public function store(StoreLocationRequest $request)
    {
        Location::create($request->validated());

        return redirect()->route('locations.index')->with([
            'success' => true,
            'message' => 'Emplacement ajouté avec succès.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        return inertia('Locations/ShowLocationPage', [
            'location' => $location,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $location)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('locations')->ignore($location->id)],
            'code' => ['required', 'string', 'max:50', Rule::unique('locations')->ignore($location->id)],
            'description' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
        ]);

        $location->update($validated);

        return redirect()->route('locations.index')->with('success', 'La location a été mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        //
    }
}
