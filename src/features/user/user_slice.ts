import {createSlice} from '@reduxjs/toolkit';
import {IUser} from '../../interfaces';

export interface IUserState {
  users: IUser[];
}

const initialState: IUserState = {
  users: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const {setUsers} = userSlice.actions;
export default userSlice.reducer;
