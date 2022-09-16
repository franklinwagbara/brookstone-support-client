import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {useState} from 'react';
import {Loading} from '../../../../components';
import {
  ISubjectRequest,
  useAddSubjectMutation,
} from '../../../../features/subject/subject_api_slice';
import {ISubject} from '../../../../interfaces';

const initialSubjectState: ISubjectRequest = {
  subject_id: '',
  body: {_id: '', name: ''},
};

export const AddSubject = () => {
  const [subjectInfo, setSubjectInfo] =
    useState<ISubjectRequest>(initialSubjectState);
  const [addSubject, {isLoading: isLoadingSubject}] = useAddSubjectMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await addSubject(subjectInfo);
  };

  if (isLoadingSubject) {
    return <Loading loading={true} />;
  }

  return (
    <form className="flex flex-col flex-1 gap-4 mt-3 w-96 h-72 p-4 bg-background">
      <TextField
        value={subjectInfo.body.name}
        label="Name"
        onChange={e =>
          setSubjectInfo({
            ...subjectInfo,
            body: {...subjectInfo.body, name: e.target.value as string},
          })
        }
      />
      <Button onClick={handleSubmit} variant="contained">
        Submit
      </Button>
    </form>
  );
};
