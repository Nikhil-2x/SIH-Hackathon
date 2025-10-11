import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

const danceForms = [
  { id: 'bharatanatyam', name: 'Bharatanatyam' },
  { id: 'odissi', name: 'Odissi' },
  { id: 'kuchipudi', name: 'Kuchipudi' },
  { id: 'mohiniattam', name: 'Mohiniattam' },
  { id: 'manipuri', name: 'Manipuri' },
  { id: 'kathak', name: 'Kathak' }
];

function DanceFormSelector({ selectedDanceForm, setSelectedDanceForm }) {
  return (
    <div className="bg-gray-800 border-gray-700 rounded-2xl shadow-xl p-6 border">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="w-5 h-5 text-orange-400" />
        <h2 className="text-xl font-bold text-gray-200">Select Dance Form</h2>
      </div>
      <div className="space-y-3">
        {danceForms.map((form) => (
          <button
            key={form.id}
            onClick={() => setSelectedDanceForm(form.id)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
              selectedDanceForm === form.id
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{form.name}</span>
              {selectedDanceForm === form.id && <CheckCircle2 className="w-5 h-5" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DanceFormSelector;