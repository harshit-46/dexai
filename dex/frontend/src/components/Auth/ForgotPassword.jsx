import React, { useState, useCallback } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Brain, AlertCircle, CheckCircle, Send } from "lucide-react";
import aiCodingBackground from "../../assets/cover.png";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const clearMessages = useCallback(() => {
        if (error) setError('');
        if (success) setSuccess(false);
    }, [error, success]);

    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
        clearMessages();
    }, [clearMessages]);

    const validateForm = () => {
        if (!email.trim()) {
            setError('Email is required');
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
        setSuccess(false);

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false,
            });
            setSuccess(true);
        } catch (err) {
            let errorMessage = 'An error occurred while sending the reset email';
            if (err.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please try again later';
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection';
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleResendEmail = () => {
        setSuccess(false);
        handleSubmit({ preventDefault: () => { } });
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
                                Reset Password
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base">
                                {success
                                    ? "Check your email for reset instructions"
                                    : "Enter your email to receive a password reset link"
                                }
                            </p>
                        </div>
                    </header>

                    <Card className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
                        <CardHeader className="space-y-2 pb-4">
                            <CardTitle className="text-xl font-semibold text-center text-white">
                                {success ? "Email Sent!" : "Forgot Password"}
                            </CardTitle>
                            <CardDescription className="text-center text-gray-400 text-sm">
                                {success
                                    ? "We've sent a password reset link to your email"
                                    : "No worries, we'll help you reset your password"
                                }
                            </CardDescription>
                        </CardHeader>

                        {success ? (
                            <CardContent className="space-y-6">
                                <div className="flex flex-col items-center space-y-4 py-8">
                                    <div className="p-4 rounded-full bg-green-500/20 border border-green-500/30">
                                        <CheckCircle className="h-12 w-12 text-green-400" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-lg font-semibold text-white">
                                            Check Your Email
                                        </h3>
                                        <p className="text-gray-400 text-sm max-w-sm">
                                            We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
                                            Click the link in the email to reset your password.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg text-sm">
                                    <div className="flex items-start space-x-2">
                                        <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium mb-1">Didn't receive the email?</p>
                                            <p className="text-xs text-blue-300">
                                                Check your spam folder or click "Resend Email" below.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        ) : (
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
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={handleEmailChange}
                                                required
                                                autoComplete="email"
                                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 h-11 transition-all duration-200 hover:bg-gray-700/70"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <Mail className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-gray-300">
                                                <p className="font-medium text-white mb-1">What happens next?</p>
                                                <ul className="space-y-1 text-xs">
                                                    <li>• We'll send a secure reset link to your email</li>
                                                    <li>• Click the link to create a new password</li>
                                                    <li>• Sign in with your new password</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col space-y-4 pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 h-11 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Reset Link
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}

                        <CardFooter className="pt-0">
                            <div className="w-full space-y-4">
                                {success && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleResendEmail}
                                        className="w-full border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 cursor-pointer transition-all duration-200 h-11"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-2" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Resend Email
                                            </>
                                        )}
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleBackToLogin}
                                    className="w-full text-gray-400 hover:text-white cursor-pointer hover:bg-gray-700/50 transition-all duration-200 h-11"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Sign In
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                {/* Background Layers */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${aiCodingBackground})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
                <div className="absolute inset-0 bg-black/20" />

                {/* Decorative Blurs */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000" />

                {/* Centered Content */}
                <div className="relative z-10 flex flex-1 items-center justify-center text-center px-6 py-12 text-white">
                    <div className="max-w-lg mx-auto space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Secure Account Recovery
                            </h2>
                            <p className="text-xl text-white/80 leading-relaxed">
                                Your security is our priority. We'll help you regain access to your AI coding workspace safely.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                            <div className="flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Mail className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="font-medium">Email Verification</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                                <span className="font-medium">Secure Reset</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <Brain className="h-5 w-5 text-purple-400" />
                                </div>
                                <span className="font-medium">Quick Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ForgotPassword;