import {IClassroom} from './IClassroom';
import {ISession} from './ISession';
import {IStudent} from './IStudent';

export interface IClassroomEnrollment {
  _id?: string;
  student: IStudent;
  session: ISession;
  classroom: IClassroom;
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
