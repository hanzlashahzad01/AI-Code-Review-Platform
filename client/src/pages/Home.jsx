import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Shield, Zap, CheckCircle2, ArrowRight, Star, Cpu, Lock, Globe, Terminal, BookOpen, Layers } from 'lucide-react';

const Home = () => {
    const scrollToDocs = () => {
        document.getElementById('docs-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative pt-12">
            {/* Hero Section */}
            <section className="relative pt-20 pb-24 md:pt-28 md:pb-40 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center space-x-2 bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20 px-4 py-2 rounded-full mb-8"
                        >
                            <Star className="h-4 w-4 text-[var(--accent-blue)] fill-[var(--accent-blue)]" />
                            <span className="text-xs font-black uppercase tracking-widest text-[var(--accent-blue)]">Alpha Intelligence v2.0 Released</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
                        >
                            Review Code <br />
                            <span className="text-gradient">Faster than Light</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 leading-relaxed max-w-2xl mx-auto font-medium"
                        >
                            The world's most advanced AI engine for vulnerability detection, performance optimization, and architectural auditing.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                        >
                            <Link
                                to="/signup"
                                className="btn-primary !text-lg !py-4 !px-10 group"
                            >
                                <span>Initialize Engine</span>
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button
                                onClick={scrollToDocs}
                                className="glass-card !bg-[var(--bg-secondary)] hover:!bg-[var(--bg-tertiary)] px-10 py-4 rounded-xl text-lg font-bold transition-all border border-[var(--border-color)] flex items-center justify-center"
                            >
                                View Documentation
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Features Stats */}
            <section className="pb-32 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-24">
                        <StatItem label="Tokens Analyzed" value="1.2B+" />
                        <StatItem label="Vulnerabilities Found" value="850K" />
                        <StatItem label="Success Rate" value="99.9%" />
                        <StatItem label="Latency" value="< 150ms" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-32">
                        <FeatureCard
                            icon={Cpu}
                            title="Neural Engine"
                            desc="Proprietary LLM (Gemini 1.5 Flash) trained on billions of lines of production-grade source code across 40+ languages."
                            color="var(--accent-blue)"
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Military Grade"
                            desc="End-to-end encrypted analysis. Your source code is never stored or used for retraining without permission."
                            color="var(--accent-purple)"
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Global Scale"
                            desc="Seamlessly integrates with your CI/CD pipelines and team workflows for distributed engineering excellence."
                            color="var(--accent-success)"
                        />
                    </div>

                    {/* Simple Documentation Section */}
                    <div id="docs-section" className="pt-20 border-t border-[var(--border-color)] scroll-mt-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black uppercase mb-4">Technical <span className="text-gradient">Specs</span></h2>
                            <p className="text-[var(--text-secondary)] font-medium">How the Intel-Review engine operates at scale.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="glass-card p-10">
                                <div className="flex items-center space-x-4 mb-6">
                                    <Terminal className="h-6 w-6 text-[var(--accent-blue)]" />
                                    <h3 className="text-xl font-black uppercase">Core Protocol</h3>
                                </div>
                                <ul className="space-y-4 text-sm text-[var(--text-secondary)] font-bold">
                                    <li className="flex items-start"><CheckCircle2 className="h-4 w-4 mr-3 text-[var(--accent-success)] mt-0.5" /> Static Analysis via Multi-Layered Heuristics</li>
                                    <li className="flex items-start"><CheckCircle2 className="h-4 w-4 mr-3 text-[var(--accent-success)] mt-0.5" /> Pattern Matching for OWASP Top 10 vulnerabilities</li>
                                    <li className="flex items-start"><CheckCircle2 className="h-4 w-4 mr-3 text-[var(--accent-success)] mt-0.5" /> Real-time context awareness for JSX/TSX environments</li>
                                </ul>
                            </div>

                            <div className="glass-card p-10">
                                <div className="flex items-center space-x-4 mb-6">
                                    <Layers className="h-6 w-6 text-[var(--accent-purple)]" />
                                    <h3 className="text-xl font-black uppercase">Data Ingestion</h3>
                                </div>
                                <ul className="space-y-4 text-sm text-[var(--text-secondary)] font-bold">
                                    <li className="flex items-start"><CheckCircle2 className="h-4 w-4 mr-3 text-[var(--accent-success)] mt-0.5" /> Recursive ZIP extraction for full project scope</li>
                                    <li className="flex items-start"><CheckCircle2 className="h-4 w-4 mr-3 text-[var(--accent-success)] mt-0.5" /> Chunked processing for massive codebases</li>
                                    <li className="flex items-start"><CheckCircle2 className="h-4 w-4 mr-3 text-[var(--accent-success)] mt-0.5" /> Multi-language auto-detection and isolation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const StatItem = ({ label, value }) => (
    <div className="text-center p-8 glass-card border-none bg-transparent">
        <p className="text-4xl font-black mb-2 tracking-tight">{value}</p>
        <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">{label}</p>
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-card p-10 hover:border-b-4 transition-all duration-300"
        style={{ borderBottomColor: color }}
    >
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-8 border border-[var(--border-color)]">
            <Icon className="h-8 w-8" style={{ color }} />
        </div>
        <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
            {desc}
        </p>
    </motion.div>
);

export default Home;
