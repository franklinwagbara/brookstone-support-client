import {createSlice} from '@reduxjs/toolkit';
import {IBoardingEnrollment} from '../../interfaces';

export interface IBoardingEnrollmentState {
  boardingEnrollments: IBoardingEnrollment[];
}

const initialState: IBoardingEnrollmentState = {
  boardingEnrollments: [],
};

const boardingEnrollmentSlice = createSlice({
  name: 'boardingEnrollment',
  initialState,
  reducers: {
    setBoardingEnrollments(state, action) {
      state.boardingEnrollments = action.payload;
    },
  },
});

export const {setBoardingEnrollments} = boardingEnrollmentSlice.actions;
export default boardingEnrollmentSlice.reducer;
