<?php

namespace Database\Seeders;

use App\Models\PublicCouncilor;
use Illuminate\Database\Seeder;

class PublicCouncilorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $councilors = [
            [
                'name' => 'Hon. Gabriel C. Bariring II',
                'position' => 'Councilor',
                'education' => 'BA Political Science - Major in Social Governance Administration',
                'birthday' => 'March 20, 1978',
                'chairmanships' => json_encode([
                    'Committee on Agriculture',
                    'Committee on Cooperatives',
                ]),
                'memberships' => json_encode([
                    'Committee on Human Rights',
                    'Committee on Environmental Protection',
                    'Committee on Transportation and Communication',
                    'Committee on Trade, Commerce and Industry',
                    'Committee on Social Welfare',
                ]),
                'photo_path' => null,
                'order_column' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Maria Alexis A. Alimagno',
                'position' => 'Councilor',
                'education' => 'AB Economics / Post Graduate in Juris Doctor',
                'birthday' => 'August 25, 1990',
                'chairmanships' => json_encode([
                    'Committee on Human Rights',
                    'Committee on Games and Amusement',
                ]),
                'memberships' => json_encode([
                    'Committee on Women and Family',
                    'Committee on Labor and Employment',
                    'Committee on Tourism',
                    'Committee on Trade, Commerce and Industry',
                    'Committee on Ordinance and Legal Matter',
                    'Committee on People Empowerment and Accreditation',
                ]),
                'photo_path' => null,
                'order_column' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Emerson L. Devoma',
                'position' => 'Councilor',
                'education' => 'BS Mechanical Engineering',
                'birthday' => 'July 23, 1976',
                'chairmanships' => json_encode([]),
                'memberships' => json_encode([
                    'Committee on Environmental Protection',
                    'Committee on Transportation and Communication',
                    'Committee on Energy',
                    'Committee on People Empowerment and Accreditation',
                ]),
                'photo_path' => null,
                'order_column' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Evelyn Guttierez Del Rosario',
                'position' => 'Councilor',
                'education' => 'Licensed Nurse/ Educator at University of Perpetual Help',
                'birthday' => 'May 7, 1963',
                'chairmanships' => json_encode([]),
                'memberships' => json_encode([
                    'Committee on Women and Family',
                    'Committee on Health',
                ]),
                'photo_path' => null,
                'order_column' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Kim Manaog Hain',
                'position' => 'Councilor',
                'education' => 'BS Computer Engineering and Civil Engineering',
                'birthday' => 'June 16, 1980',
                'chairmanships' => json_encode([
                    'Committee on Good Governance, Public Ethics and Accountability',
                    'Committee on Public Works',
                    'Committee on Housing and Land Utilization',
                ]),
                'memberships' => json_encode([
                    'Committee on Appreciation, Budget and Finance',
                    'Committee on Human Rights',
                    'Committee on Environmental Protection',
                    'Committee on Rules and Privileges',
                    'Committee on Peace and Order and Public Safety',
                    'Committee on Disaster Preparedness',
                    'Committee on Health',
                    'Committee on Games and Amusement',
                    'Committee on Trade, Commerce and Industry',
                    'Committee on Ordinances and Legal Matter',
                ]),
                'photo_path' => null,
                'order_column' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Jose Benson G. Aguillo',
                'position' => 'Councilor',
                'education' => 'AB Economics',
                'birthday' => 'August 11, 1967',
                'chairmanships' => json_encode([]),
                'memberships' => json_encode([
                    'Committee on Education',
                    'Committee on Appropriation Budget and Finance',
                    'Committee on Ordinances and Legal Matters',
                    'Committee on Rules',
                ]),
                'photo_path' => null,
                'order_column' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Jose Miguel J. Alcabasa',
                'position' => 'Councilor',
                'education' => 'BA Business and Society / Major in Global Economy',
                'birthday' => 'April 8, 1998',
                'chairmanships' => json_encode([
                    'Committee on Trade, Commerce and Industry',
                    'Committee on Labor and Employment',
                    'Committee on Livelihood',
                ]),
                'memberships' => json_encode([
                    'Committee on People Empowerment and Accreditation',
                    'Committee on Transportation and Communication',
                    'Committee on Youth and Sports Development',
                    'Committee on Good Government, Public Ethics and Accountability',
                    'Committee on Public Works',
                    'Committee on Games and Amusements',
                    'Committee on Tourism',
                    'Committee on Market',
                ]),
                'photo_path' => null,
                'order_column' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Rico Mauro G. Alimagno',
                'position' => 'Councilor',
                'education' => 'BS Occupational Therapy / Master of Arts in Guidance Counseling',
                'birthday' => 'August 20, 1991',
                'chairmanships' => json_encode([]),
                'memberships' => json_encode([
                    'Committee on Tourism',
                    'Committee on Market',
                ]),
                'photo_path' => null,
                'order_column' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Ma. Fe P. Humarang',
                'position' => 'Councilor',
                'education' => 'AB Political Science / Major in Local Government Administration',
                'birthday' => 'August 01, 1969',
                'chairmanships' => json_encode([
                    'Committee on Social Welfare',
                ]),
                'memberships' => json_encode([
                    'Committee on Women and Family',
                    'Committee on Cooperatives',
                    'Committee on Agriculture',
                    'Committee on Good Government, Public Ethics and Accountability',
                    'Committee on Livelihood',
                    'Committee on Market',
                ]),
                'photo_path' => null,
                'order_column' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'Hon. Sherwin Beguico',
                'position' => 'Councilor',
                'education' => 'Not specified',
                'birthday' => 'June 3, 1979',
                'chairmanships' => json_encode([
                    'Committee on Peace and Order & Public Safety',
                    'Committee on Disaster Preparedness',
                ]),
                'memberships' => json_encode([
                    'Committee on Human Rights',
                    'Committee on Health',
                    'Committee on Housing and Land Utilization',
                    'Committee on Market',
                    'Committee on Transportations and Communication',
                ]),
                'photo_path' => null,
                'order_column' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($councilors as $councilor) {
            PublicCouncilor::create($councilor);
        }
    }
}