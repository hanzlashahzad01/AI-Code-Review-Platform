import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Code2, LogOut, User, Sun, Moon, LayoutDashboard, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationPanel from './NotificationPanel';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass-card !rounded-none border-t-0 border-x-0 sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex items-center space-x-3 group animate-in fade-in slide-in-from-left duration-700">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Code2 className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight">
                            Code<span className="text-gradient font-black">AI</span>
                        </span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        {user && (
                            <div className="hidden md:flex items-center space-x-8 mr-4">
                                <Link
                                    to="/dashboard"
                                    className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </div>
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`nav-link ${isActive('/profile') ? 'nav-link-active' : ''}`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <UserCircle className="h-4 w-4" />
                                        <span>Profile</span>
                                    </div>
                                </Link>
                            </div>
                        )}

                        <div className="flex items-center space-x-4">
                            <NotificationPanel />

                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-all duration-300 active:scale-95"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            {user ? (
                                <div className="flex items-center space-x-4 pl-4 border-l border-[var(--border-color)]">
                                    <div className="flex flex-col items-end mr-2 hidden sm:flex">
                                        <span className="text-sm font-bold leading-tight">{user.username}</span>
                                        <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-bold">Pro Dev</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className="nav-link font-bold text-sm"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="btn-primary !py-2 !px-5 text-sm"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
