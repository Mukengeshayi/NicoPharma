<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    protected $fillable = [
        'name',
        'abbreviation',
        'type',
        'description'
    ];

    // Relations avec les conditionnements (en tant qu'unité d'emballage)
    public function packagedMedicines(): HasMany
    {
        return $this->hasMany(MedicineForm::class, 'packaging_unit_id');
    }

    // Relations avec les conditionnements (en tant qu'unité de contenu)
    public function contentMedicines(): HasMany
    {
        return $this->hasMany(MedicineForm::class, 'content_unit_id');
    }

    // Scopes utiles
    public function scopePrimaryUnits($query)
    {
        return $query->where('type', 'primary'); // Comprimés, gélules, etc.
    }

    public function scopeContainerUnits($query)
    {
        return $query->where('type', 'container'); // Boîtes, cartons, etc.
    }

    public function scopeMeasureUnits($query)
    {
        return $query->where('type', 'measure'); // ml, mg, etc.
    }
}
