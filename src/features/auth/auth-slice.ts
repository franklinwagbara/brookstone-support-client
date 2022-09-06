import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IsEqualCustomizer} from 'lodash';
import {IUser} from '../../interfaces';

export interface IAuthState {
  currentUser: IUser | null;
}

const initialState: IAuthState = {
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
});

export const {setCurrentUser} = authSlice.actions;
export default authSlice.reducer;
