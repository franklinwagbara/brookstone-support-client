import {Button, CircularProgress, Modal} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {setAlert} from '../../../../features/alert/alert-slice';
import {
  IClassroomRequest,
  useFetchClassroomsQuery,
} from '../../../../features/classroom/classroom_api_slice';
import {
  IEnrollmentRequest,
  useDeleteEnrollmentMutation,
  useFetchEnrollmentsQuery,
  useUpdateEnrollmentMutation,
} from '../../../../features/enrollment/enrollment_api_slice';
import {setEnrollments} from '../../../../features/enrollment/enrollment_slice';
import {useFetchSessionsQuery} from '../../../../features/session/session_api_slice';
import {useFetchStudentsQuery} from '../../../../features/student/student_api_slice';
import {useFetchSubjectsQuery} from '../../../../features/subject/subject_api_slice';
import {
  ITranscriptRequest,
  useAddTranscriptMutation,
  useFetchTranscriptsQuery,
} from '../../../../features/transcript/transcript_api_slice';
import {useFetchUsersQuery} from '../../../../features/user/user_api_slice';
import {AlertType} from '../../../../globals';
import {
  IClassroom,
  IEnrollment,
  IResult,
  ISession,
  IStudent,
  ISubject,
  ITranscript,
  IUser,
} from '../../../../interfaces';

export const ViewEnrollments = (): JSX.Element => {
  const enrollments = useAppSelector(state => state.enrollment.enrollments);
  const dispatch = useAppDispatch();
  const {
    data,
    isLoading: isLoadingEnrollment,
    isSuccess: isSuccessEnrollment,
  } = useFetchEnrollmentsQuery({} as IEnrollmentRequest);
  const [deleteEnrollment] = useDeleteEnrollmentMutation();

  useEffect(() => {
    if (isSuccessEnrollment && data.data) {
      dispatch(setEnrollments(data.data));
    }
  }, [data]);

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();

    await deleteEnrollment({_id: id} as IEnrollmentRequest)
      .unwrap()
      .then(payload =>
        dispatch(
          setAlert({
            message: 'Deletion was successful.',
            show: true,
            type: AlertType.SUCCESS,
          })
        )
      )
      .catch((error: any) =>
        dispatch(
          setAlert({
            message: JSON.stringify(error),
            show: true,
            type: AlertType.ERROR,
          })
        )
      );
  };

  if (isLoadingEnrollment)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="mt-4">
      <EnrollmentTable enrollments={enrollments} onDelete={handleDelete} />
    </div>
  );
};

interface IEnrollmentTableProps {
  enrollments: IEnrollment[];
  onDelete: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
}
const EnrollmentTable = ({
  enrollments,
  onDelete,
}: IEnrollmentTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<IEnrollment | null>(null);

  const handleEdit = (enrollment: IEnrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

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
            <th className="bg-gray-500 px-3 text-center py-2">SUBJECT</th>
            <th className="bg-gray-500 px-3 text-center py-2">TEACHER</th>
            <th className="bg-gray-500 px-3 text-center py-2">CLASSROOM</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {enrollments &&
            enrollments.map((enrollment, index) => (
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
                  {enrollment?.subject?.name}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {enrollment?.teacher?.lastname},{' '}
                  {enrollment?.teacher?.firstname}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {enrollment?.classroom?.name}
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
                    onClick={e => onDelete(e, enrollment._id as string)}
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
  enrollment: IEnrollment;
  onClose: () => void;
}

const EditModal = ({open: openModal, enrollment, onClose}: IEditProps) => {
  const [students, setStudents] = useState<IStudent[] | null>(null);
  const [subjects, setSubjects] = useState<ISubject[] | null>(null);
  const [teachers, setTeachers] = useState<IUser[] | null>(null);
  const [classrooms, setClassrooms] = useState<IClassroom[] | null>(null);
  const [sessions, setSessions] = useState<ISession[] | null>(null);
  const [transcripts, setTranscripts] = useState<ITranscript[] | null>(null);
  const dispatch = useAppDispatch();
  const [enrollmentInfo, setEnrollmentInfo] = useState<IEnrollment>({
    _id: enrollment._id,
    student: (enrollment?.student?.last_name +
      ', ' +
      enrollment?.student?.first_name) as any,
    subject: enrollment?.subject?.name as any,
    teacher: (enrollment?.teacher?.lastname +
      ', ' +
      enrollment?.teacher?.firstname) as any,
    classroom: enrollment?.classroom?.name as any,
    session: !enrollment?.session
      ? ('' as any)
      : (enrollment?.session?.session as any),
    transcript: enrollment?.transcript._id as any,
  });

  const [updateEnrollment, {isLoading: isLoadingUpdate}] =
    useUpdateEnrollmentMutation();
  const {
    data: fetchedStudents,
    isLoading: isLoadingStudents,
    isSuccess: isSuccesStudents,
  } = useFetchStudentsQuery();
  const {
    data: fetchedSubjects,
    isLoading: isLoadingSubjects,
    isSuccess: isSuccesSubjects,
  } = useFetchSubjectsQuery();
  const {
    data: fetchedSessions,
    isLoading: isLoadingSessions,
    isSuccess: isSuccesSessions,
  } = useFetchSessionsQuery();
  const {
    data: fetchedUsers,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useFetchUsersQuery();
  const {
    data: fetchedTranscripts,
    isLoading: isLoadingTranscripts,
    isSuccess: isSuccesTranscripts,
  } = useFetchTranscriptsQuery({} as ITranscriptRequest);
  const {
    data: fetchedClassrooms,
    isLoading: isLoadingClassrooms,
    isSuccess: isSuccesClassrooms,
  } = useFetchClassroomsQuery({} as IClassroomRequest);

  const [addTranscript, {isSuccess: isSuccessAddTranscript}] =
    useAddTranscriptMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const enrollmentQuery: IEnrollmentRequest = {
        _id: enrollmentInfo._id as string,
        student: students?.find(
          student =>
            student.last_name + ', ' + student.first_name ===
            (enrollmentInfo.student as any)
        )?._id as any,
        subject: subjects?.find(
          subject => subject.name === (enrollmentInfo.subject as any)
        )?._id as any,
        session: sessions?.find(
          session => session.session === (enrollmentInfo.session as any)
        )?._id as any,
        teacher: teachers?.find(
          teacher =>
            teacher.lastname + ', ' + teacher.firstname ===
            (enrollmentInfo.teacher as any)
        )?._id as any,
        classroom: classrooms?.find(
          classroom => classroom.name === (enrollmentInfo.classroom as any)
        )?._id as any,
      };

      let validTranscript = transcripts?.find(t => {
        const tempT = {...t};
        if (!t.classroom) {
          tempT.classroom = classrooms?.find(
            c => c.name === enrollmentQuery.classroom
          ) as IClassroom;
        }
        tempT.classroom = classrooms
          ? (classrooms[0] as IClassroom)
          : ({} as IClassroom);

        // if (
        //   !tempT?.student?._id ||
        //   !tempT?.subject?._id ||
        //   !tempT?.session?._id ||
        //   !tempT?.classroom?._id
        // )
        //   return false;

        return (
          tempT?.student._id === enrollmentQuery.student &&
          tempT?.subject._id === enrollmentQuery.subject &&
          tempT?.session._id === enrollmentQuery.session &&
          tempT?.classroom._id === enrollmentQuery.classroom
        );
      });

      if (!validTranscript) {
        const addTranscriptResult = await addTranscript({
          student: enrollmentQuery.student as any,
          subject: enrollmentQuery.subject as any,
          session: enrollmentQuery.session as any,
          classroom: enrollmentQuery.classroom as any,
          teacher: enrollmentQuery.teacher as any,
        }).unwrap();
        validTranscript = addTranscriptResult.data as ITranscript;
      }

      enrollmentQuery.transcript = validTranscript._id;
      await updateEnrollment(enrollmentQuery);
      dispatch(
        setAlert({
          message: 'Edition was successfully!',
          show: true,
          type: AlertType.SUCCESS,
        })
      );
    } catch (error) {
      dispatch(
        setAlert({
          message: JSON.stringify(error),
          show: true,
          type: AlertType.ERROR,
        })
      );
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccesStudents)
      setStudents((fetchedStudents as IResult<IStudent>).data as IStudent[]);
    if (isSuccesSubjects)
      setSubjects((fetchedSubjects as IResult<ISubject>).data as ISubject[]);
    if (isSuccessUsers)
      setTeachers((fetchedUsers as IResult<IUser>).data as IUser[]);
    if (isSuccesClassrooms)
      setClassrooms(
        (fetchedClassrooms as IResult<IClassroom>).data as IClassroom[]
      );
    if (isSuccesSessions)
      setSessions((fetchedSessions as IResult<ISession>).data as ISession[]);
    if (isSuccesTranscripts)
      setTranscripts(
        (fetchedTranscripts as IResult<ITranscript>).data as ITranscript[]
      );

    if (enrollment) {
      setEnrollmentInfo({
        _id: enrollment._id,
        student: (enrollment?.student?.last_name +
          ', ' +
          enrollment?.student?.first_name) as any,
        subject: enrollment?.subject?.name as any,
        teacher: (enrollment?.teacher?.lastname +
          ', ' +
          enrollment?.teacher?.firstname) as any,
        classroom: enrollment?.classroom?.name as any,
        session: !enrollment?.session
          ? ('' as any)
          : (enrollment?.session?.session as any),
        transcript: enrollment?.transcript._id as any,
      });
    }
  }, [
    fetchedStudents,
    fetchedSubjects,
    fetchedUsers,
    fetchedClassrooms,
    fetchedSessions,
    fetchedTranscripts,
    enrollment,
  ]);

  if (
    isLoadingStudents ||
    isLoadingSubjects ||
    isLoadingClassrooms ||
    isLoadingSessions ||
    isLoadingTranscripts ||
    isLoadingUsers
  ) {
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
          label="Subject"
          value={enrollmentInfo.subject}
          onChange={e =>
            setEnrollmentInfo({...enrollmentInfo, subject: e.target.value})
          }
          selectionList={
            fetchedSubjects?.data
              ? (fetchedSubjects?.data as ISubject[]).map(
                  subject => subject.name
                )
              : ['']
          }
        />

        <InputSelect
          label="Teacher"
          value={enrollmentInfo.teacher}
          onChange={e =>
            setEnrollmentInfo({...enrollmentInfo, teacher: e.target.value})
          }
          selectionList={
            fetchedUsers?.data
              ? (fetchedUsers?.data as IUser[]).map(
                  user => user.lastname + ', ' + user.firstname
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
