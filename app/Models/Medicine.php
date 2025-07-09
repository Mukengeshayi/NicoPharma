<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Medicine extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'family_id',
        'indications',
    ];
    public function family()
    {
        return $this->belongsTo(Family::class);
    }
    public function forms()
    {
        return $this->hasMany(MedicineForm::class);
    }
}
