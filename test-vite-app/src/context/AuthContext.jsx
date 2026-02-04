import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db } from "../services/firebase.config";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user exists in Firestore to get role
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                setUserRole(userDoc.data().role);
            } else {
                // New user - defaulting to 'student' but allowing change later or in a separate flow
                // For now, we'll just save them as pending or force a role selection screen.
                // Let's assume we redirect them to role selection if no role found.
                setUserRole(null);
            }
            return user;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    }

    function logout() {
        return signOut(auth);
    }

    // Function to set role after initial sign up
    async function assignRole(uid, role, name, email) {
        await setDoc(doc(db, "users", uid), {
            role,
            name,
            email,
            createdAt: new Date()
        });
        setUserRole(role);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                } else {
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        loginWithGoogle,
        logout,
        assignRole
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
