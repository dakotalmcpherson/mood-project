import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const slice = createSlice({
  name: 'dashboard',
  initialState: {
    activities: {},
    avgIndex: 65,
    showDash: true,
  },
  reducers: {
    addactivites: (state, action) => {
      console.log('action', action)
      state.activities = action.payload[1]
      state.avgIndex = action.payload[0]
    },
    toggleDash: (state, action) => {
      state.showDash = action.payload;
    },
  },
});

export default slice.reducer;

export const { addactivites, toggleDash } = slice.actions;

// export const loggingMyStuff = (val) => {
//   console.log(val);
// };

export const getUserDashboard = () => async (dispatch) => {
  const result = await axios.get('/api/correlations/1');
  dispatch(addactivites(result.data));
};
