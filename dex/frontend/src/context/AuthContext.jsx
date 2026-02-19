import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    onAuthStateChanged,
    signOut,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = () => signOut(auth);

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString()
                });
            }

            toast.success(`Welcome, ${user.displayName}!`);
            return user;
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                console.warn('User closed the sign-in popup.');
            } else {
                toast.error('Google sign-in failed.');
                console.error('Google Sign-In Error:', error.message);
            }
            throw error;
        }
    };


    return (
        <AuthContext.Provider value={{ user, loading, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
