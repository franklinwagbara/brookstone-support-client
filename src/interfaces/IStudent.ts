import {ISession} from './ISession';
import {IYearGroup} from './IYearGroup';

export interface IStudent {
  _id: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  gender: 'male' | 'female';
  session: ISession;
  year_group: IYearGroup;
  dob?: string;
  photo?: string;
}
