import {Button} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {
  useFetchClassroomsQuery,
  IClassroomRequest,
} from '../../../../features/classroom/classroom_api_slice';
import {
  useAddClassroomEnrollmentMutation,
  useUpdateClassroomEnrollmentMutation,
} from '../../../../features/classroomEnrollment/classroomEnrollment_api_slice';
import {useFetchSessionsQuery} from '../../../../features/session/session_api_slice';
import {useFetchStudentsQuery} from '../../../../features/student/student_api_slice';
import {
  IResult,
  IClassroomEnrollment,
  IClassroom,
  ISession,
  IStudent,
} from '../../../../interfaces';

const initialEnrollmentState: IClassroomEnrollment = {
  student: '' as any,
  classroom: '' as any,
  session: '' as any,
};

export const AddClassroomEnrollment = () => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [students, setStudents] = useState<IStudent[] | null>(null);
  const [classrooms, setClassrooms] = useState<IClassroom[] | null>(null);
  const [sessions, setSessions] = useState<ISession[] | null>(null);
  const [enrollmentInfo, setEnrollmentInfo] = useState<IClassroomEnrollment>({
    student: '' as any,
    classroom: '' as any,
    session: '' as any,
  });

  const [addEnrollment, {isSuccess: isSuccessAddEnrollment}] =
    useAddClassroomEnrollmentMutation();
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
    const _enrollmentInfo = {
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
    console.log('before sumb', _enrollmentInfo);
    await addEnrollment(_enrollmentInfo);
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
    <form className="flex flex-col flex-1 gap-4 mt-3 w-96 h-72 p-4 bg-background">
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

      {/*Todo: Add date of birth upload*/}

      <Button onClick={handleSubmit} variant="contained">
        Submit
      </Button>
    </form>
  );
};
