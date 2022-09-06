import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IUser} from '../../interfaces';

export const baseUrl = 'http://localhost:5000/api/';

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  endpoints(builder) {
    return {
      // login: builder.query<IResult<IUser>, IUser>({
      //   query(credentials) {
      //     return {url: '/auth/login', method: 'POST', body: credentials};
      //   },
      // }),
      login: builder.mutation<IResult<IUser>, IUser>({
        query(credentials) {
          return {
            url: '/auth/login',
            method: 'POST',
            body: credentials,
            credentials: 'include',
          };
        },
      }),

      logout: builder.mutation<IResult<IUser>, void>({
        query() {
          return {
            url: '/auth/logout',
            method: 'PUT',
            credentials: 'include',
          };
        },
      }),

      fetchCurrentUser: builder.mutation<IResult<IUser>, IUser>({
        query() {
          return {
            url: '/user/currentuser',
            method: 'GET',
            credentials: 'include',
          };
        },
      }),
    };
  },
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useFetchCurrentUserMutation,
} = authApiSlice;
