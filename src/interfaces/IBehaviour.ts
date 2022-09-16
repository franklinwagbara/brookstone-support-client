import {ISession} from './ISession';
import {IStudent} from './IStudent';

export interface IBehaviour {
  _id: string;
  student: IStudent;
  session: ISession;
  week: number;
  active_participation_and_composure_during_lessons: number;
  ownership_of_learning: number;
  punctuality_and_attendance_to_lessons: number;
  motivation_and_value_for_academic_success: number;
  self_confidence_towards_academic_work: number;
  effective_use_of_study_skills: number;
  Assessed_extended_learning: number;
  completion_of_extended_learning: number;
  organizational_skills: number;
  obedience_to_pastoral_rules_and_regulations: number;
  cooperation_with_boarding_parents: number;
  ability_to_concentrate_during_prep: number;
  punctuality: number;
}
