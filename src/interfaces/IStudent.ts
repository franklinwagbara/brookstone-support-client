import {IClassroom} from './IClassroom';
import {ISession} from './ISession';
import {IYearGroup} from './IYearGroup';

interface IStudentKeys {
  [key: string]:
    | string
    | ISession
    | IYearGroup
    | IClassroom
    | 'Male'
    | 'Female'
    | undefined;
}

export interface IStudent {
  _id?: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  gender: 'Male' | 'Female';
  session: ISession;
  year_group: IYearGroup;
  classroom: IClassroom;
  dob?: string;
  photo?: string;
}
