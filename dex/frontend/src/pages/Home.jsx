import React, { useRef, useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import Sidebar from '../components/Navbar/Sidebar';

const Home = () => {
    const editorRef = useRef(); 
    const [selectedItem, setSelectedItem] = useState(null);

    const handleNewChat = () => {
        setSelectedItem(null);
        editorRef.current?.clearEditor(); 
    };

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="flex-1 flex overflow-hidden">
                <Sidebar
                    onSelect={(item) => {
                        console.log('Sending prompt:', item);
                        setSelectedItem(item);
                    }}
                    onNewChat={handleNewChat}
                />
                <div className="flex-1 overflow-auto">
                    <CodeEditor ref={editorRef} selectedItem={selectedItem} />
                </div>
            </div>
        </div>
    );
};

export default Home;
