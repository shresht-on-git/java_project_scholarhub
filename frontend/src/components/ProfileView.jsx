import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Camera,
  Trash2,
  Mail,
  Hash,
  GraduationCap,
  BookOpen,
  Phone,
  Code2,
  Github,
  Linkedin,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { userApi } from '../api/axios';

export default function ProfileView({ currentStudent, onProfileUpdated, showToast }) {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    branch: '',
    semester: 1,
    profilePhoto: '',
    phoneNumber: '',
    skills: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  // Sync state with currentStudent on mount or update
  useEffect(() => {
    if (currentStudent) {
      setFormData({
        fullName: currentStudent.fullName || '',
        rollNumber: currentStudent.rollNumber || '',
        email: currentStudent.email || '',
        branch: currentStudent.branch || 'Computer Engineering',
        semester: currentStudent.semester || 1,
        profilePhoto: currentStudent.profilePhoto || '',
        phoneNumber: currentStudent.phoneNumber || '',
        skills: currentStudent.skills || 'React, Spring Boot, Java, MySQL',
        bio: currentStudent.bio || '',
        githubUrl: currentStudent.githubUrl || '',
        linkedinUrl: currentStudent.linkedinUrl || '',
      });
    }
  }, [currentStudent]);

  // Handle Photo File Upload with client-side thumbnail resizing
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Photo file size should be less than 5 MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize to reasonable avatar size (max 400x400)
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setFormData((prev) => ({ ...prev, profilePhoto: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, profilePhoto: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleReset = () => {
    if (currentStudent) {
      setFormData({
        fullName: currentStudent.fullName || '',
        rollNumber: currentStudent.rollNumber || '',
        email: currentStudent.email || '',
        branch: currentStudent.branch || 'Computer Engineering',
        semester: currentStudent.semester || 1,
        profilePhoto: currentStudent.profilePhoto || '',
        phoneNumber: currentStudent.phoneNumber || '',
        skills: currentStudent.skills || '',
        bio: currentStudent.bio || '',
        githubUrl: currentStudent.githubUrl || '',
        linkedinUrl: currentStudent.linkedinUrl || '',
      });
      setError('');
      setSuccessMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSaving(true);

    try {
      const res = await userApi.updateProfile({
        fullName: formData.fullName.trim(),
        rollNumber: formData.rollNumber.trim(),
        email: formData.email.trim(),
        branch: formData.branch.trim(),
        semester: Number(formData.semester),
        profilePhoto: formData.profilePhoto || null,
        phoneNumber: formData.phoneNumber.trim() || null,
        skills: formData.skills.trim() || null,
        bio: formData.bio.trim() || null,
        githubUrl: formData.githubUrl.trim() || null,
        linkedinUrl: formData.linkedinUrl.trim() || null,
      });

      const updatedUser = res.data;
      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }
      setSuccessMsg('Your profile has been saved successfully!');
      if (showToast) {
        showToast('Profile credentials and project details updated!', 'success', 'Saved');
      }
    } catch (err) {
      const msg = err.message || 'Failed to update profile.';
      setError(msg);
      if (showToast) {
        showToast(msg, 'error', 'Save Failed');
      }
    } finally {
      setSaving(false);
    }
  };

  const initials = (formData.fullName || currentStudent?.fullName || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const branches = [
    'Computer Engineering',
    'Computer Science',
    'Artificial Intelligence',
    'Data Science',
    'Electronics & Comm',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Alert Banners */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Banner & Avatar Row */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-8 pb-14 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider inline-block">
                Academic Profile & Portfolio
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">
                {formData.fullName || 'Student Profile'}
              </h2>
              <p className="text-indigo-100 text-xs md:text-sm mt-1">
                Manage your identity, contact information, and project technical stack.
              </p>
            </div>
          </div>
        </div>

        {/* Photo Upload & Identity Meta Strip */}
        <div className="px-8 -mt-10 pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            {/* Avatar with Camera Overlay */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto}
                    alt={formData.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {/* Upload trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all border-2 border-white"
                title="Upload Profile Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                >
                  Change Photo
                </button>
                {formData.profilePhoto && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Recommended: Square JPG or PNG, max 5 MB.
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              Roll No: {formData.rollNumber}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-8">
          {/* Section 1: Academic & Personal Identity */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Academic & Personal Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Roll Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    placeholder="e.g. 102403001"
                  />
                </div>
              </div>

              {/* Academic Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Academic Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    placeholder="e.g. aarav.sharma@scholarhub.edu"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              {/* Branch / Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Branch / Department <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-800"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Semester */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Semester <span className="text-rose-500">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-800 font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Project-Relevant Personal Details */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Project Collaboration Details
              </h3>
            </div>

            <div className="space-y-5 mt-5">
              {/* Technical Skills & Specialization */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Technical Skills & Technologies (Relevant for Team Assignment)
                </label>
                <div className="relative">
                  <Code2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    placeholder="e.g. React, Spring Boot, MySQL, REST API, Tailwind CSS, Python"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Team Leads look at your skills when assigning overall milestones and responsibilities.
                </p>
              </div>

              {/* Bio & Project Interests */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Bio / Project Focus
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={3}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white resize-none"
                    placeholder="Briefly describe your academic focus, preferred development roles, or project achievements..."
                  />
                </div>
              </div>

              {/* GitHub & LinkedIn Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    GitHub Profile / Repository Link
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    LinkedIn Profile Link
                  </label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold transition-all shadow-md shadow-indigo-100 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4 stroke-[2.2]" />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
