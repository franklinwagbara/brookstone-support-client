export interface IResult<T> {
  data: T | T[] | null;
  error: Error | string | null;
  status: number | 200;
}
