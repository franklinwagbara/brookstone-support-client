import _ from 'lodash';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {ITranscript, IResult} from '../../interfaces';
import {IRequestParams} from '../../interfaces/IRequestParams';
import {generateQueryStringFromObject} from '../../utils';

export const baseUrl = 'http://localhost:5000/api/';

export interface ITranscriptRequest extends IRequestParams {
  _id?: string;
  teacher?: string;
  student?: string;
  subject?: string;
  session?: string;
  classroom?: string;
  week_1?: string;
  week_2?: string;
  week_3?: string;
  week_4?: string;
  ca_1?: string;
  half_term_exam?: string;
  ccm?: string;
  week_5?: string;
  week_6?: string;
  week_7?: string;
  week_8?: string;
  week_9?: string;
  ca_2?: string;
  final_exam?: string;
  total?: string;
  grade?: string;
  gpa?: string;
  comment?: string;
}

export const transcriptApiSlice = createApi({
  reducerPath: 'transcriptApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Transcript'],
  endpoints(builder) {
    return {
      fetchTranscripts: builder.query<IResult<ITranscript>, ITranscriptRequest>(
        {
          query(arg) {
            const queryString = generateQueryStringFromObject(arg);
            return {
              url: `/transcript${queryString}`,
              method: 'GET',
              credentials: 'include',
            };
          },
          providesTags: ['Transcript'],
        }
      ),

      fetchTranscript: builder.query<IResult<ITranscript>, ITranscriptRequest>({
        query(arg) {
          return {
            url: `/transcript/${arg._id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Transcript'],
      }),

      addTranscript: builder.mutation<IResult<ITranscript>, ITranscript>({
        query(transcript) {
          return {
            url: '/transcript',
            method: 'POST',
            body: transcript,
            credentials: 'include',
          };
        },
        invalidatesTags: ['Transcript'],
      }),

      updateTranscript: builder.mutation<
        IResult<ITranscript>,
        ITranscriptRequest
      >({
        query(arg) {
          console.log('arugue', arg);
          return {
            url: `/transcript/${arg._id}`,
            method: 'PUT',
            body: _.pick(arg, [
              'student',
              'subject',
              'session',
              'classroom',
              'teacher',
              'week_1',
              'week_2',
              'week_3',
              'week_4',
              'ca_1',
              'half_term_exam',
              'ccm',
              'week_5',
              'week_6',
              'week_7',
              'week_8',
              'week_9',
              'ca_2',
              'final_exam',
              'total',
              'grade',
              'gpa',
              'comment',
            ]),
            credentials: 'include',
          };
        },
        invalidatesTags: ['Transcript'],
      }),

      deleteTranscript: builder.mutation<
        IResult<ITranscript>,
        ITranscriptRequest
      >({
        query(arg) {
          return {
            url: `/transcript/${arg._id}`,
            method: 'DELETE',
            credentials: 'include',
          };
        },
        invalidatesTags: ['Transcript'],
      }),
    };
  },
});

export const {
  useFetchTranscriptQuery,
  useUpdateTranscriptMutation,
  useAddTranscriptMutation,
  useDeleteTranscriptMutation,
  useFetchTranscriptsQuery,
} = transcriptApiSlice;
