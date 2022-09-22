import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {useState} from 'react';
import {useAppDispatch} from '../../../../app/hooks';
import {Loading} from '../../../../components';
import {setAlert} from '../../../../features/alert/alert-slice';
import {
  ISubjectRequest,
  useAddSubjectMutation,
} from '../../../../features/subject/subject_api_slice';
import {AlertType} from '../../../../globals';

const initialSubjectState: ISubjectRequest = {
  subject_id: '',
  body: {_id: '', name: ''},
};

export const AddSubject = () => {
  const [subjectInfo, setSubjectInfo] =
    useState<ISubjectRequest>(initialSubjectState);
  const dispatch = useAppDispatch();
  const [addSubject, {isLoading: isLoadingSubject}] = useAddSubjectMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await addSubject(subjectInfo)
      .unwrap()
      .then(payload =>
        dispatch(
          setAlert({
            message: 'Subject was created successfully!',
            show: true,
            type: AlertType.SUCCESS,
          })
        )
      )
      .catch(error =>
        dispatch(
          setAlert({
            message: JSON.stringify(error),
            show: true,
            type: AlertType.ERROR,
          })
        )
      );
    setSubjectInfo({...initialSubjectState});
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
