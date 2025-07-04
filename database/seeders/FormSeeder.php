<?php

namespace Database\Seeders;

use App\Models\Form;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $forms = [
            'Comprimé',
            'Comprimé effervescent',
            'Comprimé enrobé',
            'Comprimé sublingual',
            'Gélule',
            'Gélule molle',
            'Sirop',
            'Solution buvable',
            'Solution injectable',
            'Solution pour perfusion',
            'Pommade',
            'Crème',
            'Gel',
            'Suppositoire',
            'Ovule',
            'Collyre',
            'Gouttes auriculaires',
            'Gouttes nasales',
            'Aérosol',
            'Inhalateur',
            'Poudre pour inhalation',
            'Patch transdermique',
            'Granulés',
            'Sachet',
            'Suspension',
            'Emulsion',
            'Capsule',
            'Pastille',
            'Comprimé à croquer',
            'Comprimé dispersible'
        ];

        foreach ($forms as $form) {
            Form::create([
                'name' => $form,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        $this->command->info('Seeder de formes de médicaments (noms seulement) exécuté avec succès !');
    }
}
