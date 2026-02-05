import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Loader2, ArrowRight, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await register(username, email, password);
        if (res.success) navigate('/dashboard');
        else setError(res.message);
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full max-w-[520px]"
            >
                <div className="glass-card p-10 md:p-12 border-[var(--border-color)]">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-2xl mb-6 border border-[var(--border-color)] shadow-inner">
                            <Cpu className="h-10 w-10 text-[var(--accent-purple)]" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">Recruit <span className="text-[var(--accent-purple)]">Operator</span></h2>
                        <p className="text-[var(--text-secondary)] font-medium text-sm">Deploy your profile to the global intelligence network.</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-8 text-xs font-bold uppercase tracking-widest text-center"
                            >
                                Deployment Failed: {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-1">Callsign</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] h-5 w-5 group-focus-within:text-[var(--accent-purple)] transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all font-medium"
                                    placeholder="johndoe_01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-1">Network Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] h-5 w-5 group-focus-within:text-[var(--accent-purple)] transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all font-medium"
                                    placeholder="operator@nexus.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-1">Security Cipher</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] h-5 w-5 group-focus-within:text-[var(--accent-purple)] transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 active:scale-95 flex items-center justify-center w-full group disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span className="uppercase font-black tracking-widest text-sm">Initialize Deployment</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-[var(--border-color)] text-center">
                        <p className="text-sm text-[var(--text-secondary)] font-medium">
                            Existing operator?{' '}
                            <Link to="/login" className="text-[var(--accent-purple)] hover:underline font-black uppercase tracking-tighter">
                                Access Grid
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
