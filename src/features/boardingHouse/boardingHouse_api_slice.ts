import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IBoardingHouse} from '../../interfaces';
import _ from 'lodash';
import {IRequestParams} from '../../interfaces/IRequestParams';
import {generateQueryStringFromObject} from '../../utils';
export const baseUrl = 'http://localhost:5000/api/';

export interface IBoardingHouseRequest extends IRequestParams {
  _id?: string;
  name?: string;
  boarding_parent?: string;
  session?: string;
  year_group?: string;
  section?: string;
}

export const boardingHouseApiSlice = createApi({
  reducerPath: 'boardingHouseApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['BoardingHouse'],
  endpoints(builder) {
    return {
      fetchBoardingHouses: builder.query<
        IResult<IBoardingHouse>,
        IBoardingHouseRequest
      >({
        query(arg) {
          const queryString = generateQueryStringFromObject(arg);
          return {
            url: `/boardinghouse${queryString}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['BoardingHouse'],
      }),

      fetchBoardingHouse: builder.query<
        IResult<IBoardingHouse>,
        IBoardingHouseRequest
      >({
        query(arg) {
          return {
            url: `/boardinghouse/${arg._id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['BoardingHouse'],
      }),

      addBoardingHouse: builder.mutation<
        IResult<IBoardingHouse>,
        IBoardingHouse
      >({
        query(boardingHouse) {
          return {
            url: '/boardinghouse',
            method: 'POST',
            body: _.pick(boardingHouse, [
              'name',
              'boarding_parent',
              'session',
              'year_group',
              'section',
            ]),
            credentials: 'include',
          };
        },
        invalidatesTags: ['BoardingHouse'],
      }),

      updateBoardingHouse: builder.mutation<
        IResult<IBoardingHouse>,
        IBoardingHouseRequest
      >({
        query(arg) {
          return {
            url: `/boardinghouse/${arg._id}`,
            method: 'PUT',
            body: _.pick(arg, [
              'name',
              'boarding_parent',
              'session',
              'year_group',
              'section',
            ]),
            credentials: 'include',
          };
        },
        invalidatesTags: ['BoardingHouse'],
      }),

      deleteBoardingHouse: builder.mutation<
        IResult<IBoardingHouse>,
        IBoardingHouseRequest
      >({
        query(arg) {
          return {
            url: `/boardinghouse/${arg._id}`,
            method: 'DELETE',
            credentials: 'include',
          };
        },
        invalidatesTags: ['BoardingHouse'],
      }),
    };
  },
});

export const {
  useAddBoardingHouseMutation,
  useDeleteBoardingHouseMutation,
  useFetchBoardingHouseQuery,
  useFetchBoardingHousesQuery,
  useUpdateBoardingHouseMutation,
} = boardingHouseApiSlice;
