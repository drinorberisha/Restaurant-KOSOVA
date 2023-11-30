// tableSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tables: new Array(32).fill(null).map((_, index) => ({
    table_id: index + 1,
    table_number: index + 1,
    status: "free",
    current_order_id: null
  })),
};

export const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.tables = action.payload;
    },
    updateTable: (state, action) => {
      const { tableId, updates } = action.payload;
      const tableIndex = state.tables.findIndex(table => table.table_id === tableId);
      if (tableIndex !== -1) {
        state.tables[tableIndex] = { ...state.tables[tableIndex], ...updates };
      }
    },
    // Add other reducers as needed
  },
});

export const { setTables, updateTable } = tableSlice.actions;
export default tableSlice.reducer;
