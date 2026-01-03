import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Phone, Mail, AlertCircle } from 'lucide-react';
import { getInitials, getStatusColor } from '../../lib/utils';

// Mock data - will be replaced with API calls
const mockPatients = [
  { id: '1', firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', phone: '(555) 123-4567', bloodType: 'A+', status: 'active', allergies: 'Penicillin', primaryPhysician: 'Dr. Sarah Johnson' },
  { id: '2', firstName: 'Mary', lastName: 'Johnson', email: 'mary.j@email.com', phone: '(555) 234-5678', bloodType: 'O-', status: 'active', allergies: 'None', primaryPhysician: 'Dr. Michael Chen' },
  { id: '3', firstName: 'Robert', lastName: 'Williams', email: 'r.williams@email.com', phone: '(555) 345-6789', bloodType: 'B+', status: 'inactive', allergies: 'Sulfa drugs', primaryPhysician: 'Dr. Emily Brown' },
  { id: '4', firstName: 'Patricia', lastName: 'Brown', email: 'p.brown@email.com', phone: '(555) 456-7890', bloodType: 'AB+', status: 'active', allergies: 'Latex', primaryPhysician: 'Dr. Sarah Johnson' },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients] = useState(mockPatients);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Patients</h1>
          <p className="text-neutral-500 mt-1">Manage patient records and information</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search patients..."
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

      {/* Patients Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Contact</th>
                <th>Blood Type</th>
                <th>Allergies</th>
                <th>Primary Physician</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar-md">
                        {getInitials(patient.firstName, patient.lastName)}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-neutral-500">ID: {patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3 text-neutral-400" />
                        {patient.email}
                      </p>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        {patient.phone}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{patient.bloodType}</span>
                  </td>
                  <td>
                    {patient.allergies !== 'None' ? (
                      <span className="flex items-center gap-1 text-sm text-warning-600">
                        <AlertCircle className="w-4 h-4" />
                        {patient.allergies}
                      </span>
                    ) : (
                      <span className="text-sm text-neutral-500">None</span>
                    )}
                  </td>
                  <td className="text-sm text-neutral-600">{patient.primaryPhysician}</td>
                  <td>
                    <span className={getStatusColor(patient.status)}>
                      {patient.status}
                    </span>
                  </td>
                  <td>
                    <button className="p-2 hover:bg-neutral-100 rounded-lg" title="More options">
                      <MoreVertical className="w-4 h-4 text-neutral-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing {filteredPatients.length} of {patients.length} patients
          </p>
          <div className="pagination">
            <button className="pagination-btn" disabled>Previous</button>
            <button className="pagination-btn-active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
