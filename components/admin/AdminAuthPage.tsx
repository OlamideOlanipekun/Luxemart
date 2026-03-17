import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { api, setToken } from '../../services/api';

interface AdminAuthPageProps {
  onExit: () => void;
  onAuthSuccess: (userData: any) => void;
}

const AdminAuthPage: React.FC<AdminAuthPageProps> = ({ onExit, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await api.auth.login(email, password);
      // Even if login succeeds, we only allow entry if is_admin is true
      if (!data.user.is_admin) {
        setError('This account does not have admin privileges.');
        setIsSubmitting(false);
        return;
      }
      setToken(data.token);
      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen relative w-full"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Back button */}
      <button
        onClick={onExit}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </button>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Access</h1>
          <p className="text-sm text-slate-400">Sign in with your admin credentials to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleAdminLogin} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@luxemart.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-black rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-[11px] text-slate-500">
              This area is restricted to authorized administrators only.
            </p>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center mt-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">LuxeMart Admin Portal</span>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
