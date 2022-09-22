import {IBoardingHouse} from './IBoardingHouse';
import {ISession} from './ISession';
import {IStudent} from './IStudent';

interface IStringKey {
  [key: string]: IStudent | ISession | IBoardingHouse | string | undefined;
}
export interface IBoardingEnrollment extends IStringKey {
  _id?: string;
  student: IStudent;
  session: ISession;
  boarding_house: IBoardingHouse;
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
