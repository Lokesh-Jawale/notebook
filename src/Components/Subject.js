import './Subject.css';
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
import { saveSubject, deleteSubject, selectCurrentSubject,  setCurrentSubject } from '../features/notesSlice';
import { selectSubjectsList, emptyTopicsList } from '../features/notesSlice';

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

function Subject() {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const dispatch = useDispatch();
    const subjectsList = useSelector(selectSubjectsList);
    const currentSubject = useSelector(selectCurrentSubject);

    useEffect(() => {
        // Fetching realtime (Subjects document) data from database
        db.collection("notebooks")
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.id, " ", doc.data());
                    dispatch(saveSubject(doc.id));
                });
            });
    }, [])

    const handleChange = (event) => {
        setSubject(event.target.value);
        if(event.target.value?.length > 0){
            dispatch(setCurrentSubject(event.target.value));
            dispatch(emptyTopicsList([]));
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseAdd = () => {
        // Adding New Subject to database
        if(subject?.length > 0 && currentSubject!== subject){
            db.collection("notebooks")
                .doc(subject)
                .set({});
            dispatch(setCurrentSubject(subject));
        }
        setOpen(false);
    };

    const handleCloseEdit = () => {
        let position = subjectsList.indexOf(subject);
        if(subject?.length > 0 && position === -1){
            // console.log("UPDating ", subject);
            var temp = currentSubject;
            var tempSub = subject;

            // adding edited subject to the database
            db.collection("notebooks").doc(subject).set({});

            // Adding data of old subject name to edited subject name document
            db.collection("notebooks").doc(temp)
                .collection("topics")
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log("Adding data ",doc.id, " => ", doc.data());
                        db.collection("notebooks").doc(tempSub)
                            .collection("topics")
                            .doc(doc.id).set({note: doc.data().note});
                    });
                });
            
            // deleting data of old subject document from database
            db.collection("notebooks").doc(temp)
                .collection("topics")
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log("Deleting ", doc.id, " => ", doc.data());
                        db.collection("notebooks").doc(temp)
                            .collection("topics")
                            .doc(doc.id)
                            .delete();
                    });

                    // saving the current subject and deleting the 
                    // old subject document from database
                    dispatch(saveSubject(tempSub));
                    dispatch(setCurrentSubject(tempSub));
                    db.collection("notebooks").doc(temp).delete();
                    dispatch(deleteSubject(temp));
                    // console.log("At end current subject is ", currentSubject);
                });

        }
        if(position !== -1){
            alert(subject + " subject already exists. Choose different name");
        }
        dispatch(setCurrentSubject(subject));
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteCurrentSubject = () => {
        // function to delete current subject
        if(currentSubject?.length > 0){
            db.collection("notebooks").doc(currentSubject).delete();
            dispatch(deleteSubject(currentSubject));
        }
    }

  return (
    <div className="subject">
        
        {/* Subject selection, adding, editing, deletion form */}
        <div className="subject__form">

            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Add Subject</InputLabel>
                <Select
                    value={currentSubject}
                    onChange={handleChange}
                >
                    {subjectsList.map(item => (
                        (subjectsList?.length > 0) 
                        ? <MenuItem style={{overflowX: "auto"}} value={item}>{item}</MenuItem>
                        : <MenuItem value=""><em>None</em></MenuItem>
                    ))}
                    
                </Select>
            </FormControl>

            <div className= "subject__buttons">
                <IconButton className="subject__addButton" onClick={handleClickOpen}>
                    <AddBoxIcon style={{ color: green[500] }} fontSize="medium" />
                </IconButton>

                <IconButton className="subject__editButton" onClick={handleClickOpen}>
                    <EditIcon color="primary" fontSize="medium" />
                </IconButton>

                <IconButton className="subject__deleteButton" onClick={deleteCurrentSubject}>
                    <DeleteIcon color="secondary" fontSize="medium" />      
                </IconButton>
            </div>
        </div>


        {/* Action Dialog Box (For adding or editing) */}
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add or Edit a Subject</DialogTitle>
            <DialogContent>
                <form className={classes.container}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="demo-dialog-native">Subject</InputLabel>
                        <Input value={subject} onChange={e => setSubject(e.target.value)}/>
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

export default Subject;
