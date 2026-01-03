import { useState } from 'react';
import { Plus, Search, Filter, Phone, Mail, Heart, Clock, CheckCircle, MoreVertical } from 'lucide-react';
import { getInitials } from '../../lib/utils';

const mockCaregivers = [
  { id: '1', firstName: 'Mary', lastName: 'Smith', type: 'Family', relationship: 'Spouse', patient: 'John Smith', phone: '(555) 111-2222', email: 'mary.smith@email.com', available: true, experience: 5 },
  { id: '2', firstName: 'Tom', lastName: 'Johnson', type: 'Family', relationship: 'Child', patient: 'Mary Johnson', phone: '(555) 222-3333', email: 'tom.j@email.com', available: true, experience: 3 },
  { id: '3', firstName: 'Lisa', lastName: 'Davis', type: 'Professional', relationship: 'Professional', patient: 'Robert Williams', phone: '(555) 333-4444', email: 'lisa.davis@caregivers.com', available: false, experience: 10 },
  { id: '4', firstName: 'James', lastName: 'Brown', type: 'Family', relationship: 'Sibling', patient: 'Patricia Brown', phone: '(555) 444-5555', email: 'james.b@email.com', available: true, experience: 2 },
];

export default function CaregiversPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [caregivers] = useState(mockCaregivers);

  const filteredCaregivers = caregivers.filter(caregiver =>
    `${caregiver.firstName} ${caregiver.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caregiver.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Caregivers</h1>
          <p className="text-neutral-500 mt-1">Manage caregivers and their assignments</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Caregiver
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search caregivers..."
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
        {filteredCaregivers.map((caregiver) => (
          <div key={caregiver.id} className="card hover:shadow-card-hover transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar-lg bg-accent-100 text-accent-600">
                    {getInitials(caregiver.firstName, caregiver.lastName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {caregiver.firstName} {caregiver.lastName}
                    </h3>
                    <p className="text-sm text-neutral-500">{caregiver.type} Caregiver</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-neutral-100 rounded" title="More options">
                  <MoreVertical className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="badge badge-primary">{caregiver.relationship}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Heart className="w-4 h-4 text-neutral-400" />
                  Caring for: {caregiver.patient}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  {caregiver.experience} years experience
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  {caregiver.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  {caregiver.email}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between">
              {caregiver.available ? (
                <span className="flex items-center gap-1 text-sm text-success-600">
                  <CheckCircle className="w-4 h-4" />
                  Available
                </span>
              ) : (
                <span className="text-sm text-neutral-500">Currently unavailable</span>
              )}
              <button className="btn-outline btn-sm">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
