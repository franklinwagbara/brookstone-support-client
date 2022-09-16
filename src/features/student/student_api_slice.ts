import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IStudent} from '../../interfaces';
import _ from 'lodash';
import {generateQueryStringFromObject} from '../../utils';
import {IRequestParams} from '../../interfaces/IRequestParams';

export const baseUrl = 'http://localhost:5000/api/';

export interface IStudentRequest {
  student_id: string;
  body: IStudent;
}

export const studentApiSlice = createApi({
  reducerPath: 'studentApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Student'],
  endpoints(builder) {
    return {
      fetchStudents: builder.query<IResult<IStudent>, void>({
        query() {
          return {
            url: '/student',
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Student'],
      }),

      fetchStudentsWithArg: builder.query<IResult<IStudent>, IRequestParams>({
        query(arg) {
          const queryString = generateQueryStringFromObject(arg);
          return {
            url: `/student${queryString}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Student'],
      }),

      fetchStudent: builder.query<IResult<IStudent>, IStudentRequest>({
        query(arg) {
          return {
            url: `/user/${arg.student_id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Student'],
      }),

      addStudent: builder.mutation<IResult<IStudent>, IStudent>({
        query(student) {
          return {
            url: '/student',
            method: 'POST',
            body: student,
            credentials: 'include',
          };
        },
        invalidatesTags: ['Student'],
      }),

      updateStudent: builder.mutation<IResult<IStudent>, IStudentRequest>({
        query(arg) {
          return {
            url: `/student/${arg.student_id}`,
            method: 'PUT',
            body: _.pick(arg.body, [
              'first_name',
              'last_name',
              'other_names',
              'gender',
              'session',
              'classroom',
              'year_group',
              'dob',
              'photo',
            ]),
            credentials: 'include',
          };
        },
        invalidatesTags: ['Student'],
      }),

      deleteStudent: builder.mutation<IResult<IStudent>, IStudentRequest>({
        query(arg) {
          return {
            url: `/student/${arg.student_id}`,
            method: 'DELETE',
            credentials: 'include',
          };
        },
        invalidatesTags: ['Student'],
      }),
    };
  },
});

export const {
  useFetchStudentQuery,
  useFetchStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useFetchStudentsWithArgQuery,
} = studentApiSlice;
