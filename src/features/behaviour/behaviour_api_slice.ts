import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IResult, IBehaviour} from '../../interfaces';
import _ from 'lodash';
import {IRequestParams} from '../../interfaces/IRequestParams';
import {generateQueryStringFromObject} from '../../utils';
export const baseUrl = 'http://localhost:5000/api/';

export interface IBehaviourRequest extends IRequestParams {
  _id?: string;
  student?: string;
  session?: string;
  week?: string;
  active_participation_and_composure_during_lessons?: string;
  ownership_of_learning?: string;
  punctuality_and_attendance_to_lessons?: string;
  motivation_and_value_for_academic_success?: string;
  self_confidence_towards_academic_work?: string;
  effective_use_of_study_skills?: string;
  Assessed_extended_learning?: string;
  completion_of_extended_learning?: string;
  organizational_skills?: string;
  obedience_to_pastoral_rules_and_regulations?: string;
  cooperation_with_boarding_parents?: string;
  ability_to_concentrate_during_prep?: string;
  punctuality?: string;
}

export const behaviourApiSlice = createApi({
  reducerPath: 'behaviourApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Behaviour'],
  endpoints(builder) {
    return {
      fetchBehaviours: builder.query<IResult<IBehaviour>, IBehaviourRequest>({
        query(arg) {
          const queryString = generateQueryStringFromObject(arg) as string;
          return {
            url: `/behaviour${queryString}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Behaviour'],
      }),

      fetchBehaviour: builder.query<IResult<IBehaviour>, IBehaviourRequest>({
        query(arg) {
          console.log('argsss', arg);
          return {
            url: `/behaviour/${arg._id}`,
            method: 'GET',
            credentials: 'include',
          };
        },
        providesTags: ['Behaviour'],
      }),

      addBehaviour: builder.mutation<IResult<IBehaviour>, IBehaviour>({
        query(behaviour) {
          console.log('adding', behaviour);
          return {
            url: '/behaviour',
            method: 'POST',
            body: _.pick(behaviour, [
              'student',
              'session',
              'week',
              'active_participation_and_composure_during_lessons',
              'ownership_of_learning',
              'punctuality_and_attendance_to_lessons',
              'motivation_and_value_for_academic_success',
              'self_confidence_towards_academic_work',
              'effective_use_of_study_skills',
              'Assessed_extended_learning',
              'completion_of_extended_learning',
              'organizational_skills',
              'obedience_to_pastoral_rules_and_regulations',
              'cooperation_with_boarding_parents',
              'ability_to_concentrate_during_prep',
              'punctuality',
            ]),
            credentials: 'include',
          };
        },
        invalidatesTags: ['Behaviour'],
      }),

      updateBehaviour: builder.mutation<IResult<IBehaviour>, IBehaviourRequest>(
        {
          query(behaviour) {
            console.log('adding', behaviour);

            return {
              url: `/behaviour/${behaviour._id}`,
              method: 'PUT',
              body: _.pick(behaviour, [
                'student',
                'session',
                'week',
                'active_participation_and_composure_during_lessons',
                'ownership_of_learning',
                'punctuality_and_attendance_to_lessons',
                'motivation_and_value_for_academic_success',
                'self_confidence_towards_academic_work',
                'effective_use_of_study_skills',
                'Assessed_extended_learning',
                'completion_of_extended_learning',
                'organizational_skills',
                'obedience_to_pastoral_rules_and_regulations',
                'cooperation_with_boarding_parents',
                'ability_to_concentrate_during_prep',
                'punctuality',
              ]),
              credentials: 'include',
            };
          },
          invalidatesTags: ['Behaviour'],
        }
      ),

      deleteBehaviour: builder.mutation<IResult<IBehaviour>, IBehaviourRequest>(
        {
          query(arg) {
            return {
              url: `/behaviour/${arg._id}`,
              method: 'DELETE',
              credentials: 'include',
            };
          },
          invalidatesTags: ['Behaviour'],
        }
      ),
    };
  },
});

export const {
  useAddBehaviourMutation,
  useDeleteBehaviourMutation,
  useFetchBehaviourQuery,
  useFetchBehavioursQuery,
  useUpdateBehaviourMutation,
} = behaviourApiSlice;
