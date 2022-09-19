import {createSlice} from '@reduxjs/toolkit';
import {IBehaviour} from '../../interfaces';

export interface IBehaviourState {
  behaviours: IBehaviour[];
}

const initialState: IBehaviourState = {
  behaviours: [],
};

const behaviourSlice = createSlice({
  name: 'behaviour',
  initialState,
  reducers: {
    setBehaviours(state, action) {
      state.behaviours = action.payload;
    },
  },
});

export const {setBehaviours} = behaviourSlice.actions;
export default behaviourSlice.reducer;
