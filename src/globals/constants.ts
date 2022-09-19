enum AlertType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

export {AlertType};

export const WEEKS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'Half Term',
  'End of Term',
];

interface IMapper {
  [key: string]: string;
}
export const WEEKS_MAPPER: IMapper = {
  '1': 'week_1_comment',
  '2': 'week_2_comment',
  '3': 'week_3_comment',
  '4': 'week_4_comment',
  '5': 'week_5_comment',
  '6': 'week_6_comment',
  '7': 'week_7_comment',
  '8': 'week_8_comment',
  '9': 'week_9_comment',
  'Half Term': 'half_term_comment',
  'End of Term': 'end_of_term_comment',
};

export const RATINGS: string[] = ['1', '2', '3', '4', '5'];
