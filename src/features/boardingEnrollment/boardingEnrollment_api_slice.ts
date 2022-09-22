import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IBoardingEnrollment} from '../../interfaces';
import _ from 'lodash';
import {IRequestParams} from '../../interfaces/IRequestParams';
import {generateQueryStringFromObject} from '../../utils';
export const baseUrl = 'http://localhost:5000/api/';

export interface IBoardingEnrollmentRequest extends IRequestParams {
  _id?: string;
  student?: string;
  session?: string;
  boarding_house?: string;
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

export const boardingEnrollmentApiSlice = createApi({
  reducerPath: 'boardingEnrollmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['BoardingEnrollment'],
  endpoints(builder) {
    return {
      fetchBoardingEnrollments: builder.query<
        IResult<IBoardingEnrollment>,
        IBoardingEnrollmentRequest
      >({
        query(arg) {
          const queryString = generateQueryStringFromObject(arg);
          return {
            url: `/boardingenrollment${queryString}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['BoardingEnrollment'],
      }),

      fetchBoardingEnrollment: builder.query<
        IResult<IBoardingEnrollment>,
        IBoardingEnrollmentRequest
      >({
        query(arg) {
          return {
            url: `/boardingenrollment/${arg._id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['BoardingEnrollment'],
      }),

      addBoardingEnrollment: builder.mutation<
        IResult<IBoardingEnrollment>,
        IBoardingEnrollment
      >({
        query(boardingEnrollment) {
          return {
            url: '/boardingenrollment',
            method: 'POST',
            body: boardingEnrollment,
            credentials: 'include',
          };
        },
        invalidatesTags: ['BoardingEnrollment'],
      }),

      updateBoardingEnrollment: builder.mutation<
        IResult<IBoardingEnrollment>,
        IBoardingEnrollmentRequest
      >({
        query(arg) {
          return {
            url: `/boardingenrollment/${arg._id}`,
            method: 'PUT',
            body: _.pick(arg, [
              'student',
              'session',
              'boarding_house',
              'week_1_comment',
              'week_2_comment',
              'week_3_comment',
              'week_4_comment',
              'week_5_comment',
              'week_6_comment',
              'week_7_comment',
              'week_8_comment',
              'week_9_comment',
              'half_term_comment',
              'end_of_term_comment',
            ]),
            credentials: 'include',
          };
        },
        invalidatesTags: ['BoardingEnrollment'],
      }),

      deleteBoardingEnrollment: builder.mutation<
        IResult<IBoardingEnrollment>,
        IBoardingEnrollmentRequest
      >({
        query(arg) {
          return {
            url: `/boardingenrollment/${arg._id}`,
            method: 'DELETE',
            credentials: 'include',
          };
        },
        invalidatesTags: ['BoardingEnrollment'],
      }),
    };
  },
});

export const {
  useAddBoardingEnrollmentMutation,
  useDeleteBoardingEnrollmentMutation,
  useFetchBoardingEnrollmentQuery,
  useFetchBoardingEnrollmentsQuery,
  useUpdateBoardingEnrollmentMutation,
} = boardingEnrollmentApiSlice;
