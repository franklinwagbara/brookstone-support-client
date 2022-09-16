import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, ISession, IUser} from '../../interfaces';
import _ from 'lodash';

export const baseUrl = 'http://localhost:5000/api/';

export interface ISessionRequest {
  session_id: string;
  body: ISession;
}

export const sessionApiSlice = createApi({
  reducerPath: 'sessionApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Session'],
  endpoints(builder) {
    return {
      fetchCurrentSession: builder.query<IResult<ISession>, void>({
        query() {
          return {
            url: '/session?current=true',
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Session'],
      }),

      fetchSessions: builder.query<IResult<ISession>, void>({
        query() {
          return {
            url: '/session',
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Session'],
      }),

      fetchSession: builder.query<IResult<ISession>, ISessionRequest>({
        query(arg) {
          return {
            url: `/session/${arg.session_id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Session'],
      }),

      addSession: builder.mutation<IResult<ISession>, ISession>({
        query(subject) {
          return {
            url: '/session',
            method: 'POST',
            body: subject,
            credentials: 'include',
          };
        },
        invalidatesTags: ['Session'],
      }),

      updateSession: builder.mutation<IResult<ISession>, ISessionRequest>({
        query(arg) {
          return {
            url: `/session/${arg.session_id}`,
            method: 'PUT',
            body: _.pick(arg.body, ['session', 'term', 'current']),
            credentials: 'include',
          };
        },
        invalidatesTags: ['Session'],
      }),

      deleteSession: builder.mutation<IResult<ISession>, ISessionRequest>({
        query(arg) {
          return {
            url: `/session/${arg.session_id}`,
            method: 'DELETE',
            credentials: 'include',
          };
        },
        invalidatesTags: ['Session'],
      }),
    };
  },
});

export const {
  useFetchCurrentSessionQuery,
  useAddSessionMutation,
  useDeleteSessionMutation,
  useFetchSessionQuery,
  useFetchSessionsQuery,
  useUpdateSessionMutation,
} = sessionApiSlice;
