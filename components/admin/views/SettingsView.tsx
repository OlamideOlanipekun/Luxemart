import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  CreditCard, 
  Bell, 
  Shield, 
  Save, 
  Database,
  Lock,
  Mail,
  Smartphone,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload
} from 'lucide-react';
import { api, getImageUrl } from '../../../services/api';

interface SettingsViewProps {
  user: any;
  onAuthSuccess?: (userData: any) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'security' | 'notifications' | 'profile'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    avatar: user?.avatar || ''
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Countdown State
  const [countdownDate, setCountdownDate] = useState('');

  useEffect(() => {
    // Fetch current settings (like countdown) on mount
    const fetchSettings = async () => {
      try {
        const res = await api.admin.getSettings('countdown_end');
        if (res && res.value_text) {
          setCountdownDate(res.value_text);
        }
      } catch (err) {
        console.error("Failed to fetch countdown setting", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMsg(null);
    
    try {
      if (activeTab === 'profile') {
        const payload: any = {};
        if (profileForm.name !== user.name) payload.name = profileForm.name;
        if (profileForm.email !== user.email) payload.email = profileForm.email;
        if (profileForm.password) payload.password = profileForm.password;
        if (profileForm.avatar !== user.avatar) payload.avatar = profileForm.avatar;

        if (Object.keys(payload).length === 0) {
          setStatusMsg({ type: 'error', text: 'No changes detected.' });
          setIsSaving(false);
          return;
        }

        const res = await api.auth.updateProfile(payload);
        if (onAuthSuccess) onAuthSuccess(res.user);
        setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
        setProfileForm(prev => ({ ...prev, password: '' }));
      } else if (activeTab === 'general') {
        // Update countdown if changed
        await api.admin.updateSetting('countdown_end', countdownDate);
        setStatusMsg({ type: 'success', text: 'General settings updated!' });
      } else {
        // Simulation for other tabs
        await new Promise(resolve => setTimeout(resolve, 800));
        setStatusMsg({ type: 'success', text: 'Settings updated successfully (Simulation)' });
      }
    } catch (err: any) {
      console.error('Update failed', err);
      setStatusMsg({ type: 'error', text: err.error || 'Failed to update settings.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const { url } = await api.admin.uploadImage(file);
      setProfileForm(prev => ({ ...prev, avatar: url }));
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'profile', label: 'User Profile', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-blue-600" />
            </div>
            Settings <span className="text-slate-400 font-medium">Archive</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Configure your LuxeMart platform parameters and security protocols.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {statusMsg && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-right-4 transition-all ${
              statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {statusMsg.text}
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {isSaving ? 'Processing...' : (
              <>
                <Save className="w-4 h-4" /> Save Variations
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex flex-row flex-wrap lg:flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white overflow-hidden relative group">
            <Database className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">System Health</div>
              <div className="text-xl font-bold mb-4 italic tracking-tight">Database Connectivity: <span className="text-green-400">OPTIMAL</span></div>
              <div className="text-xs text-slate-400 font-medium leading-relaxed">System core is synchronized with production clusters. Last backup: 4h ago.</div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl lg:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 lg:p-10">
          {activeTab === 'general' && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <section>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Store Identity</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Platform Alias</label>
                    <input 
                      type="text" 
                      defaultValue="LuxeMart" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Contact Protocol (Email)</label>
                    <input 
                      type="email" 
                      defaultValue="concierge@luxemart.com" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Event Countdown</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Sale End Date (UTC)</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="datetime-local" 
                        value={countdownDate}
                        onChange={e => setCountdownDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Regional Configurations</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Archive Currency</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 outline-none appearance-none cursor-pointer">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Temporal Zone</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 outline-none appearance-none cursor-pointer">
                      <option>UTC (London)</option>
                      <option>EST (New York)</option>
                      <option>PST (Los Angeles)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Weight Metric</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 outline-none appearance-none cursor-pointer">
                      <option>Metric (kg)</option>
                      <option>Imperial (lbs)</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <section>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Personal Protocol</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Identity (Name)</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={profileForm.name}
                        onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Digital Access (Email)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        value={profileForm.email}
                        onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                        placeholder="admin@luxemart.com"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Visual Identity</div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 ml-1">Current Preview</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-sm">
                      <img src={getImageUrl(profileForm.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                       <label className="text-xs font-bold text-slate-500">Avatar Link / Upload</label>
                       <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={profileForm.avatar}
                          onChange={e => setProfileForm(p => ({ ...p, avatar: e.target.value }))}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                          placeholder="https://..."
                        />
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                            disabled={isUploadingAvatar}
                            onChange={handleAvatarUpload}
                          />
                          <button 
                            type="button"
                            disabled={isUploadingAvatar}
                            className="h-full px-6 bg-slate-100 ring-1 ring-inset ring-slate-200 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-2xl flex flex-col items-center justify-center transition-colors disabled:opacity-50 gap-1 tracking-tight uppercase"
                          >
                            {isUploadingAvatar ? (
                              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span className="text-[10px] font-black">Upload</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Security Credential Update</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">New Terminal Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        value={profileForm.password}
                        onChange={e => setProfileForm(p => ({ ...p, password: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-3.5 font-semibold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1 uppercase font-bold tracking-widest">Leave blank to maintain current encryption.</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <section>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Transaction Infrastructure</div>
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex items-center gap-8 group hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center p-4">
                    <svg viewBox="0 0 40 40" className="w-full h-full text-[#635BFF]">
                      <path fill="currentColor" d="M36.1 19.4c0-4.3-2-7.1-5.8-7.1-4.1 0-7 3.5-7 8.3 0 4.9 2.5 7.6 6.8 7.6 2.1 0 3.8-.5 5-1.4v-3.7c-1 .6-2.4 1-3.6 1-1.6 0-3-.7-3.1-2.7h11.9c0-.6 4.2-2 4.2-2zM28.4 18c0-1.7 1.2-2.7 2.7-2.7s2.7 1 2.7 2.7H28.4zm-14.5 9.7c-1.3 0-2.2-.5-2.2-1.5s1.2-1.3 2.7-1.3c1.5 0 2.8.2 3.8.7v2c-.9.5-2.5 1-4.3 1zm1.2-16.7c-1 .2-1.8.8-1.8 1.8 0 1.1 1 1.4 2.5 1.4 1.5 0 2.8-.2 3.8-.7V6.5c-1-.5-2.5-1-4.5-1z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Stripe Gateway <span className="ml-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-black">TEST MODE</span></h3>
                    <p className="text-sm text-slate-500 font-medium italic">Your professional payment protocol is currently in simulation mode.</p>
                  </div>
                  <button className="bg-white border-2 border-slate-200 text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                    Review API Access
                  </button>
                </div>
              </section>

              <section className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -z-0"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-black italic tracking-tighter mb-3 uppercase">Activate Live Archive</h3>
                    <p className="text-blue-100 font-medium">Switch to production-grade transaction processing. Verification required.</p>
                  </div>
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-blue-900/40">
                    Submit Credentials
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <section>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Access Shield</div>
                <div className="space-y-4">
                  {[
                    { label: 'Two-Factor Authentication', desc: 'Secure your terminal with biometric or digital keys.', icon: <Smartphone className="w-5 h-5" />, active: false },
                    { label: 'Login Notifications', desc: 'Receive alerts when administrative access is initiated.', icon: <Mail className="w-5 h-5" />, active: true },
                    { label: 'Archive IP Whitelisting', desc: 'Restricts access to specified terminal architectures.', icon: <Lock className="w-5 h-5" />, active: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-100 hover:bg-white transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{item.label}</h4>
                          <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${item.active ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${item.active ? 'left-7' : 'left-1'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6">
                <Bell className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Notification Protocol</h3>
              <p className="text-slate-500 max-w-sm font-medium">Advanced alerting mechanisms are currently being synchronized with the LuxeMart core.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
