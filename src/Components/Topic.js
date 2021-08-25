import './Topic.css';
import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { green } from '@material-ui/core/colors';
import {db} from '../firebase.js';

import { useDispatch, useSelector } from 'react-redux';
import { saveTopic, deleteTopic,  setCurrentTopic, emptyTopicsList } from '../features/notesSlice';
import { selectTopicsList, selectCurrentSubject, selectCurrentTopic } from '../features/notesSlice';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 200,
  },
}));

function Topic() {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState('');
    const dispatch = useDispatch();
    const topicsList = useSelector(selectTopicsList);
    const currentTopic = useSelector(selectCurrentTopic);
    const currentSubject = useSelector(selectCurrentSubject);

    var dbRef = db.collection("notebooks");

    useEffect(() => {
        // Fetching realtime (Topics document) from database
        if(currentSubject?.length){
            dbRef.doc(currentSubject)
                .collection("topics")
                .onSnapshot((querySnapshot) => {
                    if(querySnapshot?.size === 0){
                        console.log("TOPIC LIST EMPTY");
                        dispatch(emptyTopicsList([]));
                    }
                    else{
                        querySnapshot.forEach((doc) => {
                            // console.log(doc.id, " ", doc.data());
                            dispatch(saveTopic(doc.id));
                        });
                    }
                });
        }
        else dispatch(emptyTopicsList([]));
    }, [currentSubject]);

    const handleChange = (event) => {
        setTopic(event.target.value);
        if(event.target.value?.length > 0){
            dispatch(setCurrentTopic(event.target.value));
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseAdd = () => {
        if(topic?.length && currentSubject?.length && topic !== currentTopic){
            dbRef.doc(currentSubject)
                .collection("topics")
                .doc(topic)
                .set({note: ""});
            // dispatch(saveSubject(subject));
            dispatch(setCurrentTopic(topic));
        }
        setOpen(false);
    };

    const handleCloseEdit = () => {
        let position = topicsList.indexOf(topic);
        if(topic?.length > 0 && currentTopic !== topic && position === -1){
            dbRef.doc(currentSubject)
                .collection("topics")
                .doc(currentTopic).get()
                .then(function (doc) {
                    if (doc && doc.exists) {
                        var data = doc.data();
                        // deletes the old Subject document
                        dbRef.doc(currentSubject).collection("topics")
                            .doc(currentTopic).delete().then(
                            // saves the data to new Subject document
                            dispatch(deleteTopic(currentTopic)),
                            dbRef.doc(currentSubject).collection("topics")
                                .doc(topic)
                                .set(data)
                        );
                        dispatch(setCurrentTopic(topic));
                    }
            });
        }
        if(position !== -1){
            alert(topic + " topic already exists. Choose different name");
        }
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteCurrentTopic = () => {
        if(currentTopic?.length > 0){
            // delete the current Topic from database as well as state
            dbRef.doc(currentSubject).collection("topics")
            .doc(currentTopic).delete().then(
                dispatch(deleteTopic(currentTopic))
            )
            .catch(error => console.log(error.message));
        }
    }

  return (
    <div className="topic">
        
        {/* Topic selection, adding, editing, deletion form */}
        <div className="topic__form">

            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Add Topic</InputLabel>
                <Select
                    value={currentTopic}
                    onChange={handleChange}
                >
                    {topicsList.map(item => (
                        (topicsList?.length > 0) 
                        ? <MenuItem style={{overflowX: "auto"}} value={item}>{item}</MenuItem>
                        : <MenuItem value=""><em>None</em></MenuItem>
                    ))}
                    
                </Select>
            </FormControl>

            <div className="topic__buttons">
                <IconButton className="topic__addButton" onClick={handleClickOpen}>
                    <AddBoxIcon style={{ color: green[500] }} fontSize="medium" />
                </IconButton>

                <IconButton className="topic__editButton" onClick={handleClickOpen}>
                    <EditIcon color="primary" fontSize="medium" />
                </IconButton>

                <IconButton className="topic__deleteButton" onClick={deleteCurrentTopic}>
                    <DeleteIcon color="secondary" fontSize="medium" />      
                </IconButton>
            </div>
        </div>

        {/* Action Dialog Box (For adding or editing) */}
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add or Edit a Topic</DialogTitle>
            <DialogContent>
                <form className={classes.container}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="demo-dialog-native">Topic</InputLabel>
                        <Input value={topic} onChange={e => setTopic(e.target.value)}/>
                    </FormControl>
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleCloseAdd} color="primary">Add</Button>
                <Button onClick={handleCloseEdit} color="primary">Edit</Button>
            </DialogActions>
        </Dialog>

    </div>
  );
}

export default Topic;
