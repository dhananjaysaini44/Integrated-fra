import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import alertsService from '../../services/alertsService';

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastFilters: {},
};

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const alerts = await alertsService.getAlerts(filters);
      return { alerts, filters };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch alerts');
    }
  }
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearAlertsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.alerts;
        state.lastFilters = action.payload.filters;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearAlertsError } = alertsSlice.actions;
export default alertsSlice.reducer;
