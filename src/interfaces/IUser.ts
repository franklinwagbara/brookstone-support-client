export interface IUser {
  _id?: string;
  username: string;
  firstname?: string;
  lastname?: string;
  email: string;
  role?: string;
  password?: string;
  confirm_password?: string;
  type?: 'user';
}
