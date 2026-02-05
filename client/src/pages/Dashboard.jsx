import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
    Plus, Code, Calendar, ArrowRight, Loader2, TrendingUp,
    AlertTriangle, CheckCircle, BarChart3, Filter, Search,
    Briefcase, Activity, ShieldCheck, Zap, X, FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // New Project State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [codeContent, setCodeContent] = useState('');
    const [file, setFile] = useState(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [projectsRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/projects', config),
                axios.get('http://localhost:5000/api/stats', config)
            ]);
            setProjects(projectsRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('language', language);
            if (file) formData.append('file', file);
            else formData.append('codeContent', codeContent);

            await axios.post('http://localhost:5000/api/projects', formData, config);
            setCreating(false);
            setShowModal(false);
            fetchData();
            setName(''); setDescription(''); setCodeContent(''); setFile(null);
        } catch (error) {
            console.error(error);
            setCreating(false);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.language.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin h-12 w-12 text-[var(--accent-blue)]" />
        </div>
    );

    const severityData = stats ? [
        { name: 'High', value: stats.bugsBySeverity.High || 0, color: '#ef4444' },
        { name: 'Medium', value: stats.bugsBySeverity.Medium || 0, color: '#f59e0b' },
        { name: 'Low', value: stats.bugsBySeverity.Low || 0, color: '#3b82f6' },
    ] : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase">System <span className="text-gradient">Intelligence</span></h1>
                    <div className="flex items-center space-x-2 text-[var(--text-secondary)] font-bold text-xs">
                        <Activity className="h-4 w-4 text-[var(--accent-success)]" />
                        <span>GRID STATUS: ACTIVE • OPERATOR: {user.username.toUpperCase()}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-blue)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Fetch repository..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[var(--accent-blue)]/50 outline-none w-64 transition-all font-bold"
                        />
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="h-5 w-5 mr-2" /><span>New Deployment</span></button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard icon={Briefcase} title="Total Repos" value={stats?.totalProjects || 0} color="var(--accent-blue)" delay={0} />
                <StatCard icon={AlertTriangle} title="Total Vulns" value={stats?.totalBugs || 0} color="var(--accent-warning)" delay={0.1} />
                <StatCard icon={ShieldCheck} title="Health Score" value={`${stats?.avgCodeQuality || 0}%`} color="var(--accent-success)" delay={0.2} />
                <StatCard icon={Zap} title="Analyzed" value={stats?.reviewedProjects || 0} color="var(--accent-purple)" delay={0.3} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 glass-card p-8">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-[var(--border-color)] pb-4">Security Velocity</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'W1', v: 40 }, { name: 'W2', v: 30 }, { name: 'W3', v: 65 }, { name: 'W4', v: stats?.avgCodeQuality || 85 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="v" stroke="var(--accent-blue)" strokeWidth={3} fillOpacity={0.1} fill="var(--accent-blue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8 flex flex-col items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-[var(--border-color)] w-full pb-4">Severity Scan</h3>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={severityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {severityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black">{stats?.totalBugs || 0}</span>
                            <span className="text-[10px] text-[var(--text-secondary)] font-black uppercase">Vulns</span>
                        </div>
                    </div>
                    <div className="w-full space-y-3 mt-6">
                        {severityData.map(item => (
                            <div key={item.name} className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }} />{item.name} Level</span>
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-black uppercase tracking-[0.2em] mb-8 border-l-4 border-[var(--accent-blue)] pl-4">Active Repository Grid</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, i) => (
                        <ProjectCard key={project._id} project={project} index={i} />
                    ))}
                    {filteredProjects.length === 0 && (
                        <div className="col-span-full py-20 text-center glass-card border-dashed">
                            <p className="text-[var(--text-secondary)] font-black uppercase tracking-widest">No matching repositories found in Sector 01</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-8 w-full max-w-2xl relative z-10">
                            <h2 className="text-2xl font-black uppercase mb-8 tracking-tighter">Initialize <span className="text-gradient">Deployment</span></h2>
                            <form onSubmit={handleCreateProject} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Target Repo Name</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-[var(--accent-blue)]/50 outline-none font-bold" placeholder="e.g. quantum-core-api" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Language Engine</label>
                                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-3.5 text-sm outline-none font-bold">
                                            <option value="javascript">JS / NODE</option><option value="python">PYTHON</option><option value="java">JAVA</option><option value="cpp">C++</option><option value="go">GOLANG</option><option value="rust">RUST</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Payload (ZIP or Code File)</label>
                                    <div className="flex flex-col space-y-4">
                                        <label className="h-32 border-2 border-[var(--border-color)] border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--bg-tertiary)] transition-all">
                                            <FileCode className="h-8 w-8 mb-2 text-[var(--accent-blue)]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Select Archive / Source</span>
                                            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                                        </label>
                                        {file && <div className="text-xs font-black uppercase text-[var(--accent-blue)] flex items-center"><Check className="h-3 w-3 mr-2" /> Payload Ready: {file.name}</div>}
                                        {!file && <textarea value={codeContent} onChange={(e) => setCodeContent(e.target.value)} placeholder="// Internal source injection..." className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-4 text-xs font-mono h-40 outline-none" required={!file} />}
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-[var(--bg-tertiary)] hover:bg-black text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest">Abort</button>
                                    <button type="submit" disabled={creating} className="flex-1 btn-primary !py-4 !text-xs !uppercase !tracking-widest">{creating ? 'Processing...' : 'Finalize Deployment'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value, color, delay }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="glass-card p-6 flex items-center space-x-4">
        <div className="p-3 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]"><Icon className="h-6 w-6" style={{ color }} /></div>
        <div>
            <p className="text-[9px] uppercase font-black tracking-widest text-[var(--text-secondary)] mb-1">{title}</p>
            <p className="text-xl font-black">{value}</p>
        </div>
    </motion.div>
);

const ProjectCard = ({ project, index }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all group">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)] text-[var(--accent-blue)]"><Code className="h-6 w-6" /></div>
            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-[var(--bg-tertiary)] rounded-full border border-[var(--border-color)]">{project.language}</span>
        </div>
        <h3 className="text-lg font-black mb-2 group-hover:text-[var(--accent-blue)] transition-colors uppercase tracking-tight">{project.name}</h3>
        <p className="text-[var(--text-secondary)] text-xs mb-6 line-clamp-2 leading-relaxed font-bold">{project.description || "Experimental repository node structure."}</p>
        <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
            <div className="flex items-center text-[10px] font-black text-[var(--text-secondary)] uppercase"><Calendar className="h-3 w-3 mr-1" /> {new Date(project.createdAt).toLocaleDateString()}</div>
            <Link to={`/project/${project._id}`} className="text-[10px] font-black uppercase text-[var(--accent-blue)] hover:underline flex items-center">Grid Detail <ArrowRight className="h-3 w-3 ml-1" /></Link>
        </div>
    </motion.div>
);

export default Dashboard;
