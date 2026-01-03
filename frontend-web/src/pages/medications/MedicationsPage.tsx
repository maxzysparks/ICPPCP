import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { getStatusColor } from '../../lib/utils';

const mockMedications = [
  { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', route: 'Oral', status: 'active', patient: 'John Smith', refillsRemaining: 3, lastTaken: '2 hours ago' },
  { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', route: 'Oral', status: 'active', patient: 'Mary Johnson', refillsRemaining: 5, lastTaken: '4 hours ago' },
  { id: '3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', route: 'Oral', status: 'active', patient: 'Robert Williams', refillsRemaining: 1, lastTaken: '1 day ago' },
  { id: '4', name: 'Omeprazole', dosage: '40mg', frequency: 'Once daily', route: 'Oral', status: 'on_hold', patient: 'Patricia Brown', refillsRemaining: 0, lastTaken: '3 days ago' },
];

export default function MedicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medications] = useState(mockMedications);

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Medications</h1>
          <p className="text-neutral-500 mt-1">Track and manage patient medications</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9"
            />
          </div>
          <button className="btn-outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedications.map((med) => (
          <div key={med.id} className="card p-5 hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900">{med.name}</h3>
                <p className="text-sm text-neutral-500">{med.dosage} • {med.route}</p>
              </div>
              <button className="p-1 hover:bg-neutral-100 rounded" title="More options">
                <MoreVertical className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Frequency</span>
                <span className="font-medium">{med.frequency}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Patient</span>
                <span className="font-medium">{med.patient}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Last Taken</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {med.lastTaken}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className={getStatusColor(med.status)}>{med.status.replace('_', ' ')}</span>
              {med.refillsRemaining <= 1 ? (
                <span className="flex items-center gap-1 text-sm text-warning-600">
                  <AlertTriangle className="w-4 h-4" />
                  {med.refillsRemaining} refills left
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-success-600">
                  <CheckCircle className="w-4 h-4" />
                  {med.refillsRemaining} refills
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
