import {createSlice} from '@reduxjs/toolkit';
import {ISubject} from '../../interfaces';

export interface ISubjectState {
  subjects: ISubject[];
}

const initialState: ISubjectState = {
  subjects: [],
};

const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    setSubjects(state, action) {
      state.subjects = action.payload;
    },
  },
});

export const {setSubjects} = subjectSlice.actions;
export default subjectSlice.reducer;
