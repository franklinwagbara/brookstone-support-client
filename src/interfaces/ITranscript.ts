import {IClassroom} from './IClassroom';
import {ISession} from './ISession';
import {IStudent} from './IStudent';
import {ISubject} from './ISubject';
import {IUser} from './IUser';

interface ObjectKey {
  [key: string]:
    | string
    | IStudent
    | ISubject
    | ISession
    | IClassroom
    | IUser
    | number
    | undefined;
}

export interface ITranscript extends ObjectKey {
  _id?: string;
  student: IStudent;
  subject: ISubject;
  session: ISession;
  classroom: IClassroom;
  teacher: IUser;
  week_1?: number;
  week_2?: number;
  week_3?: number;
  week_4?: number;
  ca_1?: number;
  half_term_exam?: number;
  ccm?: number;
  week_5?: number;
  week_6?: number;
  week_7?: number;
  week_8?: number;
  week_9?: number;
  ca_2?: number;
  final_exam?: number;
  total?: number;
  grade?: string;
  gpa?: number;
  comment?: string;
}
