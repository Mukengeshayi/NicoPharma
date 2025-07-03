<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\Medicine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $sort = $request->input('sort', ['field' => 'name', 'direction' => 'asc']);

        $families = Family::when($request->input('search'), function($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($sort, function($query, $sort) {
                if (isset($sort['field']) && isset($sort['direction'])) {
                    $query->orderBy($sort['field'], $sort['direction']);
                }
            })
            ->paginate($perPage);
        return Inertia::render('Medicines/MedicinePage',[
            'families' => $families,
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
        $medecine = Medicine::create([
                'name' =>$request->name,
                'family_id' => $request->family_id,
            ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Medicine $medicine)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Medicine $medicine)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Medicine $medicine)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Medicine $medicine)
    {
        //
    }
}
