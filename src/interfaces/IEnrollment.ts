import {IClassroom} from './IClassroom';
import {ISession} from './ISession';
import {IStudent} from './IStudent';
import {ISubject} from './ISubject';
import {ITranscript} from './ITranscript';
import {IUser} from './IUser';

interface IEnrollmentKeys {
  [key: string]:
    | string
    | ISession
    | IStudent
    | IUser
    | ISubject
    | ITranscript
    | IClassroom
    | undefined;
}

export interface IEnrollment extends IEnrollmentKeys {
  _id?: string;
  student: IStudent;
  subject: ISubject;
  teacher: IUser;
  classroom: IClassroom;
  session: ISession;
  transcript: ITranscript;
}
