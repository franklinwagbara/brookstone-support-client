import {createSlice} from '@reduxjs/toolkit';
import {IClassroomEnrollment} from '../../interfaces';

export interface IClassroomEnrollmentState {
  classroomEnrollments: IClassroomEnrollment[];
}

const initialState: IClassroomEnrollmentState = {
  classroomEnrollments: [],
};

const classroomEnrollmentSlice = createSlice({
  name: 'classroomEnrollment',
  initialState,
  reducers: {
    setClassroomEnrollments(state, action) {
      state.classroomEnrollments = action.payload;
    },
  },
});

export const {setClassroomEnrollments} = classroomEnrollmentSlice.actions;
export default classroomEnrollmentSlice.reducer;
