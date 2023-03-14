import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { addactivites } from './dashboardSlice';

// Slice
const slice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      // state.user = action.payload;
      state.isAuthenticated = action.payload;
    },
    logoutSuccess: (state, action) => {
      state.user = null;
    },
    // updateNewLogActivities: (state, action) => {
    //   state.newLog.activities.push(action.payload);
    // },
  },
});
export default slice.reducer;
// Actions
export const { loginSuccess, logoutSuccess, updateNewLogActivities } =
  slice.actions;

export const login = (username, password) => async (dispatch) => {
  try {
    const result = await axios({
      method: 'post',
      url: '/api/verifyuser',
      data: {
        username: username,
        password: password,
      },
    });
    const dashboardResults = await axios.get('/api/correlations/test');
    console.log(dashboardResults.data[1])
    dispatch(loginSuccess(result.data));
    dispatch(addactivites(dashboardResults.data));
  } catch (e) {
    return console.error(e.message);
  }
};
export const logout = () => async (dispatch) => {
  try {
    return dispatch(logoutSuccess());
  } catch (e) {
    return console.error(e.message);
  }
};
