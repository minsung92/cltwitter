import React, { useEffect, useState, useRef } from 'react';
import {
  dbService,
  dbAddDoc,
  dbCollection,
  dbGetDocs,
  dbQuery,
  dbOnSnapshot,
  dbOrderBy,
  storageService,
  dbRef,
  dbUploadString,
  dbGetDownloadURL,
} from 'fbase';
import Nweet from '../components/Nweet';
import { v4 as uuidv4 } from 'uuid';
import NweetFactory from 'components/NweetFactory';

const Home = ({ userObj }) => {
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
  return (
    <div className='container'>
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
