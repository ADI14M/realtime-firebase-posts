import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthForm from "./components/AuthForm";
import NewPostForm from "./components/NewPostForm";
import PostsList from "./components/PostsList";

function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Sign-out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Sign out failed", err);
      alert("Failed to sign out — see console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Realtime Posts</h1>
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">{user.email}</span>
                <button
                  className="px-3 py-1 border rounded"
                  onClick={handleSignOut}
                >
                  Logout
                </button>
              </div>
            ) : (
              <span className="text-sm text-gray-500">Not signed in</span>
            )}
          </div>
        </header>

        {!ready ? (
          <p>Loading...</p>
        ) : !user ? (
          <AuthForm />
        ) : (
          <div className="space-y-4">
            <NewPostForm user={user} />
            <PostsList currentUser={user} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
