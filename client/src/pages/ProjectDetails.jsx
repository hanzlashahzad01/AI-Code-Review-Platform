import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
    Play, Download, Loader2, Users, MessageSquare, GitBranch,
    History, Send, X, Plus, Check, AlertTriangle, Clock, User,
    FileCode, Server, Terminal, ShieldAlert, Bug, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [project, setProject] = useState(null);
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    const [activeTab, setActiveTab] = useState('review');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [selectedLine, setSelectedLine] = useState(null);
    const [collaborators, setCollaborators] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('viewer');
    const [versions, setVersions] = useState([]);
    const [pullRequests, setPullRequests] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, [id]);

    const fetchAllData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [projectRes, reviewsRes, commentsRes, collaboratorsRes, versionsRes, prsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/projects/${id}`, config),
                axios.get(`http://localhost:5000/api/reviews/${id}`, config).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/api/comments/${id}`, config).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/api/collaborators/${id}`, config).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/api/versions/${id}`, config).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/api/pull-requests/${id}`, config).catch(() => ({ data: [] }))
            ]);

            setProject(projectRes.data);
            if (reviewsRes.data && reviewsRes.data.length > 0) setReview(reviewsRes.data[0]);
            setComments(commentsRes.data || []);
            setCollaborators(collaboratorsRes.data || []);
            setVersions(versionsRes.data || []);
            setPullRequests(prsRes.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false);
        }
    };

    const runAnalysis = async () => {
        setAnalyzing(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(`http://localhost:5000/api/reviews/${id}/analyze`, {}, config);
            setReview(res.data);
            if (editorRef.current && monacoRef.current) updateEditorDecorations(editorRef.current, monacoRef.current, res.data.bugs);
            setAnalyzing(false);
        } catch (error) {
            console.error("Analysis failed", error);
            setAnalyzing(false);
            alert(error.response?.data?.message || "Analysis cycle failed. Verify key or project scope.");
        }
    };

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        if (review && review.bugs) updateEditorDecorations(editor, monaco, review.bugs);
        editor.onMouseDown((e) => {
            if (e.target.position) setSelectedLine(e.target.position.lineNumber);
        });
    };

    const updateEditorDecorations = (editor, monaco, bugs) => {
        if (!bugs) return;
        const markers = bugs.map(bug => ({
            startLineNumber: bug.line,
            startColumn: 1,
            endLineNumber: bug.line,
            endColumn: 1000,
            message: `${bug.issue} - ${bug.suggestion}`,
            severity: bug.severity === 'High' ? monaco.MarkerSeverity.Error :
                bug.severity === 'Medium' ? monaco.MarkerSeverity.Warning :
                    monaco.MarkerSeverity.Info
        }));
        monaco.editor.setModelMarkers(editor.getModel(), 'owner', markers);
    };

    const onBugClick = (line) => {
        if (editorRef.current) {
            editorRef.current.revealLineInCenter(line);
            editorRef.current.setPosition({ lineNumber: line, column: 1 });
            editorRef.current.focus();
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(`http://localhost:5000/api/comments/${id}`, {
                content: newComment,
                lineNumber: selectedLine
            }, config);
            setComments([res.data, ...comments]);
            setNewComment('');
            setSelectedLine(null);
        } catch (error) {
            console.error(error);
        }
    };

    const inviteCollaborator = async () => {
        if (!inviteEmail.trim()) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(`http://localhost:5000/api/collaborators/${id}/invite`, {
                email: inviteEmail,
                role: inviteRole
            }, config);
            setCollaborators([...collaborators, res.data]);
            setInviteEmail('');
            alert('Unit recruited successfully.');
        } catch (error) {
            alert(error.response?.data?.message || 'Recruitment failed.');
        }
    };

    const downloadPDF = () => {
        try {
            if (!review || !project) {
                console.warn("Download attempted without review or project data");
                return;
            }

            console.log("Generating PDF for project:", project.name);
            const doc = new jsPDF();

            // Header
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text('Code Analysis Report', 14, 22);

            // Project Metadata
            doc.setFontSize(12);
            doc.setTextColor(100, 116, 139);
            doc.text(`Project: ${project.name}`, 14, 32);
            doc.text(`Language: ${project.language}`, 14, 38);
            doc.text(`Quality Score: ${review.score}/100`, 14, 44);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 50);

            // Anomaly Table
            if (review.bugs && review.bugs.length > 0) {
                const tableData = review.bugs.map(bug => [
                    bug.line?.toString() || 'N/A',
                    bug.severity?.toUpperCase() || 'INFO',
                    bug.category?.toUpperCase() || 'GENERAL',
                    bug.issue || 'No description',
                    bug.suggestion || 'No suggestion'
                ]);

                autoTable(doc, {
                    startY: 60,
                    head: [['Line', 'Severity', 'Category', 'Anomaly', 'Remedy']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [59, 130, 246] },
                    styles: { fontSize: 8 },
                    columnStyles: {
                        0: { cellWidth: 12 },
                        1: { cellWidth: 20 },
                        2: { cellWidth: 25 },
                        3: { cellWidth: 'auto' },
                        4: { cellWidth: 'auto' }
                    }
                });
            } else {
                doc.text('No anomalies found in this session.', 14, 60);
            }

            const fileName = `${project.name.replace(/\s+/g, '_')}_Report.pdf`;
            doc.save(fileName);
            console.log("PDF saved as:", fileName);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. Check console for details.");
        }
    };

    if (loading) return (
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
            <Loader2 className="animate-spin h-12 w-12 text-[var(--accent-blue)]" />
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
            <div className="flex-1 flex flex-col border-r border-[var(--border-color)]">
                <div className="h-16 flex items-center justify-between px-6 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                    <div className="flex items-center space-x-4">
                        <Terminal className="h-5 w-5 text-[var(--accent-blue)]" />
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest">{project.name}</h2>
                            <p className="text-[10px] text-[var(--text-secondary)] font-bold">{project.language.toUpperCase()} ENGINE ACTIVE</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {review && (
                            <div className="flex items-center space-x-4 mr-4 px-4 border-r border-[var(--border-color)]">
                                <span className={`text-sm font-black ${review.score >= 80 ? 'text-[var(--accent-success)]' : 'text-[var(--accent-warning)]'}`}>
                                    {review.score}%
                                </span>
                                <button onClick={downloadPDF} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                    <Download className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        <button onClick={runAnalysis} disabled={analyzing} className="btn-primary !py-2 !px-4 !text-xs !rounded-lg">
                            {analyzing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                            <span>{review ? 'Recalibrate' : 'Initiate Analysis'}</span>
                        </button>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        language={project.language}
                        value={project.codeContent}
                        options={{ readOnly: true, minimap: { enabled: true }, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: { top: 20 } }}
                        onMount={handleEditorDidMount}
                    />
                </div>
            </div>

            <div className="w-full lg:w-[450px] bg-[var(--bg-secondary)] flex flex-col">
                <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
                    <TabButton icon={ShieldAlert} active={activeTab === 'review'} onClick={() => setActiveTab('review')} label="Anomalies" />
                    <TabButton icon={MessageSquare} active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} label="Ops Logs" />
                    <TabButton icon={Users} active={activeTab === 'collaborators'} onClick={() => setActiveTab('collaborators')} label="Team" />
                    <TabButton icon={History} active={activeTab === 'versions'} onClick={() => setActiveTab('versions')} label="History" />
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-mesh">
                    <AnimatePresence mode="wait">
                        {activeTab === 'review' && (
                            <motion.div key="review" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                {!review ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                        <Bug className="h-16 w-16 mb-4" />
                                        <p className="text-sm font-bold uppercase tracking-widest">Awaiting Analysis...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="glass-card p-5 border-l-4 border-l-[var(--accent-blue)]">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Technical Overview</h4>
                                            <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{review.aiAnalysis}</p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] pl-2">System Alerts ({review.bugs.length})</h4>
                                            {review.bugs.map((bug, i) => (
                                                <AnomalyItem key={i} bug={bug} onClick={() => onBugClick(bug.line)} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'comments' && (
                            <motion.div key="comments" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <div className="glass-card p-4 space-y-4">
                                    {selectedLine && <div className="flex items-center justify-between text-[10px] font-bold text-[var(--accent-blue)] uppercase"><span>L{selectedLine} Selected</span><X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLine(null)} /></div>}
                                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Enter operational log..." className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[var(--accent-blue)]/50 outline-none h-24 resize-none" />
                                    <button onClick={addComment} className="btn-primary !w-full !py-2 !text-xs">Transmit Log</button>
                                </div>
                                <div className="space-y-4">
                                    {comments.map((comment, i) => (
                                        <div key={i} className="glass-card p-4">
                                            <div className="flex items-center justify-between mb-3"><div className="flex items-center space-x-2"><div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-color)]"><User className="h-3 w-3 text-[var(--accent-blue)]" /></div><span className="text-xs font-black uppercase">{comment.user?.username}</span></div>{comment.lineNumber && <span className="text-[10px] font-bold text-[var(--text-secondary)]">L{comment.lineNumber}</span>}</div>
                                            <p className="text-[13px] text-[var(--text-secondary)]">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'collaborators' && (
                            <motion.div key="collaborators" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                {project.owner === user._id && (
                                    <div className="glass-card p-5 space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Recruit Unit</h4>
                                        <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Email Address..." className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-3 text-sm outline-none" />
                                        <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-3 text-sm outline-none">
                                            <option value="viewer">Viewer</option><option value="editor">Editor</option><option value="admin">Admin</option>
                                        </select>
                                        <button onClick={inviteCollaborator} className="btn-primary !w-full !py-2 !text-xs">Initialize Recruitment</button>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] pl-2">Active Units ({collaborators.length})</h4>
                                    {collaborators.map((collab, i) => (
                                        <div key={i} className="glass-card p-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3"><div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-color)] text-[var(--accent-blue)]"><User className="h-4 w-4" /></div><div><p className="text-xs font-black uppercase">{collab.user?.username}</p><p className="text-[10px] text-[var(--text-secondary)]">{collab.role.toUpperCase()}</p></div></div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'versions' && (
                            <motion.div key="versions" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] pl-2">Execution History</h4>
                                    {versions.length === 0 ? <p className="text-center text-xs opacity-40">No snapshots recorded.</p> : versions.map((v, i) => (
                                        <div key={i} className="glass-card p-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3"><History className="h-4 w-4 text-[var(--accent-blue)]" /><div><p className="text-xs font-black uppercase">v{v.versionNumber}</p><p className="text-[10px] text-[var(--text-secondary)]">{new Date(v.createdAt).toLocaleDateString()}</p></div></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]">Active</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ icon: Icon, active, onClick, label }) => (
    <button onClick={onClick} className={`flex-none flex items-center space-x-2 px-6 py-4 transition-all border-b-2 ${active ? 'bg-[var(--accent-blue)]/5 border-[var(--accent-blue)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
        <Icon className={`h-4 w-4 ${active ? 'text-[var(--accent-blue)]' : ''}`} /><span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
);

const AnomalyItem = ({ bug, onClick }) => (
    <div onClick={onClick} className="glass-card p-4 cursor-pointer hover:border-[var(--accent-blue)]/50 transition-all group">
        <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1.5">
                <span className={`w-fit text-[9px] font-black px-2 py-0.5 rounded-full border ${bug.severity === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-500' : bug.severity === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                    {bug.severity.toUpperCase()} ALERT
                </span>
                {bug.category && (
                    <span className="text-[9px] font-bold text-[var(--accent-blue)] uppercase tracking-tighter opacity-70 italic">
                        # {bug.category}
                    </span>
                )}
            </div>
            <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase group-hover:text-[var(--accent-blue)]">Line {bug.line}</span>
        </div>
        <p className="text-[13px] font-bold mb-3 leading-snug group-hover:text-[var(--accent-blue)] transition-colors">{bug.issue}</p>
        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]">
            <p className="text-[11px] text-[var(--text-secondary)]">
                <span className="text-[var(--accent-success)] font-black mr-1 underline text-[9px]">SOL_PROPOSAL:</span> {bug.suggestion}
            </p>
        </div>
    </div>
);

export default ProjectDetails;
