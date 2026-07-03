import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import claimService from '../../services/claimService';

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastFilters: {},
};

export const fetchClaims = createAsyncThunk(
  'claims/fetchClaims',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const claims = await claimService.getClaims(filters);
      return { claims, filters };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch claims');
    }
  }
);

export const submitClaimWithDocs = createAsyncThunk(
  'claims/submitClaimWithDocs',
  async (claimData, { rejectWithValue }) => {
    try {
      return await claimService.createClaimWithDocs(claimData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit claim');
    }
  }
);

export const approveClaim = createAsyncThunk(
  'claims/approveClaim',
  async (id, { rejectWithValue }) => {
    try {
      return await claimService.approveClaim(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to approve claim');
    }
  }
);

export const rejectClaim = createAsyncThunk(
  'claims/rejectClaim',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      return await claimService.rejectClaim(id, reason);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject claim');
    }
  }
);

export const deleteClaim = createAsyncThunk(
  'claims/deleteClaim',
  async (id, { rejectWithValue }) => {
    try {
      await claimService.deleteClaim(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete claim');
    }
  }
);

const upsertClaim = (items, claim) => {
  const index = items.findIndex((item) => item.id === claim.id);
  if (index >= 0) {
    items[index] = claim;
    return;
  }
  items.unshift(claim);
};

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    clearClaimsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.claims;
        state.lastFilters = action.payload.filters;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(submitClaimWithDocs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitClaimWithDocs.fulfilled, (state, action) => {
        state.loading = false;
        upsertClaim(state.items, action.payload);
      })
      .addCase(submitClaimWithDocs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(approveClaim.fulfilled, (state, action) => {
        upsertClaim(state.items, action.payload);
      })
      .addCase(approveClaim.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(rejectClaim.fulfilled, (state, action) => {
        upsertClaim(state.items, action.payload);
      })
      .addCase(rejectClaim.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteClaim.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteClaim.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearClaimsError } = claimsSlice.actions;
export default claimsSlice.reducer;
