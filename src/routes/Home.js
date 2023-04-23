import React, { useEffect, useState } from 'react';
import {
  dbService,
  dbAddDoc,
  dbCollection,
  dbGetDocs,
  dbQuery,
  dbOnSnapshot,
  dbOrderBy,
} from 'fbase';
import Nweet from '../components/Nweet';

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    const q = dbQuery(
      dbCollection(dbService, 'nweets'),
      dbOrderBy('createdAt', 'desc')
    );
    dbOnSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await dbAddDoc(dbCollection(dbService, 'nweets'), {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    setNweet('');
  };
  const onChange = (e) => {
    setNweet(e.target.value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          type='text'
          placeholder="What's on your mind"
          maxLength={120}
          onChange={onChange}
        />
        <input type='submit' value='Nweet' />
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
