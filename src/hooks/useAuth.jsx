import { useState, useEffect, useContext, createContext } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  signOut,
  GoogleAuthProvider,
  EmailAuthProvider,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

// Context for Auth
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign in with Email/Password
  async function signInEmail(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  // Sign up with Email/Password
  async function signUpEmail(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  // Sign in with Google and always prompt for password setup
  async function signInGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user already has email/password linked
      const hasEmailPassword = user.providerData.some(
        provider => provider.providerId === 'password'
      );
      
      if (!hasEmailPassword) {
        // User doesn't have email/password credential - prompt for password setup
        setPendingGoogleUser(user);
        setNeedsPasswordSetup(true);
        return null; // Don't complete sign-in yet
      }
      
      return result;
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GoogleAuthProvider.credentialFromError(error);
        const email = error.customData.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes("password")) {
          const password = prompt("Enter your password to link Google:");
          const emailUser = await signInWithEmailAndPassword(auth, email, password);
          await linkWithCredential(emailUser.user, pendingCred);
          return emailUser;
        } else {
          alert(`Please log in with: ${methods[0]}`);
        }
      } else {
        throw error;
      }
    }
  }

  // Setup password for Google user and link accounts
  async function setupPasswordForGoogleUser(password) {
    if (!pendingGoogleUser) {
      throw new Error("No pending Google user found");
    }

    try {
      // Create email/password credential
      const emailCredential = EmailAuthProvider.credential(
        pendingGoogleUser.email,
        password
      );

      // Link the email/password credential to the Google user
      await linkWithCredential(pendingGoogleUser, emailCredential);

      // Clear pending state
      setPendingGoogleUser(null);
      setNeedsPasswordSetup(false);

      // User is now signed in with linked accounts
      return pendingGoogleUser;
    } catch (error) {
      console.error("Error setting up password:", error);
      throw error;
    }
  }

  // Cancel password setup and sign out
  async function cancelPasswordSetup() {
    if (pendingGoogleUser) {
      await signOut(auth);
    }
    setPendingGoogleUser(null);
    setNeedsPasswordSetup(false);
  }

  // Logout
  async function logout() {
    return await signOut(auth);
  }

  const value = {
    currentUser,
    signInEmail,
    signUpEmail,
    signInGoogle,
    signOut: logout,
    needsPasswordSetup,
    pendingGoogleUser,
    setupPasswordForGoogleUser,
    cancelPasswordSetup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
