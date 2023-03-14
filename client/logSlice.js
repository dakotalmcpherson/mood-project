import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'log',
  initialState: {
    newLog: { activities: [], index: null },
  },
  reducers: {
    saveLogToState: (state, action) => {
      state.newLog.activities = [
        ...state.newLog.activities,
        action.payload.activityText,
      ];
      state.newLog.index = action.payload.sliderValue;
    },
  },
});

export default slice.reducer;

export const { saveLogToState } = slice.actions;

// export const loggingMyStuff = (val) => {
//   console.log(val);
// };
