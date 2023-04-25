import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

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
  const tooggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    const NweetTextRef = doc(dbService, 'nweets', `${nweetObj.id}`);
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              placeholder='Edit your mind?'
              value={newNweet}
              required
              onChange={onChange}
            />
            <input type='submit' value='Update' />
          </form>
          <button onClick={tooggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} width='50px' height='50px' />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={tooggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
