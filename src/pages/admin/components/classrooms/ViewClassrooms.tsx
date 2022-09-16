import {
  Button,
  CircularProgress,
  FormControl,
  Modal,
  TextField,
} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {InputSelect} from '../../../../components';
import {setAlert} from '../../../../features/alert/alert-slice';
import {
  IClassroomRequest,
  useDeleteClassroomMutation,
  useFetchClassroomsQuery,
  useUpdateClassroomMutation,
} from '../../../../features/classroom/classroom_api_slice';
import {setClassrooms} from '../../../../features/classroom/classroom_slice';
import {useUpdateStudentMutation} from '../../../../features/student/student_api_slice';
import {useFetchUsersQuery} from '../../../../features/user/user_api_slice';
import {useFetchYearGroupsQuery} from '../../../../features/yearGroup/yearGroup_api_slice';
import {AlertType} from '../../../../globals';
import {IClassroom, IResult, IUser, IYearGroup} from '../../../../interfaces';

export const ViewClassrooms = (): JSX.Element => {
  const classrooms = useAppSelector(state => state.classroom.classrooms);
  const currentSession = useAppSelector(state => state.session.currentSession);
  const dispatch = useAppDispatch();
  const {
    data: fetchedClassrooms,
    isLoading: isLoadingClassrooms,
    isSuccess: isSuccessClassrooms,
  } = useFetchClassroomsQuery({session: currentSession?._id as any});
  const [deleteClassroom] = useDeleteClassroomMutation();

  useEffect(() => {
    if (isSuccessClassrooms && fetchedClassrooms.data) {
      dispatch(setClassrooms(fetchedClassrooms.data));
    }
  }, [fetchedClassrooms]);

  const handleEdit = () => {};

  const handleDelete = async (id: string) => {
    try {
      await deleteClassroom({_id: id} as IClassroomRequest);
    } catch (error) {
      let message = '';
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = JSON.stringify(error);
      }

      dispatch(setAlert({message, show: true, type: AlertType.ERROR}));
      console.error(error);
    }
  };

  if (isLoadingClassrooms)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="mt-4">
      <ClassroomTable
        classrooms={classrooms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

interface IClassroomTableProps {
  classrooms: IClassroom[];
  onDelete: (id: string) => void;
  onEdit?: (id: string, student: IClassroom) => void;
}
const ClassroomTable = ({
  classrooms,
  onDelete,
  onEdit,
}: IClassroomTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<IClassroom | null>(
    null
  );

  const handleEdit = (classroom: IClassroom) => {
    setSelectedClassroom(classroom);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  return (
    <>
      {selectedClassroom && (
        <EditModal
          open={openModal}
          onClose={handleCloseModal}
          classroom={selectedClassroom}
        />
      )}
      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">FORM ROOM</th>
            <th className="bg-gray-500 px-3 text-center py-2">FORM TUTOR</th>
            <th className="bg-gray-500 px-3 text-center py-2">YEAR GROUP</th>
            <th className="bg-gray-500 px-3 text-center py-2">SESSION</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {classrooms &&
            classrooms.map((classroom, index) => (
              <tr key={classroom._id as string}>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {classroom.name}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {classroom.form_tutor.lastname +
                    ', ' +
                    classroom.form_tutor.firstname}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {classroom.year_group.year}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => handleEdit(classroom)}
                    variant="contained"
                    color="primary"
                  >
                    Edit
                  </Button>
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => onDelete(classroom._id as string)}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

interface IEditProps {
  open: boolean;
  classroom: IClassroom;
  onClose: () => void;
}

const EditModal = ({open: openModal, classroom, onClose}: IEditProps) => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [classroomInfo, setClassroomInfo] = useState<IClassroom>({
    ...classroom,
    name: classroom.name as string,
    form_tutor: (classroom.form_tutor.lastname +
      ', ' +
      classroom.form_tutor.firstname) as any,
    session: currentSession?.session as any,
  });
  const [yearGroups, setYearGroups] = useState<IYearGroup[] | null>(null);
  const [classrooms, setClassrooms] = useState<IClassroom[] | null>(null);
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [updateClassroom, {isLoading: isLoadingClassroomUpdate}] =
    useUpdateClassroomMutation();
  const {
    data: fetchedYearGroups,
    isLoading: isLoadingYearGroups,
    isSuccess: isSuccesYearGroups,
  } = useFetchYearGroupsQuery();
  const {
    data: fetchedUsers,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useFetchUsersQuery();
  const {
    data: fetchedClassrooms,
    isLoading: isLoadingClassrooms,
    isSuccess: isSuccesClassrooms,
  } = useFetchClassroomsQuery({session_id: currentSession?._id as any});

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await updateClassroom({
      _id: classroomInfo._id as string,
      name: classroomInfo.name,
      form_tutor: classrooms?.find(
        c =>
          c.form_tutor.lastname + ', ' + c.form_tutor.firstname ===
          (classroomInfo.form_tutor as unknown as string)
      )?._id as any,
      session: currentSession?._id as any,
      year_group: classrooms?.find(
        c =>
          c.year_group.year === (classroomInfo.year_group as unknown as string)
      )?._id as any,
      section: classroomInfo.section as any,
    });
    onClose();
  };

  useEffect(() => {
    if (isSuccesYearGroups) {
      setYearGroups(
        (fetchedYearGroups as IResult<IYearGroup>).data as IYearGroup[]
      );
    }
    if (isSuccesClassrooms) {
      setClassrooms(
        (fetchedClassrooms as IResult<IClassroom>).data as IClassroom[]
      );
    }
    if (isSuccessUsers) {
      setUsers((fetchedUsers as IResult<IUser>).data as IUser[]);
    }
  }, [fetchedYearGroups, fetchedClassrooms, fetchedUsers]);

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className="flex flex-col flex-1 gap-4 m-auto w-96 h-fit p-4 bg-background translate-y-1/4">
        <InputSelect
          label="Form Room"
          value={classroomInfo.name}
          onChange={e =>
            setClassroomInfo({
              ...classroomInfo,
              name: (e.target as HTMLInputElement).value as string as any,
            })
          }
          selectionList={
            fetchedClassrooms?.data
              ? (fetchedClassrooms?.data as IClassroom[]).map(
                  classroom => classroom.name
                )
              : ['']
          }
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
            fetchedYearGroups?.data
              ? (fetchedYearGroups?.data as IYearGroup[]).map(
                  yearGroup => yearGroup.year
                )
              : ['']
          }
        />

        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
