import React, { useEffect, useState } from 'react';
import {
  authService,
  dbQuery,
  dbGetDocs,
  dbWhere,
  dbCollection,
  dbService,
  dbOrderBy,
  UpdateProfile,
} from 'fbase';
import { useHistory } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };

  const getMyNweets = async () => {
    const q = dbQuery(
      dbCollection(dbService, 'nweets'),
      dbWhere('creatorId', '==', `${userObj.uid}`),
      dbOrderBy('createdAt', 'desc')
    );
    const querySnapshot = await dbGetDocs(q);
    querySnapshot.forEach((doc) => {
      //console.log(doc.id, '=>', doc.data());
    });
  };

  const onChnge = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const onSubmit = (e) => {
    const user = getAuth().currentUser;
    //console.log(user);
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      // try {
      //   await userObj.updateProfile(user, {
      //     displayName: newDisplayName,
      //   });
      //   refreshUser(newDisplayName); // refreshuser가 쓰이는 부분
      // } catch (err) {
      //   console.log(err);
      // }
      UpdateProfile(user, { displayName: newDisplayName });
      refreshUser(newDisplayName);
    }
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <div className='container'>
      <form onSubmit={onSubmit} className='profileForm'>
        <input
          type='text'
          placeholder='Display Name'
          onChange={onChnge}
          value={newDisplayName}
          autoFocus
          className='formInput'
        />
        <input
          type='submit'
          value='Update Profile'
          className='formBtn'
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className='formBtn cancelBtn logOut' onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
