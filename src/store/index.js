import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import claimsReducer from './slices/claimsSlice';
import alertsReducer from './slices/alertsSlice';
import reportsReducer from './slices/reportsSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    claims: claimsReducer,
    alerts: alertsReducer,
    reports: reportsReducer,
    users: usersReducer,
  },
});
