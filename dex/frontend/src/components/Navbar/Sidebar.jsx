import React, { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import HistoryList from './HistoryList';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ onSelect, onNewChat }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="h-screen flex text-white relative">
            <div className={`transition-all duration-300 ease-in-out flex flex-col bg-[#040F16] backdrop-blur-sm border-r border-gray-600/50 ${isOpen ? 'w-72' : 'w-16'}`}>
                <SidebarHeader isOpen={isOpen} setIsOpen={setIsOpen} onNewChat={onNewChat} />
                <div className="flex-1 overflow-hidden">
                    <HistoryList isOpen={isOpen} onSelect={onSelect} />
                </div>
                <SidebarFooter isOpen={isOpen} />
            </div>
        </div>
    );
};

export default React.memo(Sidebar);