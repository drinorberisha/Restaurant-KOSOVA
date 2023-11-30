// userTableSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userTableSlice = createSlice({
  name: 'userTable',
  initialState: {},
  reducers: {
    setUserTableMapping: (state, action) => {
      return action.payload;
    },
    clearUserTableMapping: () => {
      return {};
    },
  },
});

export const { setUserTableMapping, clearUserTableMapping } = userTableSlice.actions;
export default userTableSlice.reducer;
