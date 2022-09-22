import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IYearGroup} from '../../interfaces';
import _ from 'lodash';

export const baseUrl = 'http://localhost:5000/api/';

export interface IYearGroupRequest {
  yearGroup_id: string;
  body: IYearGroup;
}

export const yearGroupApiSlice = createApi({
  reducerPath: 'yearGroupApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['YearGroup'],
  endpoints(builder) {
    return {
      fetchYearGroups: builder.query<IResult<IYearGroup>, void>({
        query() {
          return {
            url: '/yearGroup',
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['YearGroup'],
      }),

      fetchYearGroup: builder.query<IResult<IYearGroup>, IYearGroupRequest>({
        query(arg) {
          return {
            url: `/yearGroup/${arg.yearGroup_id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['YearGroup'],
      }),

      addYearGroup: builder.mutation<IResult<IYearGroup>, IYearGroupRequest>({
        query(arg) {
          const body = _.pick(arg.body, ['year', 'session']);
          return {
            url: '/yearGroup',
            method: 'POST',
            body: body,
            credentials: 'include',
          };
        },
        invalidatesTags: ['YearGroup'],
      }),

      updateYearGroup: builder.mutation<IResult<IYearGroup>, IYearGroupRequest>(
        {
          query(arg) {
            return {
              url: `/yearGroup/${arg.yearGroup_id}`,
              method: 'PUT',
              body: _.pick(arg.body, ['year', 'session']),
              credentials: 'include',
            };
          },
          invalidatesTags: ['YearGroup'],
        }
      ),

      deleteYearGroup: builder.mutation<IResult<IYearGroup>, IYearGroupRequest>(
        {
          query(arg) {
            return {
              url: `/yearGroup/${arg.yearGroup_id}`,
              method: 'DELETE',
              credentials: 'include',
            };
          },
          invalidatesTags: ['YearGroup'],
        }
      ),
    };
  },
});

export const {
  useFetchYearGroupQuery,
  useFetchYearGroupsQuery,
  useAddYearGroupMutation,
  useDeleteYearGroupMutation,
  useUpdateYearGroupMutation,
} = yearGroupApiSlice;
