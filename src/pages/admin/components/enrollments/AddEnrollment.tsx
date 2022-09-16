import {TextField, FormControl, Button} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {
  useFetchClassroomsQuery,
  IClassroomRequest,
} from '../../../../features/classroom/classroom_api_slice';
import {
  useAddEnrollmentMutation,
  useUpdateEnrollmentMutation,
} from '../../../../features/enrollment/enrollment_api_slice';
import {useFetchSessionsQuery} from '../../../../features/session/session_api_slice';
import {useFetchStudentsQuery} from '../../../../features/student/student_api_slice';
import {useFetchSubjectsQuery} from '../../../../features/subject/subject_api_slice';
import {
  useFetchTranscriptsQuery,
  ITranscriptRequest,
  useAddTranscriptMutation,
} from '../../../../features/transcript/transcript_api_slice';
import {useFetchUsersQuery} from '../../../../features/user/user_api_slice';
import {useFetchYearGroupsQuery} from '../../../../features/yearGroup/yearGroup_api_slice';
import {
  IResult,
  IEnrollment,
  IYearGroup,
  IClassroom,
  ISession,
  IStudent,
  ISubject,
  ITranscript,
  IUser,
} from '../../../../interfaces';
import {translateValueToID} from '../../../../utils';

const initialEnrollmentState: IEnrollment = {
  student: '' as any,
  subject: '' as any,
  teacher: '' as any,
  classroom: '' as any,
  session: '' as any,
  transcript: '' as any,
};

export const AddEnrollment = () => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [students, setStudents] = useState<IStudent[] | null>(null);
  const [subjects, setSubjects] = useState<ISubject[] | null>(null);
  const [teachers, setTeachers] = useState<IUser[] | null>(null);
  const [classrooms, setClassrooms] = useState<IClassroom[] | null>(null);
  const [sessions, setSessions] = useState<ISession[] | null>(null);
  const [transcripts, setTranscripts] = useState<ITranscript[] | null>(null);
  const [enrollmentInfo, setEnrollmentInfo] = useState<IEnrollment>({
    student: '' as any,
    subject: '' as any,
    teacher: '' as any,
    classroom: '' as any,
    session: '' as any,
    transcript: '' as any,
  });

  const [addEnrollment, {isSuccess: isSuccessAddEnrollment}] =
    useAddEnrollmentMutation();
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
    const _enrollmentInfo = {
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
      transcript: '' as any,
    };

    console.log('transcripts', transcripts);
    let validTranscript = transcripts?.find((t, i) => {
      console.log(i, t);
      return (
        t.student._id === (_enrollmentInfo.student as any) &&
        t.subject._id === (_enrollmentInfo.subject as any) &&
        t.session._id === (_enrollmentInfo.session as any) &&
        t.classroom._id === (_enrollmentInfo.classroom as any)
      );
    });

    if (!validTranscript) {
      console.log('inside valid transcript');
      const addTranscriptResult = await addTranscript({
        student: _enrollmentInfo.student as any,
        subject: _enrollmentInfo.subject as any,
        session: _enrollmentInfo.session as any,
        classroom: _enrollmentInfo.classroom as any,
        teacher: _enrollmentInfo.teacher as any,
      }).unwrap();
      validTranscript = addTranscriptResult.data as ITranscript;
    }

    _enrollmentInfo.transcript = validTranscript._id as any;
    await addEnrollment(_enrollmentInfo);
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
  }, [
    fetchedStudents,
    fetchedSubjects,
    fetchedUsers,
    fetchedClassrooms,
    fetchedSessions,
    fetchedTranscripts,
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
        label="Subject"
        value={enrollmentInfo.subject}
        onChange={e =>
          setEnrollmentInfo({...enrollmentInfo, subject: e.target.value})
        }
        selectionList={
          fetchedSubjects?.data
            ? (fetchedSubjects?.data as ISubject[]).map(subject => subject.name)
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

      {/*Todo: Add date of birth upload*/}

      <Button onClick={handleSubmit} variant="contained">
        Submit
      </Button>
    </form>
  );
};
