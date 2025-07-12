<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\Form;
use App\Models\Medicine;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MedicineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $query = Medicine::with('family')
            ->select(['medicines.*', 'families.name as family_name'])
            ->leftJoin('families', 'medicines.family_id', '=', 'families.id');

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('medicines.code', 'like', "%{$search}%")
                  ->orWhere('medicines.name', 'like', "%{$search}%")
                  ->orWhere('families.name', 'like', "%{$search}%");
            });
        }
        // Tri
        $sort = $request->sort ?? ['field' => 'medicines.code', 'direction' => 'asc'];
        $query->orderBy($sort['field'], $sort['direction']);

        // Pagination
        $perPage = $request->perPage ?? 25;
        $medicines = $query->paginate($perPage);

        return Inertia::render('Medicines/MedicinePage',[
            'medicines' => $medicines,
            'filters' => $request->only(['search', 'sort', 'perPage']),
            'families' => Family::orderBy('name')->get(['id', 'name']),

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
            'name' => 'required|string|max:100',
            'family_id' => 'nullable|exists:families,id',
            'indications' => 'nullable|string',
        ], [
            'family_id.exists' => 'La famille sélectionnée est invalide',
        ]);

        try {
            $code = $this->generateMedicineCode($request->name);

            Medicine::create(array_merge($validated, [
                'code' => $code
            ]));
            return redirect()->route('medicines.index')->with('success', 'Médicament créé avec succès');
        } catch (\Exception $e) {
            return back()->withInput()->withErrors(['database' => 'Erreur lors de la création: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Medicine $medicine)
    {

        return Inertia::render('Medicines/ShowMedicinePage', [
            'medicine' => $medicine->load([
                'family',
                'forms.form',
                'forms.packagingUnit',
                'forms.contentUnit'
            ]),
         ]);
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
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:medicines,code,' . $medicine->id,
            'name' => 'required|string|max:100',
            'family_id' => 'nullable|exists:families,id',
            'indications' => 'nullable|string',
        ]);

        try {
            $medicine->update($validated);
            return redirect()
                ->route('medicines.index')
                ->with('success', 'Médicament mis à jour avec succès');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['database' => 'Erreur lors de la mise à jour']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Medicine $medicine)
    {
        Validator::make(['id' => $medicine->id], [
            'id' => 'required|exists:medicines,id',
        ])->validate();

        try {
            $medicine->delete();
            return redirect()->route('medicines.index')->with('success', 'Médicament supprimé avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['database' => 'Erreur lors de la suppression']);
        }
    }
    public function massDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:medicines,id',
        ]);

        DB::transaction(function() use ($request) {
            Medicine::whereIn('id', $request->ids)->delete();
        });

        return redirect()->back()->with('success', 'Médicaments supprimés avec succès');
    }
    protected function generateMedicineCode(string $name): string
    {
        // 1. Nettoyer le nom (supprimer accents, caractères spéciaux)
        $cleanName = preg_replace('/[^a-zA-Z0-9]/', '', iconv('UTF-8', 'ASCII//TRANSLIT', $name));

        // 2. Prendre les 3 premières lettres en majuscules
        $prefix = strtoupper(substr($cleanName, 0, 3));

        // 3. Ajouter un numéro séquentiel unique
        $lastMedicine = Medicine::where('code', 'like', $prefix.'%')
                            ->orderBy('code', 'desc')
                            ->first();

        $number = 1;
        if ($lastMedicine) {
            $lastNumber = (int) substr($lastMedicine->code, 3);
            $number = $lastNumber + 1;
        }

        // 4. Format final (ex: PAR001, PAR002, etc.)
        return $prefix . str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    public function createBulk(Medicine $medicine)
    {
        return Inertia::render('Medicines/CreateBulkPage', [
            'medicine' => $medicine,
            'forms' => Form::orderBy('name')->get(['id', 'name']),
            'packagingUnits' => Unit::containerUnits()->get(),
            'contentUnits' => Unit::measureUnits()->get(),
        ]);
    }
    public function storeBulk(Request $request, Medicine $medicine)
    {
        $validated = $request->validate([
            'forms' => 'required|array|min:1',
            'forms.*.form_id' => 'required|exists:forms,id',
            'forms.*.packaging_unit_id' => 'required|exists:units,id',
            'forms.*.content_unit_id' => 'required|exists:units,id',
            'forms.*.content_quantity' => 'required|numeric|min:0.01',
            'forms.*.price' => 'required|numeric|min:0.01',
        ]);

        foreach ($validated['forms'] as $formData) {
            $medicine->forms()->create([
                'form_id' => $formData['form_id'],
                'packaging_unit_id' => $formData['packaging_unit_id'],
                'content_unit_id' => $formData['content_unit_id'],
                'content_quantity' => $formData['content_quantity'],
                'price' => $formData['price'],
            ]);
        }
        return redirect()->route('medicines.show', $medicine)->with('success', 'Conditionnements enregistrés avec succès');

    }

}
