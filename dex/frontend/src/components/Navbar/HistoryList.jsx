import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebase';
import { useAuth } from '../../context/AuthContext';
import {
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

const HistoryList = ({ isOpen, onSelect }) => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'users', user.uid, 'history'),
                    orderBy('createdAt', 'desc')
                );
                const snapshot = await getDocs(q);
                const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setHistory(results);
            } catch (err) {
                toast.error("Error loading history!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'history', id));
            setHistory(prev => prev.filter(item => item.id !== id));
            toast.success("Deleted");
        } catch (err) {
            toast.error("Failed to delete");
            console.error(err);
        }
    };

    const handleEdit = async (id) => {
        try {
            await updateDoc(doc(db, 'users', user.uid, 'history', id), { prompt: editText });
            setHistory(prev =>
                prev.map(item => item.id === id ? { ...item, prompt: editText } : item)
            );
            setEditingId(null);
            toast.success("Updated");
        } catch (err) {
            toast.error("Update failed");
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="flex flex-col max-h-[600px]">
            <style dangerouslySetInnerHTML={{
                __html: `
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `
            }} />
            {history.length > 0 ? (
                <>
                    <div className="px-4 pt-2 pb-1 flex-shrink-0">
                        <p className="text-xs text-gray-400">Recents</p>
                    </div>
                    <div 
                        className="flex-1 overflow-y-auto px-4 pb-2 hide-scrollbar"
                        style={{
                            scrollbarWidth: 'none', /* Firefox */
                            msOverflowStyle: 'none' /* IE and Edge */
                        }}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {history.map(item => (
                                    <li
                                        key={item.id}
                                        className="cursor-pointer p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 relative"
                                    >
                                        {editingId === item.id ? (
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    className="flex-1 bg-transparent border-b border-slate-500 text-white focus:outline-none text-sm"
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                />
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="text-green-400 text-sm cursor-pointer"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <p
                                                    className="text-sm text-slate-300 truncate cursor-pointer"
                                                    onClick={() => onSelect?.(item)}
                                                    title={item.prompt}
                                                >
                                                    {item.prompt}
                                                </p>
                                                <div className="relative">
                                                    <MoreHorizontal
                                                        size={18}
                                                        className="cursor-pointer hover:text-slate-100"
                                                        onClick={() =>
                                                            setOpenMenuId(
                                                                openMenuId === item.id ? null : item.id
                                                            )
                                                        }
                                                    />
                                                    {openMenuId === item.id && (
                                                        <div className="absolute p-2 right-0 mt-2 w-28 bg-slate-700 text-white rounded-md shadow-lg z-10 border border-slate-600">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingId(item.id);
                                                                    setEditText(item.prompt);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="flex items-center w-full px-3 py-2 hover:bg-slate-600 rounded-md text-sm cursor-pointer"
                                                            >
                                                                <Pencil size={14} className="mr-2" /> Rename
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(item.id);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="flex items-center w-full px-3 py-2 hover:bg-red-600 rounded-md text-sm cursor-pointer"
                                                            >
                                                                <Trash2 size={14} className="mr-2" /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            ) : (
                <div className="text-sm text-gray-500 p-4">No history yet.</div>
            )}
        </div>
    );
};

export default HistoryList;