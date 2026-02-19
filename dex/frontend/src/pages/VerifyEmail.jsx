/*


import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';

const VerifyEmail = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(async () => {
            const user = auth.currentUser;
            if (user) {
                await user.reload();
                if (user.emailVerified) {
                    clearInterval(interval);
                    navigate('/dashboard');
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white text-center p-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">📩 Check Your Email</h2>
                <p className="text-gray-400">
                    We've sent a verification link to your email address. <br />
                    Please verify your email and come back to this page.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    Once verified, you’ll be redirected automatically to your dashboard.
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;


*/





import React, { useState, useEffect, useCallback } from 'react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Brain, AlertCircle, CheckCircle, RefreshCw, ArrowLeft, Clock, Shield } from "lucide-react";
import aiCodingBackground from "../assets/cover.png";
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isCheckingVerification, setIsCheckingVerification] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Countdown timer for resend cooldown
    useEffect(() => {
        let interval = null;
        if (resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown(time => time - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendCooldown]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const user = auth.currentUser;
            if (user) {
                await user.reload();
                if (user.emailVerified) {
                    clearInterval(interval);
                    navigate('/dashboard');
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [navigate]);

    // Redirect if no user or already verified
    useEffect(() => {
        if (!currentUser) {
            navigate('/signup');
            return;
        }
        
        if (currentUser.emailVerified) {
            navigate('/dashboard');
            return;
        }
    }, [currentUser, navigate]);

    const clearError = useCallback(() => {
        if (error) setError('');
    }, [error]);

    const handleResendVerification = async () => {
        if (!currentUser || resendCooldown > 0) return;
        
        setError('');
        setIsResending(true);
        
        try {
            await sendEmailVerification(currentUser, {
                url: `${window.location.origin}/dashboard`,
                handleCodeInApp: false,
            });
            
            toast.success('Verification email sent successfully!');
            setResendCooldown(60); // 60 second cooldown
        } catch (err) {
            let errorMessage = 'Failed to send verification email';
            if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please wait before trying again';
                setResendCooldown(120); // 2 minute cooldown for rate limiting
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection';
            }
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckVerification = async () => {
        if (!currentUser) return;
        
        setError('');
        setIsCheckingVerification(true);
        
        try {
            await currentUser.reload();
            
            if (currentUser.emailVerified) {
                toast.success('Email verified successfully!');
                navigate('/dashboard');
            } else {
                setError('Email not yet verified. Please check your email and click the verification link.');
            }
        } catch (err) {
            setError('Failed to check verification status. Please try again.');
        } finally {
            setIsCheckingVerification(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/signup');
        } catch (err) {
            console.error('Sign out error:', err);
        }
    };

    const handleBackToSignup = () => {
        navigate('/signup');
    };

    if (!currentUser) {
        return null;
    }

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
                                Verify Your Email
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base">
                                We've sent a verification link to your email address
                            </p>
                        </div>
                    </header>

                    <Card className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
                        <CardHeader className="space-y-2 pb-4">
                            <CardTitle className="text-xl font-semibold text-center text-white">
                                Check Your Email
                            </CardTitle>
                            <CardDescription className="text-center text-gray-400 text-sm">
                                We've sent a verification link to{" "}
                                <span className="text-white font-medium break-all">
                                    {currentUser?.email}
                                </span>
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex flex-col items-center space-y-4 py-4">
                                <div className="p-4 rounded-full bg-blue-500/20 border border-blue-500/30">
                                    <Mail className="h-12 w-12 text-blue-400" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-semibold text-white">
                                        Verification Email Sent
                                    </h3>
                                    <p className="text-gray-400 text-sm max-w-sm">
                                        Click the verification link in your email to activate your account and start using Dex.ai.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg p-3">
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium text-white mb-1">Step 1: Check your inbox</p>
                                            <p className="text-gray-300 text-xs">
                                                Look for an email from Dex.ai with the subject "Verify your email address"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg p-3">
                                    <div className="flex items-start space-x-3">
                                        <Mail className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium text-white mb-1">Step 2: Click the link</p>
                                            <p className="text-gray-300 text-xs">
                                                Click "Verify Email Address" in the email to confirm your account
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg p-3">
                                    <div className="flex items-start space-x-3">
                                        <Shield className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium text-white mb-1">Step 3: Access your account</p>
                                            <p className="text-gray-300 text-xs">
                                                Return here and click "I've verified my email" to continue
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg text-sm">
                                <div className="flex items-start space-x-2">
                                    <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium mb-1">Didn't receive the email?</p>
                                        <p className="text-xs text-blue-300">
                                            Check your spam folder, or wait a few minutes and try resending the verification email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-3 pt-2">
                            <Button
                                onClick={handleCheckVerification}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isCheckingVerification}
                            >
                                {isCheckingVerification ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Checking...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        I've verified my email
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleResendVerification}
                                variant="outline"
                                className="w-full border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isResending || resendCooldown > 0}
                            >
                                {isResending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : resendCooldown > 0 ? (
                                    <>
                                        <Clock className="w-4 h-4 mr-2" />
                                        Resend in {resendCooldown}s
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Resend verification email
                                    </>
                                )}
                            </Button>

                            <div className="flex flex-col space-y-2 w-full">
                                <Button
                                    onClick={handleSignOut}
                                    variant="ghost"
                                    className="w-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 h-10"
                                >
                                    Sign out and use different email
                                </Button>

                                <Button
                                    onClick={handleBackToSignup}
                                    variant="ghost"
                                    className="w-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 h-10"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to sign up
                                </Button>
                            </div>
                        </CardFooter>
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

                <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
                    <div className="max-w-lg space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Secure Account Setup
                            </h2>
                            <p className="text-xl text-white/80 leading-relaxed">
                                Email verification ensures your account is secure and helps us keep your AI coding workspace safe.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                            <div className="flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Shield className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="font-medium">Account Security</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                                <span className="font-medium">Email Verification</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <Brain className="h-5 w-5 text-purple-400" />
                                </div>
                                <span className="font-medium">AI Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;