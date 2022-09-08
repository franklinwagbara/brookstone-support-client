import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IUser} from '../../interfaces';
import _ from 'lodash';

export const baseUrl = 'http://localhost:5000/api/';

export interface IUserRequest {
  user_id: string;
  body: IUser;
}

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['User'],
  endpoints(builder) {
    return {
      fetchUsers: builder.query<IResult<IUser>, void>({
        query() {
          return {
            url: '/user',
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['User'],
      }),

      fetchUser: builder.query<IResult<IUser>, IUserRequest>({
        query(arg) {
          return {
            url: `/user/${arg.user_id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['User'],
      }),

      addUser: builder.mutation<IResult<IUser>, IUser>({
        query(user) {
          return {
            url: '/user',
            method: 'POST',
            body: user,
            credentials: 'include',
          };
        },
        invalidatesTags: ['User'],
      }),

      updateUser: builder.mutation<IResult<IUser>, IUserRequest>({
        query(arg) {
          console.log('update User..', arg);
          return {
            url: `/user/${arg.user_id}`,
            method: 'PUT',
            body: _.pick(arg.body, [
              'username',
              'firstname',
              'lastname',
              'email',
              'role',
            ]),
            credentials: 'include',
          };
        },
        invalidatesTags: ['User'],
      }),

      deleteUser: builder.mutation<IResult<IUser>, IUserRequest>({
        query(arg) {
          return {
            url: `/user/${arg.user_id}`,
            method: 'DELETE',
            credentials: 'include',
          };
        },
        invalidatesTags: ['User'],
      }),
    };
  },
});

export const {
  useFetchUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useFetchUserQuery,
  useUpdateUserMutation,
} = userApiSlice;
