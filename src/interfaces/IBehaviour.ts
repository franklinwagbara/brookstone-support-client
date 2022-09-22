import {ISession} from './ISession';
import {IStudent} from './IStudent';

export interface IBehaviour {
  _id: string;
  student: IStudent;
  session: ISession;
  week: string;
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
  cooperation_with_support_teachers?: string;
  ability_to_concentrate_during_prep?: string;
  punctuality?: string;
}
