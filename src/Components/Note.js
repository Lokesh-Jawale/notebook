import React, {useState, useEffect} from 'react';
import './Note.css';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { selectNote, saveNote } from '../features/notesSlice';
import { selectCurrentSubject, selectCurrentTopic } from '../features/notesSlice';
import {db} from '../firebase.js';

function Note() {

    const [inputNote, setInputNote] = useState('');
    const dispatch = useDispatch();
    const note = useSelector(selectNote);
    const currentTopic = useSelector(selectCurrentTopic);
    const currentSubject = useSelector(selectCurrentSubject);

    var dbRef = db.collection("notebooks");

    useEffect(() => {
        // Getting the Notes data of all the topic(docs) from topics collection at one time
        // from Subjects(doc) => topics(collection) => topic(doc) => note: ""
        // If the Topic changes new notes of that Subject's topic will get fetched
        if(currentTopic?.length){
            dbRef.doc(currentSubject)
                .collection("topics")
                .doc(currentTopic)
                .get()
                .then((doc) => {
                    dispatch(saveNote(doc.data().note));
                })
                .catch(error => console.log(error.message));
        }
        else dispatch(saveNote(""));
    }, [currentTopic]);

    const addNote = (e) => {
        e.preventDefault();
        if(inputNote?.length === 0){
            alert("Note is empty Please add something");
        }
        else if(currentTopic?.length){
            dbRef.doc(currentSubject)
                .collection("topics")
                .doc(currentTopic)
                .set({note: inputNote});
            dispatch(saveNote(inputNote));
        }
        setInputNote('');
    }

    const deleteNote = (e) => {
        if(currentTopic?.length){
            dbRef.doc(currentSubject)
                .collection("topics")
                .doc(currentTopic)
                .set({});
            dispatch(saveNote(""));
            alert(currentTopic + "'s note deleted successfully");
        }
    }

    return (
        <div className="note">
            <h2>Notes</h2>

            {/* note text */}
            <div className="note__text">
                {note}
            </div>

            {/* Input area of note */}
            <TextareaAutosize
                className="note__input"
                maxRows={6}
                aria-label="Add notes"
                placeholder="Add notes ..."
                value={inputNote}
                onChange={e => setInputNote(e.target.value)}
            />
    
            <div className="note__button">
                <Button variant="contained" onClick={addNote} disabled={false} color="primary">Add | Edit</Button>
                <Button variant="contained" onClick={deleteNote} disabled={!note} color="secondary">Delete</Button>
            </div>

        </div>
    )
}

export default Note;
