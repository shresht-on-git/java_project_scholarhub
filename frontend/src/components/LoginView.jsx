import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  User,
  Hash,
  BookOpen,
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { authApi } from '../api/axios';

export default function LoginView({ onLoginSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'

  // Sign In State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [branch, setBranch] = useState('Computer Engineering');
  const [semester, setSemester] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const branches = [
    'Computer Engineering',
    'Computer Science',
    'Information Technology',
    'Electronics & Comm',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Artificial Intelligence',
  ];

  const demoAccounts = [
    {
      role: 'Team Lead',
      name: 'Aarav Sharma',
      identifier: '102403001',
      email: 'aarav.sharma@scholarhub.edu',
      desc: 'Project Creator & Team Lead',
      badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    {
      role: 'Team Member',
      name: 'Ananya Verma',
      identifier: '102403002',
      email: 'ananya.verma@scholarhub.edu',
      desc: 'Active Team Member',
      badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    {
      role: 'Invited Member',
      name: 'Rohan Mehta',
      identifier: '102403003',
      email: 'rohan.mehta@scholarhub.edu',
      desc: 'Invited Student (Pending/Joined)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      role: 'Available Student',
      name: 'Priya Nair',
      identifier: '102403004',
      email: 'priya.nair@scholarhub.edu',
      desc: 'Ready for New Invitations',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ];

  const handleQuickFill = (acc) => {
    setMode('signin');
    setIdentifier(acc.identifier);
    setPassword('password123');
    setError('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your University Roll Number or Email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({
        identifier: identifier.trim(),
        password: password,
      });

      const { user, token } = res.data;
      localStorage.setItem('scholarhub_token', token);
      localStorage.setItem('scholarhub_user_id', String(user.id));
      localStorage.setItem('scholarhub_user', JSON.stringify(user));

      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!rollNumber.trim()) {
      setError('Please enter your university roll number.');
      return;
    }
    if (!signupEmail.trim()) {
      setError('Please enter your university email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.register({
        fullName: fullName.trim(),
        rollNumber: rollNumber.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        branch: branch,
        semester: Number(semester),
      });

      const { user, token } = res.data;
      localStorage.setItem('scholarhub_token', token);
      localStorage.setItem('scholarhub_user_id', String(user.id));
      localStorage.setItem('scholarhub_user', JSON.stringify(user));

      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200 mb-4">
          <GraduationCap className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ScholarHub Portal
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Academic Self-Management & Collaboration Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80">
          {/* Sign In / Sign Up Mode Switcher Tabs */}
          <div className="p-1 rounded-xl bg-slate-100 flex items-center mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Student Sign Up</span>
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'signin' ? 'Student Sign In' : 'Create Student Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'signin'
                ? 'Enter your official university roll number or student email'
                : 'Register as a new student to join courses and team projects'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= MODE: SIGN IN ================= */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Roll Number or Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 102403001 or aarav.sharma@scholarhub.edu"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 stroke-[2.2]" />
                      <span>Sign In to Account</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">New student? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Create an account &rarr;
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE: SIGN UP ================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Patel"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Roll Number *
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 102403055"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Semester *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-slate-800"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  University Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikram.patel@scholarhub.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department / Branch *
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-slate-800"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 chars"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 stroke-[2.2]" />
                      <span>Create Student Account</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError('');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Sign in here &rarr;
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Credentials Box (available for quick evaluation) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Instant Demo Logins (Click to autofill)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Default password for all 30 students is <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">password123</code>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.identifier}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${acc.badgeClass}`}>
                      {acc.role}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-indigo-600">
                      Fill &rarr;
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate">{acc.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{acc.identifier}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Protected Student Data • University Institutional Access
        </p>
      </div>
    </div>
  );
}
