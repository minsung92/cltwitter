import React, { useEffect, useState } from 'react';
import { authService, dbQuery, dbGetDocs, dbWhere, dbCollection, dbService, dbOrderBy } from 'fbase';
import { useHistory } from 'react-router-dom';

const Profile = ({ userObj }) => {
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
      console.log(doc.id, '=>', doc.data());
    });
  };

  const onChnge = () => {
    //
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <form>
        <input type="text" placeholder="Display Name" onChange={onChnge} value={newDisplayName} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
