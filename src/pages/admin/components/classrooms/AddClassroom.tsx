import {TextField, FormControl, Button} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {
  useAddClassroomMutation,
  useFetchClassroomsQuery,
} from '../../../../features/classroom/classroom_api_slice';
import {useFetchUsersQuery} from '../../../../features/user/user_api_slice';
import {useFetchYearGroupsQuery} from '../../../../features/yearGroup/yearGroup_api_slice';
import {IResult, IClassroom, IYearGroup, IUser} from '../../../../interfaces';
import {setAlert} from '../../../../features/alert/alert-slice';
import {AlertType} from '../../../../globals';

const initialClassroomState: IClassroom = {
  _id: '',
  name: '',
  form_tutor: '' as any,
  session: '' as any,
  year_group: '' as any,
  section: '' as any,
};

export const AddClassroom = () => {
  const [yearGroups, setYearGroups] = useState<IYearGroup[] | null>(null);
  const [classroomInfo, setClassroomInfo] = useState<IClassroom>(
    initialClassroomState
  );
  const [users, setUsers] = useState<IUser[] | null>(null);

  const dispatch = useAppDispatch();

  const [addClassroom, {isLoading: isLoadingClassroom}] =
    useAddClassroomMutation();
  const [classrooms, setClassrooms] = useState<IClassroom[] | null>(null);
  const currentSession = useAppSelector(state => state.session.currentSession);
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
  const {
    data: fetchedUsers,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useFetchUsersQuery();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const _classroomInfo = {
      _id: '',
      name: classroomInfo.name as any,
      form_tutor: users?.find(
        user =>
          user.lastname + ', ' + user.firstname ===
          (classroomInfo.form_tutor as unknown as string)
      )?._id as any,
      session: currentSession?._id as any,
      year_group: yearGroups?.find(
        yg => yg.year === (classroomInfo.year_group as unknown as string)
      )?._id as any,
      section: classroomInfo.section as any,
    };
    await addClassroom(_classroomInfo)
      .unwrap()
      .then(payload =>
        dispatch(
          setAlert({
            message: 'Classroom was created successfully!',
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
    if (isSuccessUsers) {
      setUsers((fetchedUsers as IResult<IUser>).data as IUser[]);
    }
  }, [yearGroupsFetchRes, fetchedClassrooms, fetchedUsers]);

  if (isLoadingYG) {
    return <Loading loading={isLoadingYG} />;
  }

  return (
    <form className="flex flex-col flex-1 gap-4 mt-3 w-96 h-72 p-4 bg-background">
      <TextField
        value={classroomInfo.name}
        label="Form Room"
        onChange={e =>
          setClassroomInfo({
            ...classroomInfo,
            name: e.target.value as string,
          })
        }
        required
      />
      <InputSelect
        label="Form Tutor"
        value={classroomInfo.form_tutor}
        onChange={e =>
          setClassroomInfo({
            ...classroomInfo,
            form_tutor: (e.target as HTMLInputElement).value as string as any,
          })
        }
        selectionList={
          users ? users.map(u => u.lastname + ', ' + u.firstname) : ['']
        }
      />

      <InputSelect
        label="Year Group"
        value={classroomInfo.year_group}
        onChange={e =>
          setClassroomInfo({
            ...classroomInfo,
            year_group: (e.target as HTMLInputElement).value as string as any,
          })
        }
        selectionList={
          yearGroups ? yearGroups.map(yg => yg.year as string) : ['']
        }
      />

      <InputSelect
        label="Section"
        value={classroomInfo.section}
        onChange={e =>
          setClassroomInfo({
            ...classroomInfo,
            section: (e.target as HTMLInputElement).value as string as any,
          })
        }
        selectionList={['junior', 'senior', 'ify']}
      />

      <Button onClick={handleSubmit} variant="contained">
        Submit
      </Button>
    </form>
  );
};
