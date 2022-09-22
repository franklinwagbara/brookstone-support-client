import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IClassroom} from '../../interfaces';
import _ from 'lodash';
import {IRequestParams} from '../../interfaces/IRequestParams';
import {generateQueryStringFromObject} from '../../utils';
export const baseUrl = 'http://localhost:5000/api/';

export interface IClassroomRequest extends IRequestParams {
  classroom?: string;
  _id?: string;
  name?: string;
  form_tutor?: string;
  session?: string;
  year_group?: string;
  section?: string;
}

export const classroomApiSlice = createApi({
  reducerPath: 'classroomApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Classroom'],
  endpoints(builder) {
    return {
      fetchClassrooms: builder.query<IResult<IClassroom>, IClassroomRequest>({
        query(arg) {
          const queryString = generateQueryStringFromObject(arg);
          return {
            url: `/classroom${queryString}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Classroom'],
      }),

      fetchClassroom: builder.query<IResult<IClassroom>, IClassroomRequest>({
        query(arg) {
          return {
            url: `/classroom/${arg._id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Classroom'],
      }),

      addClassroom: builder.mutation<IResult<IClassroom>, IClassroom>({
        query(classroom) {
          return {
            url: '/classroom',
            method: 'POST',
            body: _.pick(classroom, [
              'name',
              'form_tutor',
              'session',
              'classroom',
              'year_group',
              'section',
            ]),
            credentials: 'include',
          };
        },
        invalidatesTags: ['Classroom'],
      }),

      updateClassroom: builder.mutation<IResult<IClassroom>, IClassroomRequest>(
        {
          query(arg) {
            return {
              url: `/classroom/${arg._id}`,
              method: 'PUT',
              body: _.pick(arg, [
                'name',
                'form_tutor',
                'session',
                'classroom',
                'year_group',
                'section',
              ]),
              credentials: 'include',
            };
          },
          invalidatesTags: ['Classroom'],
        }
      ),

      deleteClassroom: builder.mutation<IResult<IClassroom>, IClassroomRequest>(
        {
          query(arg) {
            return {
              url: `/classroom/${arg._id}`,
              method: 'DELETE',
              credentials: 'include',
            };
          },
          invalidatesTags: ['Classroom'],
        }
      ),
    };
  },
});

export const {
  useAddClassroomMutation,
  useDeleteClassroomMutation,
  useFetchClassroomQuery,
  useFetchClassroomsQuery,
  useUpdateClassroomMutation,
} = classroomApiSlice;
