import {createSlice} from '@reduxjs/toolkit';
import {IClassroom} from '../../interfaces';

export interface IClassroomState {
  classrooms: IClassroom[];
}

const initialState: IClassroomState = {
  classrooms: [],
};

const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    setClassrooms(state, action) {
      state.classrooms = action.payload;
    },
  },
});

export const {setClassrooms} = classroomSlice.actions;
export default classroomSlice.reducer;
