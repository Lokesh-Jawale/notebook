import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    note: "",
    subjectsList: [],
    topicsList: [],
    currentSubject: '',
    currentTopic: "",
}

const notesSlice = createSlice({
    name: 'notebook',
    initialState,
    reducers: {
        saveSubject: (state, action) => {
            let position = state.subjectsList.indexOf(action.payload);
            if(position === -1){
                state.subjectsList.push(action.payload);
                if(state.currentSubject === '') 
                    state.currentSubject = action.payload;
                state.topicsList = [];
            }
        },

        deleteSubject: (state, action) => {
            let position = state.subjectsList.indexOf(action.payload);
            if(position !== -1){
                state.subjectsList.splice(position, 1);
                state.currentSubject = state.subjectsList[0];
            }
        },

        saveTopic: (state, action) => {
            let position = state.topicsList.indexOf(action.payload);
            if(position === -1){
                state.topicsList.push(action.payload);
                if(state.currentTopic === '') 
                    state.currentTopic = action.payload;
            }
        },

        deleteTopic: (state, action) => {
            let position = state.topicsList.indexOf(action.payload);
            if(position !== -1){
                state.topicsList.splice(position, 1);
                state.currentTopic = state.topicsList[0];
            }
        },

        saveNote: (state, action) => {
            state.note = action.payload;
        },

        setCurrentSubject: (state, action) => {
            state.currentSubject = action.payload;
        },

        setCurrentTopic: (state, action) => {
            state.currentTopic = action.payload;
        },

        emptyTopicsList: (state, action) => {
            state.topicsList = [];
            state.currentTopic = "";
        },
    }
});

export const {
    saveSubject, updateSubjectsList, deleteSubject, 
    saveTopic, updateTopicsList, deleteTopic, 
    saveNote, setCurrentSubject, setCurrentTopic, 
    emptyTopicsList,
} = notesSlice.actions

export const selectSubjectsList = state => state.notebook.subjectsList;
export const selectCurrentSubject = state => state.notebook.currentSubject;
export const selectTopicsList = state => state.notebook.topicsList;
export const selectCurrentTopic = state => state.notebook.currentTopic;
export const selectNote = state => state.notebook.note;

export default notesSlice.reducer;
