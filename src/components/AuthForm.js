import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    let data = '';
    try {
      const auth = getAuth();
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error);
    }
  };

  const toggleAccout = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name='email'
          type='text'
          placeholder='Email'
          required
          value={email}
          onChange={onChange}
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          required
          value={password}
          onChange={onChange}
        />
        <input type='submit' value={newAccount ? 'Create Account' : 'Log In'} />
        {error}
      </form>
      <span onClick={toggleAccout}>
        {newAccount ? 'Sing in' : 'create Account'}
      </span>
    </>
  );
};

export default AuthForm;
