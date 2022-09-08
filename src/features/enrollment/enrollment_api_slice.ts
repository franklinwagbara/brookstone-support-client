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
  tagTypes: ['Enrollment'],
  endpoints(builder) {
    return {
      fetchEnrollments: builder.query<
        IResult<IEnrollment>,
        IEnrollmentRequestParams
      >({
        query({user_id, session_id}) {
          return {
            url: `/enrollment?teacher=${user_id}&session=${session_id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Enrollment'],
      }),

      postEnrollment: builder.mutation<IResult<IEnrollment>, IEnrollment>({
        query(enrollment) {
          return {
            url: '/session',
            method: 'POST',
            body: enrollment,
            credentials: 'include',
          };
        },
        invalidatesTags: ['Enrollment'],
      }),
    };
  },
});

export const {useFetchEnrollmentsQuery, usePostEnrollmentMutation} =
  enrollmentApiSlice;
