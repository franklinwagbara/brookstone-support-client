import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IEnrollment} from '../../interfaces';
import _ from 'lodash';
import {IRequestParams} from '../../interfaces/IRequestParams';
import {generateQueryStringFromObject} from '../../utils/';
export const baseUrl = 'http://localhost:5000/api/';

export interface IEnrollmentRequest extends IRequestParams {
  _id?: string;
  teacher?: string;
  student?: string;
  subject?: string;
  session?: string;
  classroom?: string;
  transcript?: string;
}

export const enrollmentApiSlice = createApi({
  reducerPath: 'enrollmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Enrollment'],
  endpoints(builder) {
    return {
      fetchEnrollments: builder.query<IResult<IEnrollment>, IEnrollmentRequest>(
        {
          query(arg) {
            const queryString = generateQueryStringFromObject(arg);
            return {
              url: `/enrollment${queryString}`,
              method: 'GET',
              credentials: 'include',
            };
          },
          providesTags: ['Enrollment'],
        }
      ),

      fetchEnrollment: builder.query<IResult<IEnrollment>, IEnrollmentRequest>({
        query(arg) {
          return {
            url: `/enrollment/${arg._id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Enrollment'],
      }),

      addEnrollment: builder.mutation<IResult<IEnrollment>, IEnrollment>({
        query(enrollment) {
          return {
            url: '/enrollment',
            method: 'POST',
            body: enrollment,
            credentials: 'include',
          };
        },
        invalidatesTags: ['Enrollment'],
      }),

      updateEnrollment: builder.mutation<
        IResult<IEnrollment>,
        IEnrollmentRequest
      >({
        query(arg) {
          return {
            url: `/enrollment/${arg._id}`,
            method: 'PUT',
            body: _.pick(arg, [
              'teacher',
              'student',
              'subject',
              'session',
              'classroom',
            ]),
            credentials: 'include',
          };
        },
        invalidatesTags: ['Enrollment'],
      }),

      deleteEnrollment: builder.mutation<
        IResult<IEnrollment>,
        IEnrollmentRequest
      >({
        query(arg) {
          return {
            url: `/enrollment/${arg._id}`,
            method: 'DELETE',
            credentials: 'include',
          };
        },
        invalidatesTags: ['Enrollment'],
      }),
    };
  },
});

export const {
  useAddEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useFetchEnrollmentQuery,
  useFetchEnrollmentsQuery,
  useUpdateEnrollmentMutation,
} = enrollmentApiSlice;
