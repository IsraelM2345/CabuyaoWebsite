<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PublicExecutive;

class PublicExecutiveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $executives = [
            [
                'name' => 'Hon. Deniel Fernandez',
                'position' => 'City Mayor',
                'email' => 'mayor@cabuyao.gov.ph',
                'phone' => '+63 123 456 7890',
                'office' => 'City Hall, 2nd Floor',
                'term_start' => '2022-06-30',
                'term_end' => '2025-06-30',
                'election_date' => 'May 9, 2022',
                'assumption_date' => 'June 30, 2022',
                'bio' => 'Mayor Deniel Fernandez is committed to transforming Cabuyao into a progressive and sustainable city.',
                'photo_path' => null,
                'order_column' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Junjun Batallones',
                'position' => 'Vice Mayor',
                'email' => 'vicemayor@cabuyao.gov.ph',
                'phone' => '+63 123 456 7891',
                'office' => 'City Hall, 2nd Floor',
                'term_start' => '2022-06-30',
                'term_end' => '2025-06-30',
                'election_date' => 'May 12, 2025',
                'assumption_date' => 'July 1, 2025',
                'bio' => 'Vice Mayor Junjun Batallones serves as the presiding officer of the Sangguniang Panlungsod.',
                'photo_path' => null,
                'order_column' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($executives as $executive) {
            PublicExecutive::create($executive);
        }
    }
}