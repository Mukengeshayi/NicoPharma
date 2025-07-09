<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'abbreviation',
        'type',
        'description'
    ];
    public function packagedMedicines(): HasMany
    {
        return $this->hasMany(MedicineForm::class, 'packaging_unit_id');
    }
    public function contentMedicines(): HasMany
    {
        return $this->hasMany(MedicineForm::class, 'content_unit_id');
    }
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
