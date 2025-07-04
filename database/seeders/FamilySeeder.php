<?php

namespace Database\Seeders;

use App\Models\Family;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $families = [
            ['name' => 'Analgésiques', 'description' => 'Médicaments contre la douleur'],
            ['name' => 'Antibiotiques', 'description' => 'Médicaments contre les infections bactériennes'],
            ['name' => 'Anti-inflammatoires', 'description' => 'Médicaments réduisant l\'inflammation'],
            ['name' => 'Antihistaminiques', 'description' => 'Médicaments contre les allergies'],
            ['name' => 'Antidépresseurs', 'description' => 'Médicaments pour traiter la dépression'],
            ['name' => 'Antidiabétiques', 'description' => 'Médicaments pour le diabète'],
            ['name' => 'Antihypertenseurs', 'description' => 'Médicaments contre l\'hypertension'],
            ['name' => 'Anticoagulants', 'description' => 'Médicaments fluidifiant le sang'],
            ['name' => 'Antipsychotiques', 'description' => 'Médicaments pour troubles psychiatriques'],
            ['name' => 'Antiviraux', 'description' => 'Médicaments contre les infections virales'],
            ['name' => 'Bronchodilatateurs', 'description' => 'Médicaments pour l\'asthme et la BPCO'],
            ['name' => 'Corticoïdes', 'description' => 'Anti-inflammatoires stéroïdiens'],
            ['name' => 'Diurétiques', 'description' => 'Médicaments augmentant la diurèse'],
            ['name' => 'Hypolipémiants', 'description' => 'Médicaments contre le cholestérol'],
            ['name' => 'Immunosuppresseurs', 'description' => 'Médicaments modulant l\'immunité'],
            ['name' => 'Neuroleptiques', 'description' => 'Médicaments psychotropes'],
            ['name' => 'Antiacides', 'description' => 'Médicaments pour troubles digestifs'],
            ['name' => 'Antianémiques', 'description' => 'Médicaments contre l\'anémie'],
            ['name' => 'Antimigraineux', 'description' => 'Médicaments spécifiques contre la migraine'],
            ['name' => 'Antiparkinsoniens', 'description' => 'Médicaments pour la maladie de Parkinson'],
            ['name' => 'Antitussifs', 'description' => 'Médicaments contre la toux'],
            ['name' => 'Anxiolytiques', 'description' => 'Médicaments contre l\'anxiété'],
            ['name' => 'Bêta-bloquants', 'description' => 'Médicaments cardiovasculaires'],
            ['name' => 'Digitaliques', 'description' => 'Médicaments cardiotoniques'],
            ['name' => 'Hypnotiques', 'description' => 'Médicaments pour le sommeil'],
            ['name' => 'Myorelaxants', 'description' => 'Médicaments décontracturants musculaires'],
            ['name' => 'Vasodilatateurs', 'description' => 'Médicaments dilatant les vaisseaux'],
            ['name' => 'Vitamines', 'description' => 'Compléments vitaminiques'],
            ['name' => 'Antifongiques', 'description' => 'Médicaments contre les mycoses'],
            ['name' => 'Antiparasitaires', 'description' => 'Médicaments contre les parasites']
        ];

        foreach ($families as $family) {
            Family::create($family);
        }
    }
}
