<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Form extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['name'];

    public function medicines()
    {
        return $this->belongsToMany(Medicine::class, 'medicine_forms')
                    ->withPivot('packaging_unit_id', 'content_unit_id', 'content_quantity', 'price')
                    ->withTimestamps();
    }
}

