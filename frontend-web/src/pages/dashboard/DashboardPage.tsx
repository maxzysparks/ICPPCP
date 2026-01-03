import { Users, Pill, Calendar, UserCog, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const stats = [
  { name: 'Total Patients', value: '24', icon: Users, color: 'bg-primary-500', change: '+12%' },
  { name: 'Active Medications', value: '156', icon: Pill, color: 'bg-secondary-500', change: '+8%' },
  { name: 'Upcoming Appointments', value: '12', icon: Calendar, color: 'bg-warning-500', change: '+3%' },
  { name: 'Care Teams', value: '8', icon: UserCog, color: 'bg-success-500', change: '+2%' },
];

const recentActivity = [
  { id: 1, type: 'appointment', message: 'Appointment with Dr. Smith confirmed', time: '2 hours ago', icon: CheckCircle, iconColor: 'text-success-500' },
  { id: 2, type: 'medication', message: 'Medication reminder: Lisinopril 10mg', time: '4 hours ago', icon: Clock, iconColor: 'text-warning-500' },
  { id: 3, type: 'alert', message: 'Blood pressure reading above normal', time: '6 hours ago', icon: AlertCircle, iconColor: 'text-error-500' },
  { id: 4, type: 'care_team', message: 'New member added to care team', time: '1 day ago', icon: Users, iconColor: 'text-primary-500' },
];

const upcomingAppointments = [
  { id: 1, title: 'Annual Checkup', provider: 'Dr. Sarah Johnson', date: 'Jan 5, 2026', time: '10:00 AM', type: 'in_person' },
  { id: 2, title: 'Follow-up Visit', provider: 'Dr. Michael Chen', date: 'Jan 8, 2026', time: '2:30 PM', type: 'telehealth' },
  { id: 3, title: 'Lab Results Review', provider: 'Dr. Emily Brown', date: 'Jan 12, 2026', time: '11:00 AM', type: 'phone' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-primary-100 mt-1">
          Here's an overview of your care coordination dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-5">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="flex items-center text-sm font-medium text-success-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-500">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 card">
          <div className="p-5 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Upcoming Appointments</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-5 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-900">{appointment.title}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{appointment.provider}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-neutral-600">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {appointment.date}
                      </span>
                      <span className="text-sm text-neutral-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {appointment.time}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${
                    appointment.type === 'in_person' ? 'badge-primary' :
                    appointment.type === 'telehealth' ? 'badge-secondary' : 'badge-neutral'
                  }`}>
                    {appointment.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-neutral-200">
            <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              View all appointments →
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-5 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start gap-3">
                  <activity.icon className={`w-5 h-5 mt-0.5 ${activity.iconColor}`} />
                  <div>
                    <p className="text-sm text-neutral-700">{activity.message}</p>
                    <p className="text-xs text-neutral-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-neutral-200">
            <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              View all activity →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <Calendar className="w-8 h-8 mx-auto text-primary-500 mb-2" />
            <span className="text-sm font-medium text-neutral-700">Schedule Appointment</span>
          </button>
          <button className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <Pill className="w-8 h-8 mx-auto text-secondary-500 mb-2" />
            <span className="text-sm font-medium text-neutral-700">Add Medication</span>
          </button>
          <button className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <Users className="w-8 h-8 mx-auto text-success-500 mb-2" />
            <span className="text-sm font-medium text-neutral-700">Add Patient</span>
          </button>
          <button className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <UserCog className="w-8 h-8 mx-auto text-warning-500 mb-2" />
            <span className="text-sm font-medium text-neutral-700">Manage Care Team</span>
          </button>
        </div>
      </div>
    </div>
  );
}
