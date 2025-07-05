<?php

namespace Database\Seeders;

use App\Models\Family;
use App\Models\Medicine;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $medicines = [
            // Antipaludiques
            [
                'code' => 'ARTESUNATE-60',
                'name' => 'Artésunate 60mg',
                'family_id' => Family::where('name', 'Antipaludiques')->first()->id,
                'composition' => 'Artésunate 60mg',
                'indications' => 'Traitement du paludisme simple chez l\'enfant'
            ],
            [
                'code' => 'COARTEM-20',
                'name' => 'Coartem 20/120',
                'family_id' => Family::where('name', 'Antipaludiques')->first()->id,
                'composition' => 'Artéméther 20mg/Luméfantrine 120mg',
                'indications' => 'Traitement du paludisme non compliqué'
            ],

            // Antibiotiques
            [
                'code' => 'AMOX-250',
                'name' => 'Amoxicilline 250mg',
                'family_id' => Family::where('name', 'Antibiotiques')->first()->id,
                'composition' => 'Amoxicilline trihydrate 250mg',
                'indications' => 'Infections bactériennes courantes'
            ],

            // Antalgiques
            [
                'code' => 'PARA-500',
                'name' => 'Paracétamol 500mg',
                'family_id' => Family::where('name', 'Antalgiques/Anti-inflammatoires')->first()->id,
                'composition' => 'Paracétamol 500mg',
                'indications' => 'Douleur et fièvre'
            ],

            // Antihypertenseurs
            [
                'code' => 'NIFED-20',
                'name' => 'Nifédipine 20mg',
                'family_id' => Family::where('name', 'Antihypertenseurs')->first()->id,
                'composition' => 'Nifédipine 20mg',
                'indications' => 'Hypertension artérielle'
            ]
        ];

        foreach ($medicines as $medicine) {
            Medicine::firstOrCreate(
                ['code' => $medicine['code']],
                $medicine
            );
        }
    }
}
