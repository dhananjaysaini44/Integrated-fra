import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedReport: 'claims',
  reportData: [
    { month: 'Jan', claims: 20, approved: 15, rejected: 5 },
    { month: 'Feb', claims: 25, approved: 20, rejected: 5 },
    { month: 'Mar', claims: 30, approved: 25, rejected: 5 },
    { month: 'Apr', claims: 35, approved: 28, rejected: 7 },
  ],
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setSelectedReport: (state, action) => {
      state.selectedReport = action.payload;
    },
    setReportData: (state, action) => {
      state.reportData = action.payload;
    },
    clearReportsError: (state) => {
      state.error = null;
    },
  },
});

export const { setSelectedReport, setReportData, clearReportsError } = reportsSlice.actions;
export default reportsSlice.reducer;
