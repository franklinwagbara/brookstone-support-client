import {IEnrollment} from '.';

export interface IClassBySubject {
  [key: string]: IEnrollment[];
}

export interface IClasses {
  [key: string]: IClassBySubject;
}
