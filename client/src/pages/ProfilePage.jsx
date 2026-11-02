import { useState, useEffect } from 'react';
import { getOrCreateUserProfile } from '../services/userService';
import AchievementsGrid from '../components/AchievementsGrid';
import { User, Mail, IdCard, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getOrCreateUserProfile('user_test_client');
        setProfile(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sky-400 font-medium animate-pulse flex items-center space-x-2">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span>Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Developer Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Student identity, account credentials, and earned achievement badges.</p>
      </div>

      {/* User Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="w-24 h-24 rounded-2xl bg-sky-600/20 border-2 border-sky-500/40 flex items-center justify-center text-sky-400">
          <User className="w-12 h-12" />
        </div>
        <div className="space-y-1 text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-white">{profile?.displayName || 'Alex Developer'}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5"><IdCard className="w-4 h-4 text-sky-400" /> Student ID: {profile?.studentId || 'DEV-88492'}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-sky-400" /> {profile?.email || 'alex.dev@example.com'}</span>
          </div>
        </div>
        <div className="bg-slate-950 px-6 py-4 rounded-xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Lifetime Rank</span>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">Mid-Level Lead</div>
        </div>
      </div>

      {/* Modular Achievements Section */}
      <AchievementsGrid profile={profile} />
    </div>
  );
}