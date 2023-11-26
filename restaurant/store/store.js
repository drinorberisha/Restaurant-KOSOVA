// store.js
import { configureStore } from '@reduxjs/toolkit';
import tableTotalsReducer from './features/tableTotalsSlice';

export const store = configureStore({
  reducer: {
    tableTotals: tableTotalsReducer,
    // Add other slice reducers here
  },
});
