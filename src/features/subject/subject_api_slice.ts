import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, ISubject} from '../../interfaces';
import _ from 'lodash';

export const baseUrl = 'http://localhost:5000/api/';

export interface ISubjectRequest {
  subject_id: string;
  body: ISubject;
}

export const subjectApiSlice = createApi({
  reducerPath: 'subjectApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Subject'],
  endpoints(builder) {
    return {
      fetchSubjects: builder.query<IResult<ISubject>, void>({
        query() {
          return {
            url: '/subject',
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Subject'],
      }),

      fetchSubject: builder.query<IResult<ISubject>, ISubjectRequest>({
        query(arg) {
          return {
            url: `/subject/${arg.subject_id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Subject'],
      }),

      addSubject: builder.mutation<IResult<ISubject>, ISubjectRequest>({
        query(subjectRequest) {
          const body = _.pick(subjectRequest.body, ['name']);
          return {
            url: '/subject',
            method: 'POST',
            body,
            credentials: 'include',
          };
        },
        invalidatesTags: ['Subject'],
      }),

      updateSubject: builder.mutation<IResult<ISubject>, ISubjectRequest>({
        query(arg) {
          return {
            url: `/subject/${arg.subject_id}`,
            method: 'PUT',
            body: _.pick(arg.body, ['name']),
            credentials: 'include',
          };
        },
        invalidatesTags: ['Subject'],
      }),

      deleteSubject: builder.mutation<IResult<ISubject>, ISubjectRequest>({
        query(arg) {
          return {
            url: `/subject/${arg.subject_id}`,
            method: 'DELETE',
            credentials: 'include',
          };
        },
        invalidatesTags: ['Subject'],
      }),
    };
  },
});

export const {
  useFetchSubjectQuery,
  useFetchSubjectsQuery,
  useAddSubjectMutation,
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
} = subjectApiSlice;
