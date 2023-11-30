// store.js
import { configureStore } from '@reduxjs/toolkit';
import tableTotalsReducer from './features/tableTotalsSlice';
import userTableReducer from './features/userTableSlice';

export const store = configureStore({
  reducer: {
    tableTotals: tableTotalsReducer,
    userTable: userTableReducer,
    // Add other slice reducers here
  },
});
