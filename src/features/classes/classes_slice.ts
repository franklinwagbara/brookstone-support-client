import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IClasses} from '../../interfaces';

export interface IEnrollmentState {
  classes: IClasses;
}

const initialState: IEnrollmentState = {
  classes: {},
};

const classesSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    setClasses(state, action) {
      state.classes = action.payload;
    },
  },
});

export const {setClasses} = classesSlice.actions;
export default classesSlice.reducer;
