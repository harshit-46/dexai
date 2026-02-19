import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../utils/firebase';

const Auth = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { signup, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isSignup) {
                const userCredential = await signup(email, password);
                const user = userCredential.user;

                // 🔐 Send email verification
                await sendEmailVerification(user);

                // 🚀 Navigate to verify page
                navigate('/verify');
            } else {
                await login(email, password);

                // ✅ Navigate only if email is verified
                if (!auth.currentUser.emailVerified) {
                    setError('Please verify your email before logging in.');
                    return;
                }

                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-4">
            <div className="bg-[#121212] shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {isSignup ? 'Create an Account' : 'Sign In to DEX.AI'}
                </h2>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="bg-[#1f1f1f] p-3 rounded-md border border-gray-700 focus:outline-none text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="bg-[#1f1f1f] p-3 rounded-md border border-gray-700 focus:outline-none text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 transition py-2 rounded-md font-semibold"
                    >
                        {isSignup ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-purple-400 hover:underline font-medium"
                    >
                        {isSignup ? 'Log In' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
