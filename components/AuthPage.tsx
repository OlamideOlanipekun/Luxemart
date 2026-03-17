
import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Github, Chrome, ArrowRight, Loader2, Sparkles, LogOut, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { api, setToken } from '../services/api';

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
  onLogout?: () => void;
  currentUser?: any;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onLogout, currentUser }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<{ message: string; hint?: string } | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (mode === 'register') {
        const data = await api.auth.register(form.name, form.email, form.password);
        setToken(data.token);
        onAuthSuccess(data.user);
      } else if (mode === 'login') {
        const data = await api.auth.login(form.email, form.password);
        setToken(data.token);
        onAuthSuccess(data.user);
      } else {
        // Forgot password — not yet implemented on backend, show message
        setAuthError({ 
          message: 'Password reset is not yet available.',
          hint: 'Please contact support or create a new account.'
        });
      }
    } catch (error: any) {
      setAuthError({ message: error.message || 'An unexpected authentication error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (currentUser) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center space-y-8 animate-fadeInUp">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
            <User className="text-white w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">Profile Hub</h2>
            <p className="text-gray-500 font-medium">Logged in as <span className="text-blue-600 font-bold">{currentUser.email}</span></p>
          </div>
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4 text-left">
            <CheckCircle2 className="text-blue-600 w-6 h-6" />
            <div>
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Membership Status</div>
              <div className="text-slate-900 font-bold">Elite Tier Member</div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest italic hover:bg-red-600 transition-all shadow-xl"
          >
            Sign Out <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Brand Image/Message */}
        <div className="hidden md:block w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200" 
            alt="LuxeMart Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-400 w-8 h-8" />
              <span className="text-2xl font-black italic tracking-tighter">LuxeMart</span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-black leading-tight italic">
                {mode === 'login' ? 'Welcome Back to the Archive.' : mode === 'register' ? 'Join the Global Collective.' : 'Retrieve Your Access.'}
              </h2>
              <p className="text-white/80 text-lg font-medium">
                Experience the next generation of premium commerce. Authenticated members get priority shipping and exclusive vault access.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest">
              <span>Security Guaranteed</span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 mb-3 italic uppercase tracking-tight">
                {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Reset Password'}
              </h1>
              <p className="text-gray-500 font-medium">
                {mode === 'login' ? 'Please enter your credentials' : mode === 'register' ? 'Fill in your details below' : 'We will send a reset link to your email'}
              </p>
            </div>

            {/* Error/Info Notification */}
            {authError && (
              <div className={`mb-6 p-5 rounded-2xl border flex flex-col gap-2 animate-fadeInUp ${
                authError.message.includes("successful") || authError.message.includes("Check your email")
                ? 'bg-blue-50 border-blue-100 text-blue-700' 
                : 'bg-red-50 border-red-100 text-red-600'
              }`}>
                <div className="flex items-center gap-3 font-bold text-sm">
                  {authError.message.includes("successful") ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <span>{authError.message}</span>
                </div>
                {authError.hint && (
                  <div className="flex items-start gap-2 mt-1 pt-2 border-t border-current/10">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
                    <p className="text-[11px] font-medium leading-relaxed opacity-80">{authError.hint}</p>
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Julian Sterling"
                      className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="julian@luxemart.com"
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                    {mode === 'login' && (
                      <button 
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[10px] font-black text-blue-600 hover:text-slate-900 uppercase tracking-widest transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all hover:scale-[1.02] shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register Now' : 'Send Reset Link'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins */}
            {mode !== 'forgot' && (
              <div className="mt-10 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-black text-gray-400 tracking-widest">
                    <span className="bg-white px-4 italic">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl font-bold text-sm hover:border-slate-900 transition-all hover:bg-gray-50">
                    <Chrome className="w-5 h-5 text-blue-500" />
                    Google
                  </button>
                  <button className="flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl font-bold text-sm hover:border-slate-900 transition-all hover:bg-gray-50">
                    <Github className="w-5 h-5" />
                    Github
                  </button>
                </div>
              </div>
            )}

            {/* Switch Mode Footer */}
            <div className="mt-12 text-center">
              <p className="text-sm font-bold text-gray-500">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setAuthError(null);
                  }}
                  className="ml-2 text-blue-600 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs font-black underline decoration-2 underline-offset-4"
                >
                  {mode === 'login' ? 'Create One' : 'Sign In Instead'}
                </button>
              </p>
              {mode === 'forgot' && (
                <button 
                  onClick={() => {
                    setMode('login');
                    setAuthError(null);
                  }}
                  className="mt-4 text-xs font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
                >
                  Back to login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
