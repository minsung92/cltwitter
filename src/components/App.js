import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService, UpdateProfile } from 'fbase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

console.log(authService);
function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.displayName === null) {
          const name = user.email.split('@')[0];
          user.displayName = name;
        }
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          email: user.email,
          updateProfile: (args) =>
            UpdateProfile(user, { displayName: user.displayName }),
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = (newDisplayName) => {
    const user = getAuth().currentUser;
    console.log(user);
    setUserObj({
      displayName: newDisplayName,
      uid: user.uid,
      email: user.email,
      updateProfile: (args) =>
        UpdateProfile(user, { displayName: user.displayName }),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        'Initializing...'
      )}
      <footer>&copy; {new Date().getFullYear()} Cltwitter</footer>
    </>
  );
}

export default App;
