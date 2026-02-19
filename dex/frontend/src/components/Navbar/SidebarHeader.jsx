import React, { useState } from 'react';
import {
    SquarePen,
    PanelLeft,
    ArrowLeftToLine,
    ArrowRightToLine
} from 'lucide-react';

const SidebarHeader = ({ isOpen, setIsOpen, onNewChat, isLoading = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleNewChat = () => {
        onNewChat?.();
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={handleToggle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer flex-shrink-0"
                    title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    aria-pressed={isOpen}
                >
                    <div className="transition-transform duration-200 ease-in-out">
                        {isHovered
                            ? isOpen
                                ? <ArrowLeftToLine size={20} className="text-slate-300 group-hover:text-white transition-colors duration-200" />
                                : <ArrowRightToLine size={20} className="text-slate-300 group-hover:text-white transition-colors duration-200" />
                            : <PanelLeft size={20} className="text-slate-300 group-hover:text-white transition-colors duration-200" />
                        }
                    </div>
                </button>

                <h1 className={`
            text-xl font-bold text-white whitespace-nowrap
            transition-all duration-300 ease-in-out
            ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
        `}>
                    Dex
                </h1>
            </div>

            <button
                onClick={handleNewChat}
                disabled={isLoading}
                className={`
            w-full flex items-center gap-3 px-3 py-2.5 
            cursor-pointer rounded-lg
            transition-all duration-200 font-medium
            hover:border-slate-500 hover:bg-slate-700/30
            focus:outline-none 
            disabled:opacity-50 disabled:cursor-not-allowed
            text-slate-200 hover:text-white
            ${!isOpen && 'justify-center'}
        `}
                title="Start a new conversation"
                aria-label="Start a new conversation"
            >
                <SquarePen
                    size={20}
                    className={`transition-all duration-200 flex-shrink-0 ${isLoading ? 'animate-spin' : ''}`}
                />
                <span className={`
            transition-all duration-300 ease-in-out
            ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'}
        `}>
                    {isLoading ? 'Starting...' : 'New Chat'}
                </span>
            </button>
        </div>
    );
};

export default SidebarHeader;




/*


import React, { useState } from 'react';
import {
    SquarePen,
    PanelLeft,
    ArrowLeftToLine,
    ArrowRightToLine
} from 'lucide-react';

const SidebarHeader = ({ isOpen, setIsOpen, onNewChat, isLoading = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleNewChat = () => {
        console.log("New chat clicked!");
        onNewChat?.();
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyDown = (e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    let IconComponent = PanelLeft;
    if (isHovered) {
        IconComponent = isOpen ? ArrowLeftToLine : ArrowRightToLine;
    }

    return (
        <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={handleToggle}
                    onKeyDown={(e) => handleKeyDown(e, handleToggle)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-700/50 focus:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 group cursor-pointer"
                    title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    aria-pressed={isOpen}
                >
                    <IconComponent
                        size={20}
                        className="text-slate-300 group-hover:text-white group-focus:text-white transition-colors duration-200"
                    />
                </button>
                
                <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}
                `}>
                    <h1 className="text-xl font-bold text-white whitespace-nowrap">
                        Dex
                    </h1>
                </div>
            </div>

            <button
                onClick={handleNewChat}
                onKeyDown={(e) => handleKeyDown(e, handleNewChat)}
                disabled={isLoading}
                className={`
                    w-full h-10 flex items-center gap-3 px-3 
                    cursor-pointer rounded-lg border border-transparent
                    transition-all duration-200 font-medium
                    hover:border-slate-500 hover:bg-slate-700/30
                    focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 focus:border-slate-500 focus:bg-slate-700/30
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:bg-transparent
                    text-slate-200 hover:text-white focus:text-white
                    ${!isOpen && 'justify-center'}
                `}
                title="Start a new conversation"
                aria-label="Start a new conversation"
            >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <SquarePen
                        size={20}
                        className={`transition-all duration-200 ${isLoading ? 'animate-pulse' : ''}`}
                    />
                </div>
                <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}
                `}>
                    <span className="whitespace-nowrap">
                        {isLoading ? 'Starting...' : 'New Chat'}
                    </span>
                </div>
            </button>
        </div>
    );
};

export default SidebarHeader;

*/