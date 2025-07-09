<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineForm extends Model
{
    protected $table = 'medicine_forms';
    protected $fillable = [
        'medicine_id',
        'form_id',
        'packaging_unit_id',
        'content_unit_id',
        'content_quantity',
        'price'
    ];
    protected $casts = [
        'content_quantity' => 'decimal:2',
        'price' => 'decimal:2',
    ];
    public function medicine() {
        return $this->belongsTo(Medicine::class);
    }
    public function form() {
        return $this->belongsTo(Form::class);
    }
    public function packagingUnit()
    {
        return $this->belongsTo(Unit::class, 'packaging_unit_id');
    }

    public function contentUnit()
    {
        return $this->belongsTo(Unit::class, 'content_unit_id');
    }
}
