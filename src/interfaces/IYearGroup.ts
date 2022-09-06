import {ISession} from './ISession';

export interface IYearGroup {
  _id?: string;
  year:
    | 'Year 7'
    | 'Year 8'
    | 'Year 9'
    | 'Year 10'
    | 'Year 11'
    | 'Year 12'
    | 'IFY';
  session: ISession;
}
