import {TextField} from '@mui/material';

export const FormAssessment = (): JSX.Element => {
  return (
    <form>
      <TextField label="Form Tutor Comment" multiline minRows={4} />
    </form>
  );
};
