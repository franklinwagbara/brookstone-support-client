import {Button, CircularProgress, Modal} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {
  IClassroomRequest,
  useFetchClassroomsQuery,
} from '../../../../features/classroom/classroom_api_slice';
import {
  IClassroomEnrollmentRequest,
  useDeleteClassroomEnrollmentMutation,
  useFetchClassroomEnrollmentsQuery,
  useUpdateClassroomEnrollmentMutation,
} from '../../../../features/classroomEnrollment/classroomEnrollment_api_slice';
import {setClassroomEnrollments} from '../../../../features/classroomEnrollment/classroomEnrollment_slice';
import {useFetchSessionsQuery} from '../../../../features/session/session_api_slice';
import {useFetchStudentsQuery} from '../../../../features/student/student_api_slice';
import {useFetchUsersQuery} from '../../../../features/user/user_api_slice';
import {
  IClassroom,
  IClassroomEnrollment,
  IResult,
  ISession,
  IStudent,
  ISubject,
  ITranscript,
  IUser,
} from '../../../../interfaces';

export const ViewClassroomEnrollments = (): JSX.Element => {
  const classroomEnrollments = useAppSelector(
    state => state.classroomEnrollment.classroomEnrollments
  );

  const [users, setUsers] = useState<IUser[] | null>(null);

  const dispatch = useAppDispatch();
  const {
    data: fetchedUsers,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useFetchUsersQuery();
  const {
    data,
    isLoading: isLoadingEnrollment,
    isSuccess: isSuccessEnrollment,
  } = useFetchClassroomEnrollmentsQuery({} as IClassroomEnrollmentRequest);
  const [deleteClassroomEnrollment] = useDeleteClassroomEnrollmentMutation();

  useEffect(() => {
    if (isSuccessEnrollment && data.data) {
      dispatch(setClassroomEnrollments(data.data));
    }
    if (isSuccessUsers) {
      setUsers(fetchedUsers.data as IUser[]);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      await deleteClassroomEnrollment({_id: id} as IClassroomEnrollmentRequest);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingEnrollment)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="mt-4">
      <ClassroomEnrollmentTable
        enrollments={classroomEnrollments}
        users={users}
        onDelete={handleDelete}
      />
    </div>
  );
};

interface IClassroomEnrollmentTableProps {
  enrollments: IClassroomEnrollment[];
  users: IUser[] | null;
  onDelete: (id: string) => void;
}
const ClassroomEnrollmentTable = ({
  enrollments,
  users,
  onDelete,
}: IClassroomEnrollmentTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<IClassroomEnrollment | null>(null);

  const handleEdit = (enrollment: IClassroomEnrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  console.log('Enrollmentsssss', enrollments);
  return (
    <>
      {selectedEnrollment && (
        <EditModal
          open={openModal}
          onClose={handleCloseModal}
          enrollment={selectedEnrollment}
        />
      )}
      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">STUDENT NAME</th>
            <th className="bg-gray-500 px-3 text-center py-2">FORM ROOM</th>
            <th className="bg-gray-500 px-3 text-center py-2">FORM TUTOR</th>
            <th className="bg-gray-500 px-3 text-center py-2">SESSION</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {enrollments &&
            enrollments.map((enrollment, index) => {
              const form_tutor = users?.find(
                user =>
                  (user._id as string) ===
                  (enrollment.classroom.form_tutor as any)
              );
              return (
                <tr key={enrollment._id as string}>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    {enrollment?.student?.last_name},{' '}
                    {enrollment?.student?.first_name}{' '}
                    {enrollment?.student?.other_names}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    {enrollment?.classroom?.name}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    {form_tutor?.lastname + ', ' + form_tutor?.firstname}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    {enrollment?.session?.session}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    <Button
                      onClick={() => handleEdit(enrollment)}
                      variant="contained"
                      color="primary"
                    >
                      Edit
                    </Button>
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    <Button
                      onClick={() => onDelete(enrollment._id as string)}
                      variant="contained"
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

interface IEditProps {
  open: boolean;
  enrollment: IClassroomEnrollment;
  onClose: () => void;
}

const EditModal = ({open: openModal, enrollment, onClose}: IEditProps) => {
  const [students, setStudents] = useState<IStudent[] | null>(null);
  const [classrooms, setClassrooms] = useState<IClassroom[] | null>(null);
  const [sessions, setSessions] = useState<ISession[] | null>(null);
  const [enrollmentInfo, setEnrollmentInfo] = useState<IClassroomEnrollment>({
    _id: enrollment?._id,
    student: (enrollment?.student?.last_name +
      ', ' +
      enrollment?.student?.first_name) as any,

    classroom: enrollment?.classroom?.name as any,
    session: !enrollment.session
      ? ('' as any)
      : (enrollment.session.session as any),
  });

  const [updateEnrollment, {isLoading: isLoadingUpdate}] =
    useUpdateClassroomEnrollmentMutation();
  const {
    data: fetchedStudents,
    isLoading: isLoadingStudents,
    isSuccess: isSuccesStudents,
  } = useFetchStudentsQuery();

  const {
    data: fetchedSessions,
    isLoading: isLoadingSessions,
    isSuccess: isSuccesSessions,
  } = useFetchSessionsQuery();

  const {
    data: fetchedClassrooms,
    isLoading: isLoadingClassrooms,
    isSuccess: isSuccesClassrooms,
  } = useFetchClassroomsQuery({} as IClassroomRequest);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const enrollmentQuery: IClassroomEnrollmentRequest = {
      _id: enrollmentInfo._id as string,
      student: students?.find(
        student =>
          student.last_name + ', ' + student.first_name ===
          (enrollmentInfo.student as any)
      )?._id as any,

      session: sessions?.find(
        session => session.session === (enrollmentInfo.session as any)
      )?._id as any,

      classroom: classrooms?.find(
        classroom => classroom.name === (enrollmentInfo.classroom as any)
      )?._id as any,
    };
    await updateEnrollment(enrollmentQuery);
    onClose();
  };

  useEffect(() => {
    if (isSuccesStudents)
      setStudents((fetchedStudents as IResult<IStudent>).data as IStudent[]);
    if (isSuccesClassrooms)
      setClassrooms(
        (fetchedClassrooms as IResult<IClassroom>).data as IClassroom[]
      );
    if (isSuccesSessions)
      setSessions((fetchedSessions as IResult<ISession>).data as ISession[]);
  }, [fetchedStudents, fetchedClassrooms, fetchedSessions]);

  if (isLoadingStudents || isLoadingClassrooms || isLoadingSessions) {
    return <Loading loading={true} />;
  }

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className="flex flex-col flex-1 gap-4 m-auto w-96 h-fit p-4 bg-background translate-y-1/2">
        <InputSelect
          label="Student Name"
          value={enrollmentInfo.student}
          onChange={e =>
            setEnrollmentInfo({...enrollmentInfo, student: e.target.value})
          }
          selectionList={
            fetchedStudents?.data
              ? (fetchedStudents?.data as IStudent[]).map(
                  student => student.last_name + ', ' + student.first_name
                )
              : ['']
          }
        />

        <InputSelect
          label="Classroom"
          value={enrollmentInfo.classroom}
          onChange={e =>
            setEnrollmentInfo({...enrollmentInfo, classroom: e.target.value})
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
          label="Session"
          value={enrollmentInfo.session}
          onChange={e =>
            setEnrollmentInfo({...enrollmentInfo, session: e.target.value})
          }
          selectionList={
            fetchedSessions?.data
              ? (fetchedSessions?.data as ISession[]).map(
                  session => session.session
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
