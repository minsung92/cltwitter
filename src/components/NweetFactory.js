import React, { useState, useRef } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState('');
  const fileInput = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const attachmentRef = dbRef(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await dbUploadString(
        attachmentRef,
        attachment,
        'data_url'
      );
      attachmentUrl = await dbGetDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbAddDoc(dbCollection(dbService, 'nweets'), nweetObj);
    setNweet('');
  };
  const onChange = (e) => {
    setNweet(e.target.value);
  };
  const onFileChage = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        value={nweet}
        type='text'
        placeholder="What's on your mind"
        maxLength={120}
        onChange={onChange}
      />
      <input
        type='file'
        accept='image/*'
        onChange={onFileChage}
        ref={fileInput}
      />
      <input type='submit' value='Nweet' />
      {attachment && (
        <div>
          <img src={attachment} width='50px' height='50px' />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
