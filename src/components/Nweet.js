import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = confirm('정말 삭제 하시겠습니까??');
    if (ok) {
      const NweetTextRef = doc(dbService, 'nweets', `${nweetObj.id}`);
      await deleteDoc(NweetTextRef);
      await deleteObject(ref(storageService, nweetObj.attachmentUrl));
    }
  };
  const onChange = (e) => {
    setNewNweet(e.target.value);
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    const NweetTextRef = doc(dbService, 'nweets', `${nweetObj.id}`);
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };
  return (
    <div className='nweet'>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className='container nweetEdit'>
            <input
              type='text'
              placeholder='Edit your mind?'
              value={newNweet}
              required
              onChange={onChange}
              autoFocus
              className='formInput'
            />
            <input type='submit' value='Update Nweet' className='formBtn' />
          </form>
          <span onClick={toggleEditing} className='formBtn cancelBtn'>
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
          {isOwner && (
            <duv className='nweet__actions'>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </duv>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
