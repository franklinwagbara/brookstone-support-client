import {ISession} from './ISession';
import {IStudent} from './IStudent';
import {IUser} from './IUser';
import {IYearGroup} from './IYearGroup';

interface IStringKey {
  [key: string]:
    | IStudent
    | IStudent[]
    | ISession
    | IUser
    | IYearGroup
    | string
    | undefined;
}

export interface IClassroom extends IStringKey {
  _id: string;
  name: string;
  form_tutor: IUser;
  students?: IStudent[];
  session: ISession;
  year_group: IYearGroup;
  section?: 'junior' | 'senior' | 'ify';
}
