import {createSlice} from '@reduxjs/toolkit';
import {IBoardingHouse} from '../../interfaces';

export interface IBoardingHouseState {
  boardingHouses: IBoardingHouse[];
}

const initialState: IBoardingHouseState = {
  boardingHouses: [],
};

const boardingHouseSlice = createSlice({
  name: 'boardingHouse',
  initialState,
  reducers: {
    setBoardingHouses(state, action) {
      state.boardingHouses = action.payload;
    },
  },
});

export const {setBoardingHouses} = boardingHouseSlice.actions;
export default boardingHouseSlice.reducer;
