import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, ITranscript} from '../../interfaces';
import _ from 'lodash';

export const baseUrl = 'http://localhost:5000/api/';

interface ITranscriptFetchRequest {
  session: string;
  subject: string;
  teacher: string;
  classroom: string;
}

export const transcriptApiSlice = createApi({
  reducerPath: 'transcriptApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Transcript'],
  endpoints(builder) {
    return {
      fetchTranscript: builder.query<
        IResult<ITranscript[]>,
        ITranscriptFetchRequest
      >({
        query(arg) {
          return {
            url: `/transcript?session=${arg.session}&teacher=${arg.teacher}&subject=${arg.subject}&classroom=${arg.classroom}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Transcript'],
      }),
      updateTranscript: builder.mutation<IResult<ITranscript>, ITranscript>({
        query(transcript) {
          console.log('updating transcript....', transcript);
          const body = {
            ...transcript,
            classroom: transcript.classroom._id,
            session: transcript.session._id,
            student: transcript.student._id,
            subject: transcript.subject._id,
            teacher: transcript.teacher._id,
          };
          return {
            url: `/transcript/${transcript._id}`,
            method: 'PUT',
            body: _.pick(body, [
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
    };
  },
});

export const {useFetchTranscriptQuery, useUpdateTranscriptMutation} =
  transcriptApiSlice;
