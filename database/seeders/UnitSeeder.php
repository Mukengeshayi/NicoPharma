<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            // Unités PRIMAIRES (indivisibles)
            [
                'name' => 'Comprimé',
                'abbreviation' => 'cp',
                'type' => 'primary',
                'description' => 'Unité de prise individuelle pour formes solides'
            ],
            [
                'name' => 'Gélule',
                'abbreviation' => 'gél',
                'type' => 'primary',
                'description' => 'Unité encapsulée'
            ],
            [
                'name' => 'Suppositoire',
                'abbreviation' => 'supp',
                'type' => 'primary',
                'description' => 'Unité rectale'
            ],
            [
                'name' => 'Ampoule',
                'abbreviation' => 'amp',
                'type' => 'primary',
                'description' => 'Unité injectable'
            ],
            [
                'name' => 'Patch',
                'abbreviation' => 'patch',
                'type' => 'primary',
                'description' => 'Dispositif transdermique'
            ],

            // Unités de MESURE (quantifiables)
            [
                'name' => 'Millilitre',
                'abbreviation' => 'ml',
                'type' => 'measure',
                'description' => 'Unité de volume pour liquides'
            ],
            [
                'name' => 'Gramme',
                'abbreviation' => 'g',
                'type' => 'measure',
                'description' => 'Unité de masse'
            ],
            [
                'name' => 'Milligramme',
                'abbreviation' => 'mg',
                'type' => 'measure',
                'description' => 'Sous-unité de gramme'
            ],
            [
                'name' => 'Goutte',
                'abbreviation' => 'gt',
                'type' => 'measure',
                'description' => 'Unité de dosage pour collyres'
            ],
            [
                'name' => 'Unité Internationale',
                'abbreviation' => 'UI',
                'type' => 'measure',
                'description' => 'Mesure biologique standardisée'
            ],

            // Unités CONTENEURS (emballages)
            [
                'name' => 'Plaquette',
                'abbreviation' => 'pla',
                'type' => 'container',
                'description' => 'Blister pour comprimés/gélules'
            ],
            [
                'name' => 'Boîte',
                'abbreviation' => 'bt',
                'type' => 'container',
                'description' => 'Emballage secondaire standard'
            ],
            [
                'name' => 'Flacon',
                'abbreviation' => 'fl',
                'type' => 'container',
                'description' => 'Conteneur pour liquides/poudres'
            ],
            [
                'name' => 'Sachet',
                'abbreviation' => 'sach',
                'type' => 'container',
                'description' => 'Emballage unitaire souple'
            ],
            [
                'name' => 'Carton',
                'abbreviation' => 'ct',
                'type' => 'container',
                'description' => 'Emballage tertiaire pour grossistes'
            ],
            [
                'name' => 'Tube',
                'abbreviation' => 'tb',
                'type' => 'container',
                'description' => 'Conteneur pour crèmes/pommades'
            ],
            [
                'name' => 'Stylo injecteur',
                'abbreviation' => 'stylo',
                'type' => 'container',
                'description' => 'Dispositif auto-injecteur'
            ]
        ];
        foreach ($units as $unitData) {
            Unit::firstOrCreate($unitData);
        }
    }
}
