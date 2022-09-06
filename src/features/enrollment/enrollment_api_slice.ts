import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IEnrollment, IUser} from '../../interfaces';

export const baseUrl = 'http://localhost:5000/api/';

export interface IEnrollmentRequestParams {
  user_id: string;
  session_id: string;
}

export const enrollmentApiSlice = createApi({
  reducerPath: 'enrollmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  endpoints(builder) {
    return {
      fetchEnrollments: builder.query<
        IResult<IEnrollment>,
        IEnrollmentRequestParams
      >({
        query({user_id, session_id}) {
          console.log('in side fetch', user_id, session_id);
          return {
            url: `/enrollment?teacher=${user_id}&session=${session_id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
      }),

      postEnrollment: builder.mutation<IResult<IEnrollment>, IEnrollment>({
        query(session) {
          return {
            url: '/session',
            method: 'GET',
            credentials: 'include',
          };
        },
      }),
    };
  },
});

export const {useFetchEnrollmentsQuery, usePostEnrollmentMutation} =
  enrollmentApiSlice;
