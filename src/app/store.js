import { configureStore } from '@reduxjs/toolkit';
import noteBookReducer from '../features/notesSlice';

export const store = configureStore({
  reducer: {
    notebook : noteBookReducer
  },
});
