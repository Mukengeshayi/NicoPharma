<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\Medicine;
use App\Models\MedicineForm;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $query = MedicineForm::with([
            'medicine',
            'form',
            'packagingUnit',
            'contentUnit'
        ]);
        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('medicine', function($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            })->orWhereHas('form', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }
        // Tri
        $sort = $request->sort ?? ['field' => 'medicine.code', 'direction' => 'asc'];

        // Gérer les tris sur les relations
        if ($sort['field'] === 'medicine.code' || $sort['field'] === 'medicine.name') {
            $query->join('medicines', 'medicine_forms.medicine_id', '=', 'medicines.id')
                 ->orderBy('medicines.' . str_replace('medicine.', '', $sort['field']), $sort['direction']);
        } elseif ($sort['field'] === 'form.name') {
            $query->join('forms', 'medicine_forms.form_id', '=', 'forms.id')
                 ->orderBy('forms.name', $sort['direction']);
        } else {
            $query->orderBy($sort['field'], $sort['direction']);
        }
        // Pagination
        $perPage = $request->perPage ?? 25;
        $medicineForms = $query->paginate($perPage);

        return Inertia::render('Packagings/PackagingPage',[
            'medicineForms' => $medicineForms,
            'filters' => $request->only(['search', 'sort', 'perPage']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Packagings/CreatePackaging', [
            'medicines' => Medicine::orderBy('name')->get(['id', 'name', 'code']),
            'forms' => Form::orderBy('name')->get(['id', 'name']),
            'packagingUnits' => Unit::containerUnits()->get(['id', 'name', 'abbreviation']),
            'contentUnits' => Unit::measureUnits()->get(['id', 'name', 'abbreviation']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medicine_id' => 'required|exists:medicines,id',
            'form_id' => 'required|exists:forms,id',
            'packaging_unit_id' => 'required|exists:units,id',
            'content_unit_id' => 'required|exists:units,id',
            'content_quantity' => 'required|numeric|min:0.01',
            'price' => 'required|numeric|min:0.01',
        ]);

        try {
            MedicineForm::create($validated);
            return redirect()->route('medicine-forms.index')->with('success', 'Conditionnement créé avec succès');
        } catch (\Exception $e) {
            return back()->withInput()->withErrors(['database' => 'Erreur lors de la création: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MedicineForm $medicineForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MedicineForm $medicineForm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MedicineForm $medicineForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MedicineForm $medicineForm)
    {
        //
    }


}
