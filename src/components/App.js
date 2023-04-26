import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
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
        console.log(user);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : 'Initializing...'}
      <footer>&copy; {new Date().getFullYear()} Cltwitter</footer>
    </>
  );
}

export default App;
