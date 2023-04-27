import AuthForm from 'components/AuthForm';
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import React, { useState } from 'react';

const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    const auth = getAuth();
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(auth, provider);
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name='google'>
          Continue with Google
        </button>
        <button onClick={onSocialClick} name='github'>
          Continue with GitHub
        </button>
      </div>
    </div>
  );
};
export default Auth;
