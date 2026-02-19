import React, { useCallback } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast'; 

const ProfileDropdown = ({ isOpen, close }) => {
    const { logout } = useAuth();

    const handleLogout = useCallback(async () => {
        await logout();
        toast.success("Logged out successfully!")
        close();
    }, [logout, close]);

    return (
        <div className={`absolute z-50 ${
            isOpen ? 'bottom-full left-2 right-2' : 'bottom-full right-0 w-48 mb-2'
        } bg-slate-800 border border-slate-700 rounded-lg shadow-xl`}>
            <div className="py-1">
                <button
                    onClick={() => {
                        console.log('Account settings clicked');
                        close();
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-700/50 flex cursor-pointer items-center gap-3"
                >
                    <User size={16} className="text-slate-400" />
                    <span className="text-slate-200">Account Settings</span>
                </button>
                <hr className="border-slate-700" />
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileDropdown;
