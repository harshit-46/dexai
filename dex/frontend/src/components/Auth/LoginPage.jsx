import React, { useState, useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Sparkles, Code2, Brain, Mail, Lock, AlertCircle } from "lucide-react";
import aiCodingBackground from "../../assets/cover.png";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();

    const clearError = useCallback(() => {
        if (error) setError('');
    }, [error]);

    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
        clearError();
    }, [clearError]);

    const handlePasswordChange = useCallback((e) => {
        setPassword(e.target.value);
        clearError();
    }, [clearError]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const validateForm = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            let errorMessage = 'An error occurred during sign in';
            if (err.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address';
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later';
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsGoogleLoading(true);

        try {
            const user = await loginWithGoogle();
            if (user) {
                navigate('/dashboard');
            }
        } catch (err) {
            let errorMessage = 'Failed to sign in with Google';
            if (err.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign in was cancelled';
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection';
            }
            setError(errorMessage);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgotpassword');
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md space-y-8">
                    <header className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <div className="relative">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform duration-200">
                                    <Brain className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Dex.ai
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                Welcome Back
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Sign in to continue your AI coding journey
                            </p>
                        </div>
                    </header>

                    <Card className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-5">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                            autoComplete="email"
                                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 pl-10 h-11 transition-all duration-200 hover:bg-gray-700/70"
                                            disabled={isLoading || isGoogleLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-white text-sm font-medium">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                            autoComplete="current-password"
                                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 pl-10 pr-10 h-11 transition-all duration-200 hover:bg-gray-700/70"
                                            disabled={isLoading || isGoogleLoading}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent group"
                                            onClick={togglePasswordVisibility}
                                            disabled={isLoading || isGoogleLoading}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-blue-400 hover:text-purple-400 text-sm transition-colors duration-200 hover:underline bg-transparent border-none cursor-pointer"
                                        onClick={handleForgotPassword}
                                        disabled={isLoading || isGoogleLoading}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4 pt-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium cursor-pointer transition-all duration-200 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading || isGoogleLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                        </>
                                    )}
                                </Button>

                                <div className="relative flex items-center w-full">
                                    <div className="flex-grow border-t border-gray-600"></div>
                                    <span className="px-3 text-gray-400 text-sm bg-gray-800/80">or</span>
                                    <div className="flex-grow border-t border-gray-600"></div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleLogin}
                                    className="w-full border-gray-600 text-black hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-all duration-200 h-11 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading || isGoogleLoading}
                                >
                                    {isGoogleLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-2" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Continue with Google
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-sm text-gray-400">
                                    Don't have an account?{" "}
                                    <Link to="/signup" className="text-blue-400 hover:text-purple-400 font-medium transition-colors duration-200 hover:underline">
                                        Create your account
                                    </Link>
                                </p>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${aiCodingBackground})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-2000" />

                {/* Centered Content */}
                <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white h-full w-full">
                    <div className="max-w-lg space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Your AI Code Companion
                            </h2>
                            <p className="text-xl text-white/80 leading-relaxed">
                                Enhance your coding experience with intelligent assistance, smart suggestions, and automated workflows.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                            <div className="flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Sparkles className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="font-medium">Smart AI Assistance</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <Code2 className="h-5 w-5 text-purple-400" />
                                </div>
                                <span className="font-medium">Code Generation</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                <div className="p-2 rounded-lg bg-cyan-500/20">
                                    <Brain className="h-5 w-5 text-cyan-400" />
                                </div>
                                <span className="font-medium">Continuous Learning</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;