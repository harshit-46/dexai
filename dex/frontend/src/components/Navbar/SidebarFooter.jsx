import React, { useState, useEffect } from 'react';
import { CircleUserRound } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../../context/AuthContext';

const SidebarFooter = ({ isOpen }) => {
    const { user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const closeDropdown = (e) => {
            if (!e.target.closest('.profile-dropdown')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', closeDropdown);
        return () => document.removeEventListener('mousedown', closeDropdown);
    }, []);

    return (
        <div className="p-4 relative profile-dropdown">
            {isOpen ? (
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-full border-2 border-slate-600 overflow-hidden bg-slate-700 flex items-center justify-center">
                        {!imgError && user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user?.displayName}
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <CircleUserRound size={20} className="text-slate-400" />
                        )}
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-slate-200">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                </button>
            ) : (
                <div className="flex justify-center">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="p-1 rounded-full transition-all duration-200"
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-slate-600 bg-slate-700 flex items-center justify-center overflow-hidden">
                            {!imgError && user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user?.displayName}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <CircleUserRound size={20} className="text-slate-400" />
                            )}
                        </div>
                    </button>
                </div>
            )}
            {dropdownOpen && (
                <div className={isOpen ? '' : 'absolute bottom-0 left-full ml-34'}>
                    <ProfileDropdown isOpen={isOpen} close={() => setDropdownOpen(false)} />
                </div>
            )}
        </div>
    );
};

export default SidebarFooter;



/*

import React, { useState, useEffect } from 'react';
import { CircleUserRound } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../../context/AuthContext';

const SidebarFooter = ({ isOpen }) => {
    const { user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const closeDropdown = (e) => {
            if (!e.target.closest('.profile-dropdown')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', closeDropdown);
        return () => document.removeEventListener('mousedown', closeDropdown);
    }, []);

    const Avatar = (
        <div className="w-10 h-10 rounded-full border-2 border-slate-600 bg-slate-700 flex items-center justify-center overflow-hidden">
            {!imgError && user?.photoURL ? (
                <img
                    src={user.photoURL}
                    alt={user?.displayName}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <CircleUserRound size={20} className="text-slate-400" />
            )}
        </div>
    );

    return (
        <div className="p-4 relative profile-dropdown">
            {isOpen ? (
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer"
                >
                    {Avatar}
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-slate-200">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                </button>
            ) : (
                <div className="flex justify-center">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-700/50 transition-all duration-200"
                    >
                        {Avatar}
                    </button>
                </div>
            )}

            {dropdownOpen && (
                <div
                    className={`z-50 ${isOpen
                        ? 'absolute bottom-full mb-2 left-4'
                        : 'absolute bottom-2 left-full ml-2'
                    }`}
                >
                    <ProfileDropdown isOpen={isOpen} close={() => setDropdownOpen(false)} />
                </div>
            )}
        </div>
    );
};

export default SidebarFooter;


*/