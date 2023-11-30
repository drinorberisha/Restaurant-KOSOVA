// store.js
import { configureStore } from '@reduxjs/toolkit';
import tableTotalsReducer from './features/tableTotalsSlice';
import userTableReducer from './features/userTableSlice';
import tableReducer from './features/tableSlice';

export const store = configureStore({
  reducer: {
    tableTotals: tableTotalsReducer,
    userTable: userTableReducer,
    myTables: tableReducer,
  },
});
