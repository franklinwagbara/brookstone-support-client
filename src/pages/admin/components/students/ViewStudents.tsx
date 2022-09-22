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
import {useFetchClassroomsQuery} from '../../../../features/classroom/classroom_api_slice';
import {
  IStudentRequest,
  useDeleteStudentMutation,
  useFetchStudentsQuery,
  useUpdateStudentMutation,
} from '../../../../features/student/student_api_slice';
import {setStudents} from '../../../../features/student/student_slice';
import {useFetchYearGroupsQuery} from '../../../../features/yearGroup/yearGroup_api_slice';
import {
  IClassroom,
  IResult,
  IStudent,
  IYearGroup,
} from '../../../../interfaces';

export const ViewStudents = (): JSX.Element => {
  const students = useAppSelector(state => state.student.students);
  const dispatch = useAppDispatch();
  const {
    data,
    isLoading: isLoadingStudent,
    isSuccess: isSuccessStudent,
  } = useFetchStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  useEffect(() => {
    if (isSuccessStudent && data.data) {
      dispatch(setStudents(data.data));
    }
  }, [data]);

  const handleEdit = async (id: string, student: IStudent) => {};

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent({student_id: id} as IStudentRequest);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingStudent)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="mt-4">
      <StudentTable
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

interface IStudentTableProps {
  students: IStudent[];
  onDelete: (id: string) => void;
  onEdit: (id: string, student: IStudent) => void;
}
const StudentTable = ({
  students,
  onDelete,
  onEdit,
}: IStudentTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);

  const handleEdit = (student: IStudent) => {
    setSelectedStudent(student);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  return (
    <>
      {selectedStudent && (
        <EditModal
          open={openModal}
          onClose={handleCloseModal}
          student={selectedStudent}
        />
      )}
      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">NAME</th>
            <th className="bg-gray-500 px-3 text-center py-2">GENDER</th>
            <th className="bg-gray-500 px-3 text-center py-2">YEAR GROUP</th>
            <th className="bg-gray-500 px-3 text-center py-2">DATE OF BIRTH</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {students &&
            students.map((student, index) => (
              <tr key={student._id as string}>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.last_name}, {student.first_name}{' '}
                  {student.other_names}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.gender}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.year_group.year}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.dob}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => handleEdit(student)}
                    variant="contained"
                    color="primary"
                  >
                    Edit
                  </Button>
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => onDelete(student._id as string)}
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
  student: IStudent;
  onClose: () => void;
}

const EditModal = ({open: openModal, student, onClose}: IEditProps) => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [studentInfo, setStudentInfo] = useState<IStudent>({
    ...student,
    session: student.session._id as any,
    year_group: student.year_group.year as any,
    classroom: student?.classroom?.name as any,
    dob: student.dob as any,
  });
  const [yearGroups, setYearGroups] = useState<IYearGroup[] | null>(null);
  const [classrooms, setClassrooms] = useState<IClassroom[] | null>(null);
  const [updateStudent, {isLoading: isLoadingUpdate}] =
    useUpdateStudentMutation();
  const {
    data: fetchedYearGroups,
    isLoading: isLoadingYearGroups,
    isSuccess: isSuccesYearGroups,
  } = useFetchYearGroupsQuery();
  const {
    data: fetchedClassrooms,
    isLoading: isLoadingClassrooms,
    isSuccess: isSuccesClassrooms,
  } = useFetchClassroomsQuery({session_id: currentSession?._id as any});

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('stdu', studentInfo);
    await updateStudent({
      student_id: studentInfo._id as string,
      body: {
        ...studentInfo,
        dob: studentInfo.dob as any,
        year_group: yearGroups?.find(
          yg => yg.year === (studentInfo.year_group as unknown as string)
        )?._id as any,
        classroom: classrooms?.find(
          c => c.name === (studentInfo.classroom as unknown as string)
        )?._id as any,
      },
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

    setStudentInfo({
      ...student,
      session: student.session._id as any,
      year_group: student.year_group.year as any,
      classroom: student?.classroom?.name as any,
      dob: student.dob as any,
    });
  }, [fetchedYearGroups, fetchedClassrooms, student]);

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className="flex flex-col flex-1 gap-4 m-auto w-96 h-fit p-4 bg-background translate-y-2">
        <TextField
          value={studentInfo.first_name}
          label="First Name"
          onChange={e =>
            setStudentInfo({
              ...studentInfo,
              first_name: e.target.value as string,
            })
          }
          required
        />
        <TextField
          value={studentInfo.last_name}
          label="Last Name"
          onChange={e =>
            setStudentInfo({
              ...studentInfo,
              last_name: e.target.value as string,
            })
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
            fetchedYearGroups?.data
              ? (fetchedYearGroups?.data as IYearGroup[]).map(
                  yearGroup => yearGroup.year
                )
              : ['']
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
            fetchedClassrooms?.data
              ? (fetchedClassrooms?.data as IClassroom[]).map(
                  classroom => classroom.name
                )
              : ['']
          }
        />

        <FormControl fullWidth>
          <label htmlFor="start">Role</label>
          <input
            type="date"
            id="start"
            name="trip-start"
            value={studentInfo.dob}
            onChange={e =>
              setStudentInfo({
                ...studentInfo,
                dob: (e.target as HTMLInputElement).value as string as any,
              })
            }
            min="190-01-01"
            max="2018-12-31"
          />
        </FormControl>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
