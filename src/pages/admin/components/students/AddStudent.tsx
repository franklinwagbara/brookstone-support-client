import {TextField, FormControl, Button} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {setAlert} from '../../../../features/alert/alert-slice';
import {useFetchClassroomsQuery} from '../../../../features/classroom/classroom_api_slice';
import {useAddStudentMutation} from '../../../../features/student/student_api_slice';
import {useFetchYearGroupsQuery} from '../../../../features/yearGroup/yearGroup_api_slice';
import {AlertType} from '../../../../globals';
import {
  IClassroom,
  IResult,
  IStudent,
  IYearGroup,
} from '../../../../interfaces';

const initialStudentState: IStudent = {
  first_name: '',
  last_name: '',
  other_names: '',
  gender: 'Male',
  session: '' as any,
  classroom: '' as any,
  year_group: '' as unknown as IYearGroup,
  dob: '',
  photo: '',
};

export const AddStudent = () => {
  const [yearGroups, setYearGroups] = useState<IYearGroup[] | null>(null);
  const [studentInfo, setStudentInfo] = useState<IStudent>(initialStudentState);
  const [addStudent, {isLoading: isLoadingStudent}] = useAddStudentMutation();
  const [classrooms, setClassrooms] = useState<IClassroom[] | null>(null);
  const currentSession = useAppSelector(state => state.session.currentSession);
  const dispatch = useAppDispatch();
  const {
    data: yearGroupsFetchRes,
    isLoading: isLoadingYG,
    isSuccess: isSuccessYearGroups,
  } = useFetchYearGroupsQuery();
  const {
    data: fetchedClassrooms,
    isLoading: isLoadingClassrooms,
    isSuccess: isSuccessClassrooms,
  } = useFetchClassroomsQuery({session_id: currentSession?._id as any});

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const _studentInfo = {
      ...studentInfo,
      session: currentSession?._id as any,
      year_group: yearGroups?.find(
        yg => yg.year === (studentInfo.year_group as unknown as string)
      )?._id as any,
      classroom: classrooms?.find(
        c => c.name === (studentInfo.classroom as unknown as string)
      )?._id as any,
    };
    await addStudent(_studentInfo)
      .unwrap()
      .then(payload =>
        dispatch(
          setAlert({
            message: 'Student record was created successfully!',
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
    setStudentInfo({...initialStudentState});
  };

  useEffect(() => {
    if (isSuccessYearGroups)
      setYearGroups(
        (yearGroupsFetchRes as IResult<IYearGroup>).data as IYearGroup[]
      );
    if (isSuccessClassrooms)
      setClassrooms(
        (fetchedClassrooms as IResult<IClassroom>).data as IClassroom[]
      );
  }, [yearGroupsFetchRes, fetchedClassrooms]);

  if (isLoadingYG) {
    return <Loading loading={isLoadingYG} />;
  }

  return (
    <form className="flex flex-col flex-1 gap-4 mt-3 w-96 h-72 p-4 bg-background">
      <TextField
        value={studentInfo.first_name}
        label="First Name"
        onChange={e =>
          setStudentInfo({...studentInfo, first_name: e.target.value as string})
        }
        required
      />
      <TextField
        value={studentInfo.last_name}
        label="Last Name"
        onChange={e =>
          setStudentInfo({...studentInfo, last_name: e.target.value as string})
        }
        required
      />
      <TextField
        value={studentInfo.other_names}
        label="Other Names"
        onChange={e =>
          setStudentInfo({
            ...studentInfo,
            other_names: e.target.value as string,
          })
        }
      />
      <InputSelect
        label="Gender"
        value={studentInfo.gender}
        onChange={e =>
          setStudentInfo({
            ...studentInfo,
            gender: (e.target as HTMLInputElement).value as string as any,
          })
        }
        selectionList={['Male', 'Female']}
      />

      <InputSelect
        label="Year Group"
        value={studentInfo.year_group}
        onChange={e =>
          setStudentInfo({
            ...studentInfo,
            year_group: (e.target as HTMLInputElement).value as string as any,
          })
        }
        selectionList={
          yearGroups ? yearGroups.map(yg => yg.year as string) : ['']
        }
      />

      <InputSelect
        label="Form Room"
        value={studentInfo.classroom}
        onChange={e =>
          setStudentInfo({
            ...studentInfo,
            classroom: (e.target as HTMLInputElement).value as string as any,
          })
        }
        selectionList={
          classrooms ? classrooms.map(c => c.name as string) : ['']
        }
      />

      <FormControl fullWidth>
        <label htmlFor="start">Start date:</label>
        <input
          type="date"
          id="start"
          name="trip-start"
          value={studentInfo.dob}
          onChange={e =>
            setStudentInfo({...studentInfo, dob: e.target.value as string})
          }
          min="190-01-01"
          max="2018-12-31"
        />
      </FormControl>

      <input
        type="file"
        name="file"
        onChange={() => console.log('Not implemented!')}
      />
      {/*Todo: Add date of birth upload*/}

      <Button onClick={handleSubmit} variant="contained">
        Submit
      </Button>
    </form>
  );
};
