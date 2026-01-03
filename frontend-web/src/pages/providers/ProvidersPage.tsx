import { useState } from 'react';
import { Plus, Search, Filter, Phone, Mail, MapPin, CheckCircle, MoreVertical } from 'lucide-react';
import { getInitials } from '../../lib/utils';

const mockProviders = [
  { id: '1', firstName: 'Sarah', lastName: 'Johnson', type: 'Physician', specialty: 'Primary Care', organization: 'City Medical Center', phone: '(555) 111-2222', email: 'sarah.johnson@citymed.com', acceptingNew: true },
  { id: '2', firstName: 'Michael', lastName: 'Chen', type: 'Physician', specialty: 'Cardiology', organization: 'Heart Health Clinic', phone: '(555) 222-3333', email: 'mchen@hearthealthclinic.com', acceptingNew: true },
  { id: '3', firstName: 'Emily', lastName: 'Brown', type: 'Nurse Practitioner', specialty: 'Geriatrics', organization: 'Senior Care Associates', phone: '(555) 333-4444', email: 'ebrown@seniorcare.com', acceptingNew: false },
  { id: '4', firstName: 'David', lastName: 'Wilson', type: 'Therapist', specialty: 'Physical Therapy', organization: 'Rehab Plus', phone: '(555) 444-5555', email: 'dwilson@rehabplus.com', acceptingNew: true },
];

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [providers] = useState(mockProviders);

  const filteredProviders = providers.filter(provider =>
    `${provider.firstName} ${provider.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Healthcare Providers</h1>
          <p className="text-neutral-500 mt-1">Directory of healthcare professionals</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search providers..."
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
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="card hover:shadow-card-hover transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar-lg bg-secondary-100 text-secondary-600">
                    {getInitials(provider.firstName, provider.lastName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Dr. {provider.firstName} {provider.lastName}
                    </h3>
                    <p className="text-sm text-neutral-500">{provider.type}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-neutral-100 rounded" title="More options">
                  <MoreVertical className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="badge badge-secondary">{provider.specialty}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  {provider.organization}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  {provider.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  {provider.email}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between">
              {provider.acceptingNew ? (
                <span className="flex items-center gap-1 text-sm text-success-600">
                  <CheckCircle className="w-4 h-4" />
                  Accepting new patients
                </span>
              ) : (
                <span className="text-sm text-neutral-500">Not accepting new patients</span>
              )}
              <button className="btn-outline btn-sm">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
