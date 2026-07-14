import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './boardSlice';

const store = configureStore({
  reducer: {
    boards: boardReducer,
  },
});

export default store;