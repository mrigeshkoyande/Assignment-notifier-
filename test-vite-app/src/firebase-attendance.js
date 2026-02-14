/**
 * Firebase Integration Helper
 * Connects the lightweight attendance system with Firebase Auth
 * 
 * Usage:
 * 1. Import this module in your Firebase auth page
 * 2. After user logs in, call initAttendanceWithFirebase(user)
 * 3. Attendance system will automatically use Firebase user data
 */

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Your Firebase config (UPDATE THESE)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Initialize attendance system with Firebase user
 * Call this after successful login
 */
export function initAttendanceWithFirebase(user) {
    if (!user) {
        console.error('No user provided');
        return;
    }

    // Set user info in attendance system
    if (window.setUserInfo) {
        window.setUserInfo(
            user.uid,              // userId
            user.displayName || 'User',  // userName
            user.email || ''       // userEmail
        );
        console.log('Attendance system initialized with Firebase user:', user.uid);
    } else {
        console.warn('Attendance system not loaded yet');
    }
}

/**
 * Monitor auth state and update attendance system accordingly
 */
export function setupAuthListener() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            initAttendanceWithFirebase(user);
        } else {
            console.log('User logged out');
        }
    });
}

/**
 * Example: How to use in your login page
 */
export async function handleFirebaseLogin(_email, _password) {
    try {
        // Your login code here
        // const result = await signInWithEmailAndPassword(auth, _email, _password);
        // initAttendanceWithFirebase(result.user);
    } catch (error) {
        console.error('Login error:', error);
    }
}

/**
 * Example: How to use in your signup page
 */
export async function handleFirebaseSignup(_email, _password, _displayName) {
    try {
        // Your signup code here
        // const result = await createUserWithEmailAndPassword(auth, _email, _password);
        // await updateProfile(result.user, { displayName: _displayName });
        // initAttendanceWithFirebase(result.user);
    } catch (error) {
        console.error('Signup error:', error);
    }
}

/**
 * Initialize Firebase in your main app
 */
export function initializeFirebase() {
    setupAuthListener();
    return auth;
}

export default auth;

/*
 * INTEGRATION STEPS:
 * 
 * 1. Copy this file to: src/firebase-attendance.js
 * 
 * 2. Update firebaseConfig with your Firebase credentials
 * 
 * 3. In your auth page (login/signup), import this:
 *    import { initAttendanceWithFirebase } from './firebase-attendance.js';
 * 
 * 4. After successful login, call:
 *    initAttendanceWithFirebase(user);
 * 
 * 5. Or use the setupAuthListener for automatic updates:
 *    import { setupAuthListener } from './firebase-attendance.js';
 *    setupAuthListener(); // Call once in your app
 * 
 * EXAMPLE - In your Login component:
 * 
 * function LoginPage() {
 *     async function handleLogin(email, password) {
 *         const result = await signIn(email, password);
 *         // NEW: Initialize attendance with Firebase user
 *         initAttendanceWithFirebase(result.user);
 *         navigate('/student-dashboard');
 *     }
 * }
 */
