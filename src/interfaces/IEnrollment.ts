import {IClassroom} from './IClassroom';
import {ISession} from './ISession';
import {IStudent} from './IStudent';
import {ISubject} from './ISubject';
import {ITranscript} from './ITranscript';
import {IUser} from './IUser';

export interface IEnrollment {
  _id?: string;
  student: IStudent;
  subject: ISubject;
  session: ISession;
  teacher: IUser;
  classroom: IClassroom;
  transcript: ITranscript;
}
