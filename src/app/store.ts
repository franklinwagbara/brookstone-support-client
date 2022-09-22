import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth-slice';
import sessionReducer from '../features/session/session_slice';
import enrollmentReducer from '../features/enrollment/enrollment_slice';
import classesReducer from '../features/classes/classes_slice';
import userReducer from '../features/user/user_slice';
import studentReducer from '../features/student/student_slice';
import subjectReducer from '../features/subject/subject_slice';
import classroomReducer from '../features/classroom/classroom_slice';
import classroomEnrollmentReducer from '../features/classroomEnrollment/classroomEnrollment_slice';
import alertReducer from '../features/alert/alert-slice';
import behaviourReducer from '../features/behaviour/behaviour_slice';
import boardingHouseReducer from '../features/boardingHouse/boardingHouse_slice';
import boardingEnrollmentReducer from '../features/boardingEnrollment/boardingEnrollment_slice';
import {authApiSlice} from '../features/auth/auth_api_slice';
import {sessionApiSlice} from '../features/session/session_api_slice';
import {enrollmentApiSlice} from '../features/enrollment/enrollment_api_slice';
import {transcriptApiSlice} from '../features/transcript/transcript_api_slice';
import {userApiSlice} from '../features/user/user_api_slice';
import {studentApiSlice} from '../features/student/student_api_slice';
import {yearGroupApiSlice} from '../features/yearGroup/yearGroup_api_slice';
import {subjectApiSlice} from '../features/subject/subject_api_slice';
import {classroomApiSlice} from '../features/classroom/classroom_api_slice';
import {classroomEnrollmentApiSlice} from '../features/classroomEnrollment/classroomEnrollment_api_slice';
import {behaviourApiSlice} from '../features/behaviour/behaviour_api_slice';
import {boardingHouseApiSlice} from '../features/boardingHouse/boardingHouse_api_slice';
import {boardingEnrollmentApiSlice} from '../features/boardingEnrollment/boardingEnrollment_api_slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    enrollment: enrollmentReducer,
    classes: classesReducer,
    user: userReducer,
    student: studentReducer,
    subject: subjectReducer,
    classroom: classroomReducer,
    classroomEnrollment: classroomEnrollmentReducer,
    alert: alertReducer,
    behaviour: behaviourReducer,
    boardingHouse: boardingHouseReducer,
    boardingEnrollment: boardingEnrollmentReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [sessionApiSlice.reducerPath]: sessionApiSlice.reducer,
    [enrollmentApiSlice.reducerPath]: enrollmentApiSlice.reducer,
    [transcriptApiSlice.reducerPath]: transcriptApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [studentApiSlice.reducerPath]: studentApiSlice.reducer,
    [yearGroupApiSlice.reducerPath]: yearGroupApiSlice.reducer,
    [subjectApiSlice.reducerPath]: subjectApiSlice.reducer,
    [classroomApiSlice.reducerPath]: classroomApiSlice.reducer,
    [classroomEnrollmentApiSlice.reducerPath]:
      classroomEnrollmentApiSlice.reducer,
    [behaviourApiSlice.reducerPath]: behaviourApiSlice.reducer,
    [boardingHouseApiSlice.reducerPath]: boardingHouseApiSlice.reducer,
    [boardingEnrollmentApiSlice.reducerPath]:
      boardingEnrollmentApiSlice.reducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(sessionApiSlice.middleware)
      .concat(enrollmentApiSlice.middleware)
      .concat(transcriptApiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(studentApiSlice.middleware)
      .concat(yearGroupApiSlice.middleware)
      .concat(subjectApiSlice.middleware)
      .concat(classroomApiSlice.middleware)
      .concat(classroomEnrollmentApiSlice.middleware)
      .concat(behaviourApiSlice.middleware)
      .concat(boardingHouseApiSlice.middleware)
      .concat(boardingEnrollmentApiSlice.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
