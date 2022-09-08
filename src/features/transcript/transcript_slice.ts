import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IsEqualCustomizer} from 'lodash';
import {IEnrollment} from '../../interfaces';

export interface IEnrollmentState {
  enrollments: IEnrollment[];
}

const initialState: IEnrollmentState = {
  enrollments: [],
};

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    // setEnrollments(state, action) {
    //   state.enrollments = action.payload;
    // },
  },
});

// export const {} = enrollmentSlice.actions;
// export default enrollmentSlice.reducer;
