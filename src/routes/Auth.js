import React from 'react';
import AuthForm from 'components/AuthForm';
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faGoogle,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

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
    <div className='authContainer'>
      <FontAwesomeIcon
        icon={faTwitter}
        color={'#04AAFF'}
        size='3x'
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className='authBtns'>
        <button onClick={onSocialClick} name='google' className='authBtn'>
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name='github' className='authBtn'>
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};
export default Auth;
