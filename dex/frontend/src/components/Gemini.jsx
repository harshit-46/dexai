import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';

export default function GeminiChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { type: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const aiMessage = {
                type: 'ai',
                content: data.text,
                timestamp: new Date(),
                metadata: data.metadata
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            setError(err.message);
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">Gemini AI Chat</h1>
                            <p className="text-sm text-gray-500">Powered by Google Gemini 1.5 Flash</p>
                        </div>
                    </div>
                    <button
                        onClick={clearChat}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Clear Chat
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">Welcome to Gemini AI Chat</h3>
                        <p className="text-gray-500">Start a conversation by typing a message below.</p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                                } space-x-3`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                                        ? 'bg-blue-500 ml-3'
                                        : 'bg-purple-500 mr-3'
                                    }`}
                            >
                                {message.type === 'user' ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div
                                className={`px-4 py-3 rounded-2xl ${message.type === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap">{message.content}</div>
                                {message.metadata && (
                                    <div className="text-xs text-gray-400 mt-2">
                                        Response time: {message.metadata.processingTime}ms
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex space-x-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                                    <span className="text-gray-600">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 max-w-md">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <span className="text-red-700 text-sm">{error}</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex space-x-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        rows={1}
                        className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        style={{
                            minHeight: '48px',
                            maxHeight: '120px'
                        }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl px-6 py-3 flex items-center justify-center transition-all disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </div>
            </div>
        </div>
    );
}