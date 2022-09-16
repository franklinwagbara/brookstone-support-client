import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IClassroomEnrollment} from '../../interfaces';
import _ from 'lodash';
import {IRequestParams} from '../../interfaces/IRequestParams';
import {generateQueryStringFromObject} from '../../utils';
export const baseUrl = 'http://localhost:5000/api/';

export interface IClassroomEnrollmentRequest extends IRequestParams {
  _id?: string;
  student?: string;
  session?: string;
  classroom?: string;
  week_1_comment?: string;
  week_2_comment?: string;
  week_3_comment?: string;
  week_4_comment?: string;
  week_5_comment?: string;
  week_6_comment?: string;
  week_7_comment?: string;
  week_8_comment?: string;
  week_9_comment?: string;
  half_term_comment?: string;
  end_of_term_comment?: string;
}

export const classroomEnrollmentApiSlice = createApi({
  reducerPath: 'classroomEnrollmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['ClassroomEnrollment'],
  endpoints(builder) {
    return {
      fetchClassroomEnrollments: builder.query<
        IResult<IClassroomEnrollment>,
        IClassroomEnrollmentRequest
      >({
        query(arg) {
          const queryString = generateQueryStringFromObject(arg);
          return {
            url: `/classroomenrollment${queryString}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['ClassroomEnrollment'],
      }),

      fetchClassroomEnrollment: builder.query<
        IResult<IClassroomEnrollment>,
        IClassroomEnrollmentRequest
      >({
        query(arg) {
          return {
            url: `/classroomenrollment/${arg._id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['ClassroomEnrollment'],
      }),

      addClassroomEnrollment: builder.mutation<
        IResult<IClassroomEnrollment>,
        IClassroomEnrollment
      >({
        query(clasroomEnrollment) {
          return {
            url: '/classroomenrollment',
            method: 'POST',
            body: clasroomEnrollment,
            credentials: 'include',
          };
        },
        invalidatesTags: ['ClassroomEnrollment'],
      }),

      updateClassroomEnrollment: builder.mutation<
        IResult<IClassroomEnrollment>,
        IClassroomEnrollmentRequest
      >({
        query(arg) {
          return {
            url: `/classroomenrollment/${arg._id}`,
            method: 'PUT',
            body: _.pick(arg, ['student', 'session', 'classroom']),
            credentials: 'include',
          };
        },
        invalidatesTags: ['ClassroomEnrollment'],
      }),

      deleteClassroomEnrollment: builder.mutation<
        IResult<IClassroomEnrollment>,
        IClassroomEnrollmentRequest
      >({
        query(arg) {
          return {
            url: `/classroomenrollment/${arg._id}`,
            method: 'DELETE',
            credentials: 'include',
          };
        },
        invalidatesTags: ['ClassroomEnrollment'],
      }),
    };
  },
});

export const {
  useAddClassroomEnrollmentMutation,
  useDeleteClassroomEnrollmentMutation,
  useFetchClassroomEnrollmentQuery,
  useFetchClassroomEnrollmentsQuery,
  useUpdateClassroomEnrollmentMutation,
} = classroomEnrollmentApiSlice;
