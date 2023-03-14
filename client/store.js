import { configureStore } from '@reduxjs/toolkit';
import user from './userSlice';
import test from './testSlice';
import dashboard from './dashboardSlice';
import log from './logSlice';

const store = configureStore({
  reducer: {
    test,
    user,
    dashboard,
    log,
  },
});
export default store;
