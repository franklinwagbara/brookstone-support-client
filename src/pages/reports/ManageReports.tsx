import {TextField} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppSelector} from '../../app/hooks';
import {InputSelect, Loading} from '../../components';
import {useFetchStudentsWithArgQuery} from '../../features/student/student_api_slice';
import {IStudent} from '../../interfaces';
import {StudentList} from './components/StudentList';

export const ManageReports = (): JSX.Element => {
  const [students, setStudents] = useState<IStudent[] | null>(null);
  const currentSession = useAppSelector(
    state => state.session.currentSession?._id
  );
  const {
    data: fetchedStudents,
    isSuccess: isSuccessStudents,
    isLoading: isLoadingStudents,
  } = useFetchStudentsWithArgQuery({session: currentSession});

  useEffect(() => {
    if (isSuccessStudents) {
      setStudents(fetchedStudents.data as IStudent[]);
    }
  }, [fetchedStudents]);

  if (isLoadingStudents) {
    return <Loading loading={true} />;
  }

  return (
    <div>
      <div className="flex flex-row mb-4">
        <TextField label="Search for student..." fullWidth />
        <InputSelect
          label="Class"
          value={''}
          onChange={e => console.log('not implemented')}
          selectionList={['Male', 'Female']}
        />

        <InputSelect
          label="Section"
          value={''}
          onChange={e => console.log('not implemented')}
          selectionList={['Male', 'Female']}
        />
      </div>
      <div id="content_area">
        {students && <StudentList students={students} />}
      </div>
    </div>
  );
};
