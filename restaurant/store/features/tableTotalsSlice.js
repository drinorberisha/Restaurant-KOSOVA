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
    resetTotals: () => ({}),
    // Add more reducers if needed
  },
});


export const { updateTableTotals,updateTotals ,resetTotals} = tableTotalsSlice.actions;
export default tableTotalsSlice.reducer;
