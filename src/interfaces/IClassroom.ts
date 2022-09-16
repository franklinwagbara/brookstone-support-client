import {ISession} from './ISession';
import {IStudent} from './IStudent';
import {IUser} from './IUser';
import {IYearGroup} from './IYearGroup';

export interface IClassroom {
  _id: string;
  name: string;
  form_tutor: IUser;
  students?: IStudent[];
  session: ISession;
  year_group: IYearGroup;
  section?: 'junior' | 'senior' | 'ify';
}
