import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { User, Mail, Github, Save, Loader2, Award, Code, TrendingUp, Shield, Activity, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [githubProfile, setGithubProfile] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
            setUsername(data.username);
            setEmail(data.email);
            setGithubProfile(data.githubProfile || '');
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStats = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/stats', config);
            setStats(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.put(
                'http://localhost:5000/api/auth/profile',
                { username, githubProfile, email },
                config
            );

            // Update auth context and local storage
            const updatedUser = { ...user, username: data.username, email: data.email };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            setMessage('Success: Profile core parameters synchronized.');
            setLoading(false);
        } catch (error) {
            setMessage('Alert: Interface synchronization failed.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase">Unit <span className="text-gradient">Profile</span></h1>
                    <div className="flex items-center space-x-2 text-[var(--accent-blue)] font-bold text-xs">
                        <Terminal className="h-4 w-4" />
                        <span>OPERATOR IDENTITY MANAGEMENT NODE</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 md:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-black uppercase tracking-widest flex items-center">
                                <Shield className="h-5 w-5 mr-3 text-[var(--accent-blue)]" />
                                Credentials Analysis
                            </h2>
                            <div className="px-3 py-1 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[8px] font-black uppercase tracking-widest">Active Node</div>
                        </div>

                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className={`mb-8 p-4 rounded-xl text-xs font-black uppercase tracking-widest border flex items-center ${message.includes('Success')
                                            ? 'bg-[var(--accent-success)]/10 border-[var(--accent-success)]/20 text-[var(--accent-success)]'
                                            : 'bg-red-500/10 border-red-500/20 text-red-500'
                                        }`}
                                >
                                    <Activity className="h-4 w-4 mr-3 animate-pulse" />
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Callsign Entry</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] h-4 w-4 group-focus-within:text-[var(--accent-blue)]" />
                                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--accent-blue)]/50 outline-none transition-all font-black uppercase" required />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Network Protocol (Email)</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] h-4 w-4 group-focus-within:text-[var(--accent-blue)]" />
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--accent-blue)]/50 outline-none transition-all font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Technical Nexus (GitHub)</label>
                                <div className="relative group">
                                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] h-4 w-4 group-focus-within:text-[var(--accent-blue)]" />
                                    <input type="text" value={githubProfile} onChange={(e) => setGithubProfile(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--accent-blue)]/50 outline-none transition-all font-bold" placeholder="https://github.com/nexus-link" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary !w-full !py-5 group">
                                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                                    <div className="flex items-center space-x-3">
                                        <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        <span className="uppercase font-black tracking-[0.2em] text-sm">Synchronize Parameters</span>
                                    </div>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="p-8 border-2 border-[var(--border-color)] border-dashed rounded-3xl flex items-center justify-between opacity-60">
                        <div className="flex items-center space-x-4">
                            <Activity className="h-8 w-8 text-[var(--accent-blue)]" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] max-w-sm">Warning: All profile modifications are encrypted and broadcast to associated collaborators in real-time.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-8 bg-mesh">
                        <h3 className="text-[10px] font-black uppercase tracking-widest mb-10 border-b border-[var(--border-color)] pb-4 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Operational Metrics
                        </h3>
                        {stats ? (
                            <div className="space-y-8">
                                <ProfileMetric icon={Code} label="Deployed Units" value={stats.totalProjects} color="var(--accent-blue)" />
                                <ProfileMetric icon={Award} label="Total Audits" value={stats.reviewedProjects} color="var(--accent-purple)" />
                                <ProfileMetric icon={Activity} label="System Health" value={`${stats.avgCodeQuality}%`} color="var(--accent-success)" />
                            </div>
                        ) : (
                            <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-[var(--accent-blue)]" /></div>
                        )}
                    </div>

                    <div className="glass-card p-10 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-primary)] border-4 border-[var(--border-color)] flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-[var(--bg-primary)] border-4 border-[var(--accent-blue)] shadow-[0_0_30px_rgba(59,130,246,0.2)] flex items-center justify-center mb-8 relative">
                            <span className="text-3xl font-black">{stats?.avgCodeQuality || 0}%</span>
                            <div className="absolute -bottom-2 bg-[var(--accent-blue)] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Global</div>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4">Unit Rank: Architect</h3>
                        <p className="text-[10px] text-[var(--text-secondary)] font-bold text-center leading-relaxed max-w-[200px]">Current operational health score is based on {stats?.totalBugs || 0} anomaly detections.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileMetric = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center justify-between group cursor-default">
        <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)] group-hover:bg-[var(--bg-secondary)] transition-all">
                <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{label}</span>
        </div>
        <span className="text-xl font-black group-hover:text-[var(--accent-blue)] transition-colors">{value}</span>
    </div>
);

export default Profile;
