import React, { useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

console.log(authService);
function App() {
  const  [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
    <AppRouter isLoggedIn={isLoggedIn} />
    <footer>&copy; {new Date().getFullYear()} Cltwitter</footer>
    </>
  );
}

export default App;
