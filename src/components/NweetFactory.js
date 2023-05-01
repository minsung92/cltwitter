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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState('');
  const fileInput = useRef();

  const onSubmit = async (e) => {
    if (nweet === '') {
      return;
    }
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
    setAttachment('');
    fileInput.current.value = null;
  };
  return (
    <form onSubmit={onSubmit} className='factoryForm'>
      <div className='factoryInput__container'>
        <input
          className='factoryInput__input'
          value={nweet}
          type='text'
          placeholder="What's on your mind"
          maxLength={120}
          onChange={onChange}
        />
        <input type='submit' value='&rarr;' className='factoryInput__arrow' />
      </div>
      <label htmlFor='attach-file' className='factoryInput__label'>
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id='attach-file'
        type='file'
        accept='image/*'
        onChange={onFileChage}
        ref={fileInput}
        style={{
          opacity: 0,
        }}
      />
      <input type='submit' value='Nweet' />
      {attachment && (
        <div className='factoryForm__attachment'>
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className='factoryForm__clear' onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
