import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, MapPin, Video, Phone, MoreVertical } from 'lucide-react';
import { getStatusColor } from '../../lib/utils';

const mockAppointments = [
  { id: '1', title: 'Annual Checkup', patient: 'John Smith', provider: 'Dr. Sarah Johnson', date: '2026-01-05', time: '10:00 AM', duration: 30, type: 'in_person', status: 'scheduled', location: 'Main Clinic, Room 201' },
  { id: '2', title: 'Follow-up Visit', patient: 'Mary Johnson', provider: 'Dr. Michael Chen', date: '2026-01-08', time: '2:30 PM', duration: 15, type: 'telehealth', status: 'confirmed', location: 'Virtual' },
  { id: '3', title: 'Lab Results Review', patient: 'Robert Williams', provider: 'Dr. Emily Brown', date: '2026-01-12', time: '11:00 AM', duration: 20, type: 'phone', status: 'scheduled', location: 'Phone Call' },
  { id: '4', title: 'Medication Review', patient: 'Patricia Brown', provider: 'Dr. Sarah Johnson', date: '2026-01-15', time: '9:00 AM', duration: 45, type: 'in_person', status: 'confirmed', location: 'Main Clinic, Room 105' },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'telehealth': return Video;
    case 'phone': return Phone;
    default: return MapPin;
  }
};

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments] = useState(mockAppointments);

  const filteredAppointments = appointments.filter(apt =>
    apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Appointments</h1>
          <p className="text-neutral-500 mt-1">Schedule and manage appointments</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Appointment
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search appointments..."
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

      <div className="space-y-4">
        {filteredAppointments.map((apt) => {
          const TypeIcon = getTypeIcon(apt.type);
          return (
            <div key={apt.id} className="card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    apt.type === 'telehealth' ? 'bg-secondary-100 text-secondary-600' :
                    apt.type === 'phone' ? 'bg-warning-100 text-warning-600' :
                    'bg-primary-100 text-primary-600'
                  }`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{apt.title}</h3>
                    <p className="text-sm text-neutral-500">{apt.patient} • {apt.provider}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-neutral-600">
                        <Clock className="w-4 h-4" />
                        {apt.time} ({apt.duration} min)
                      </span>
                      <span className="flex items-center gap-1 text-sm text-neutral-600">
                        <TypeIcon className="w-4 h-4" />
                        {apt.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={getStatusColor(apt.status)}>{apt.status}</span>
                  <button className="p-2 hover:bg-neutral-100 rounded-lg" title="More options">
                    <MoreVertical className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
