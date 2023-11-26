// features/tableTotalsSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const tableTotalsSlice = createSlice({
  name: 'tableTotals',
  initialState: {},
  reducers: {
    updateTableTotals: (state, action) => {
      return { ...state, ...action.payload };
    },
    
    updateTotals: (state, action) => {
          return action.payload;
    },
    // Add more reducers if needed
  },
});

export const { updateTableTotals,updateTotals } = tableTotalsSlice.actions;

export default tableTotalsSlice.reducer;
