import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth-slice';
import sessionReducer from '../features/session/session_slice';
import enrollmentReducer from '../features/enrollment/enrollment_slice';
import classesReducer from '../features/classes/classes_slice';
import userReducer from '../features/user/user_slice';
import {authApiSlice} from '../features/auth/auth_api_slice';
import {sessionApiSlice} from '../features/session/session_api_slice';
import {enrollmentApiSlice} from '../features/enrollment/enrollment_api_slice';
import {transcriptApiSlice} from '../features/transcript/transcript_api_slice';
import {userApiSlice} from '../features/user/user_api_slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    enrollment: enrollmentReducer,
    classes: classesReducer,
    user: userReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [sessionApiSlice.reducerPath]: sessionApiSlice.reducer,
    [enrollmentApiSlice.reducerPath]: enrollmentApiSlice.reducer,
    [transcriptApiSlice.reducerPath]: transcriptApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(sessionApiSlice.middleware)
      .concat(enrollmentApiSlice.middleware)
      .concat(transcriptApiSlice.middleware)
      .concat(userApiSlice.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
