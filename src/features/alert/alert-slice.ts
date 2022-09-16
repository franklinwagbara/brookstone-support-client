import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AlertType} from '../../globals';

export interface IAlertState {
  message: string;
  show: boolean;
  type: AlertType;
}

const initialState: IAlertState = {
  message: '',
  show: false,
  type: AlertType.SUCCESS,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<IAlertState>) {
      state.message = (action.payload as IAlertState).message;
      state.show = (action.payload as IAlertState).show;
      state.type = (action.payload as IAlertState).type;
    },
  },
});

export const {setAlert} = alertSlice.actions;
export default alertSlice.reducer;
