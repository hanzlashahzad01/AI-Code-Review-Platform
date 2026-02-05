import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Check, Clock, MessageSquare, ShieldAlert, GitBranch, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPanel = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Poll every minute
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('http://localhost:5000/api/notifications', config);
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    const markAllRead = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put('http://localhost:5000/api/notifications/mark-all', {}, config);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    const markRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/notifications/${id}`, {}, config);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'review_complete': return <ShieldAlert className="h-4 w-4 text-green-500" />;
            case 'comment_added': return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case 'team_invite': return <GitBranch className="h-4 w-4 text-purple-500" />;
            default: return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-all relative"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)]">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-tertiary)]">
                                <h3 className="text-xs font-black uppercase tracking-widest">Global Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-[10px] font-bold text-[var(--accent-blue)] hover:underline">
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-10 text-center opacity-40">
                                        <Bell className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-[10px] font-bold uppercase">No incoming intel</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n._id}
                                            onClick={() => markRead(n._id)}
                                            className={`p-4 border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors relative ${!n.isRead ? 'bg-[var(--accent-blue)]/5' : ''}`}
                                        >
                                            {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-blue)]"></div>}
                                            <div className="flex gap-3">
                                                <div className="mt-1">{getTypeIcon(n.type)}</div>
                                                <div className="flex-1">
                                                    <p className="text-[11px] font-black uppercase mb-1">{n.title}</p>
                                                    <p className="text-xs text-[var(--text-secondary)] leading-tight mb-2">{n.message}</p>
                                                    <div className="flex items-center text-[9px] text-[var(--text-tertiary)] font-bold uppercase">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {new Date(n.createdAt).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationPanel;
