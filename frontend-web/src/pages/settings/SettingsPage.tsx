import { useState } from 'react';
import { User, Bell, Shield, Globe, Save } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../lib/utils';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card">
              <div className="p-5 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">Profile Information</h2>
                <p className="text-sm text-neutral-500 mt-1">Update your personal information</p>
              </div>
              <div className="p-5 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="avatar-lg text-lg">
                    {user ? getInitials(user.firstName, user.lastName) : 'U'}
                  </div>
                  <div>
                    <button className="btn-outline btn-sm">Change Photo</button>
                    <p className="text-xs text-neutral-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="firstName" className="label">First Name</label>
                    <input id="firstName" type="text" className="input" defaultValue={user?.firstName || ''} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="lastName" className="label">Last Name</label>
                    <input id="lastName" type="text" className="input" defaultValue={user?.lastName || ''} />
                  </div>
                  <div className="input-group md:col-span-2">
                    <label htmlFor="email" className="label">Email Address</label>
                    <input id="email" type="email" className="input" defaultValue={user?.email || ''} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="phone" className="label">Phone Number</label>
                    <input id="phone" type="tel" className="input" defaultValue={user?.phoneNumber || ''} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="role" className="label">Role</label>
                    <input id="role" type="text" className="input bg-neutral-50" value={user?.role || ''} disabled />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <div className="p-5 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">Notification Settings</h2>
                <p className="text-sm text-neutral-500 mt-1">Manage how you receive notifications</p>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { title: 'Email Notifications', desc: 'Receive email updates about your account' },
                  { title: 'Appointment Reminders', desc: 'Get notified before upcoming appointments' },
                  { title: 'Medication Reminders', desc: 'Receive reminders to take your medications' },
                  { title: 'Care Team Updates', desc: 'Get notified when care team members make changes' },
                  { title: 'Security Alerts', desc: 'Receive alerts about account security' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                    <div>
                      <p className="font-medium text-neutral-900">{item.title}</p>
                      <p className="text-sm text-neutral-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={idx < 3} aria-label={item.title} />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <div className="p-5 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">Security Settings</h2>
                <p className="text-sm text-neutral-500 mt-1">Manage your account security</p>
              </div>
              <div className="p-5 space-y-6">
                <div>
                  <h3 className="font-medium text-neutral-900 mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div className="input-group">
                      <label htmlFor="currentPassword" className="label">Current Password</label>
                      <input id="currentPassword" type="password" className="input" placeholder="••••••••" />
                    </div>
                    <div className="input-group">
                      <label htmlFor="newPassword" className="label">New Password</label>
                      <input id="newPassword" type="password" className="input" placeholder="••••••••" />
                    </div>
                    <div className="input-group">
                      <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
                      <input id="confirmPassword" type="password" className="input" placeholder="••••••••" />
                    </div>
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200">
                  <h3 className="font-medium text-neutral-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
                      <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                    </div>
                    <button className="btn-outline">Enable</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card">
              <div className="p-5 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">Preferences</h2>
                <p className="text-sm text-neutral-500 mt-1">Customize your experience</p>
              </div>
              <div className="p-5 space-y-6">
                <div className="input-group">
                  <label htmlFor="language" className="label">Language</label>
                  <select id="language" className="select" aria-label="Language">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="timezone" className="label">Timezone</label>
                  <select id="timezone" className="select" aria-label="Timezone">
                    <option>Africa/Lagos (UTC+1)</option>
                    <option>America/New_York (UTC-5)</option>
                    <option>America/Los_Angeles (UTC-8)</option>
                    <option>Europe/London (UTC+0)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="dateFormat" className="label">Date Format</label>
                  <select id="dateFormat" className="select" aria-label="Date Format">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
