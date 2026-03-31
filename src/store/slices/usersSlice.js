import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userService from '../../services/userService';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers();
      return response.users || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, userData);
      return response.user || { id, ...userData };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

const upsertUser = (items, user) => {
  const index = items.findIndex((item) => String(item.id) === String(user.id));
  if (index >= 0) {
    items[index] = { ...items[index], ...user };
    return;
  }
  items.push(user);
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        upsertUser(state.items, action.payload);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => String(item.id) !== String(action.payload));
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
