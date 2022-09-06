import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, ISession, IUser} from '../../interfaces';

export const baseUrl = 'http://localhost:5000/api/';

export const sessionApiSlice = createApi({
  reducerPath: 'sessionApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
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
      }),

      postCurrentSession: builder.mutation<IResult<ISession>, ISession>({
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

export const {useFetchCurrentSessionQuery, usePostCurrentSessionMutation} =
  sessionApiSlice;
