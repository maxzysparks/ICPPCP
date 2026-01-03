import { useState } from 'react';
import { Plus, Search, Users, MoreVertical, UserPlus, Settings } from 'lucide-react';
import { getInitials, getStatusColor } from '../../lib/utils';

const mockCareTeams = [
  { id: '1', name: 'Smith Family Care Team', patient: 'John Smith', status: 'active', memberCount: 5, members: ['Dr. Sarah Johnson', 'Mary Smith', 'Nurse Jane'] },
  { id: '2', name: 'Johnson Care Circle', patient: 'Mary Johnson', status: 'active', memberCount: 4, members: ['Dr. Michael Chen', 'Tom Johnson', 'Caregiver Lisa'] },
  { id: '3', name: 'Williams Support Team', patient: 'Robert Williams', status: 'inactive', memberCount: 3, members: ['Dr. Emily Brown', 'Susan Williams'] },
  { id: '4', name: 'Brown Care Network', patient: 'Patricia Brown', status: 'active', memberCount: 6, members: ['Dr. Sarah Johnson', 'James Brown', 'Nurse Mike'] },
];

export default function CareTeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [careTeams] = useState(mockCareTeams);

  const filteredTeams = careTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Care Teams</h1>
          <p className="text-neutral-500 mt-1">Manage care coordination teams</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Care Team
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search care teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeams.map((team) => (
          <div key={team.id} className="card hover:shadow-card-hover transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{team.name}</h3>
                    <p className="text-sm text-neutral-500">Patient: {team.patient}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-neutral-100 rounded" title="More options">
                  <MoreVertical className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-neutral-500">Team Members</span>
                  <span className="font-medium">{team.memberCount} members</span>
                </div>
                <div className="flex -space-x-2">
                  {team.members.slice(0, 4).map((member, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-600"
                      title={member}
                    >
                      {getInitials(member.split(' ')[0], member.split(' ')[1] || '')}
                    </div>
                  ))}
                  {team.memberCount > 4 && (
                    <div className="w-8 h-8 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-500">
                      +{team.memberCount - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between">
              <span className={getStatusColor(team.status)}>{team.status}</span>
              <div className="flex items-center gap-2">
                <button className="btn-ghost btn-sm" title="Add member">
                  <UserPlus className="w-4 h-4" />
                </button>
                <button className="btn-ghost btn-sm" title="Settings">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
