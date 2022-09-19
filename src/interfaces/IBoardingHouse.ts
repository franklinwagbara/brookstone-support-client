import {ISession} from './ISession';
import {IStudent} from './IStudent';
import {IUser} from './IUser';
import {IYearGroup} from './IYearGroup';

export interface IBoardingHouse {
  _id: string;
  name: string;
  boarding_parent: IUser;
  students: IStudent[];
  session: ISession;
  year_group: IYearGroup;
  section?: 'junior' | 'senior' | 'ify';
}
