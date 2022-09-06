import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IsEqualCustomizer} from 'lodash';
import {ISession} from '../../interfaces';

export interface ISessionState {
  currentSession: ISession | null;
}

const initialState: ISessionState = {
  currentSession: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCurrentSession(state, action) {
      state.currentSession = action.payload;
    },
  },
});

export const {setCurrentSession} = sessionSlice.actions;
export default sessionSlice.reducer;
