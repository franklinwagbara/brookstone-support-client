import {createSlice} from '@reduxjs/toolkit';
import {IStudent} from '../../interfaces';

export interface IStudentState {
  students: IStudent[];
}

const initialState: IStudentState = {
  students: [],
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudents(state, action) {
      state.students = action.payload;
    },
  },
});

export const {setStudents} = studentSlice.actions;
export default studentSlice.reducer;
