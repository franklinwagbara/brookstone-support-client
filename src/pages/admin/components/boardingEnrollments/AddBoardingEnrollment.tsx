import {Button} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {
  useFetchBoardingHousesQuery,
  IBoardingHouseRequest,
} from '../../../../features/boardingHouse/boardingHouse_api_slice';
import {
  useAddBoardingEnrollmentMutation,
  useUpdateBoardingEnrollmentMutation,
} from '../../../../features/boardingEnrollment/boardingEnrollment_api_slice';
import {useFetchSessionsQuery} from '../../../../features/session/session_api_slice';
import {useFetchStudentsQuery} from '../../../../features/student/student_api_slice';
import {
  IResult,
  IBoardingEnrollment,
  IBoardingHouse,
  ISession,
  IStudent,
} from '../../../../interfaces';

const initialEnrollmentState: IBoardingEnrollment = {
  student: '' as any,
  boarding_house: '' as any,
  session: '' as any,
};

export const AddBoardingEnrollment = () => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [students, setStudents] = useState<IStudent[] | null>(null);
  const [boardingHouses, setBoardingHouses] = useState<IBoardingHouse[] | null>(
    null
  );
  const [sessions, setSessions] = useState<ISession[] | null>(null);
  const [enrollmentInfo, setEnrollmentInfo] = useState<IBoardingEnrollment>({
    student: '' as any,
    boarding_house: '' as any,
    session: '' as any,
  });

  const [addEnrollment, {isSuccess: isSuccessAddEnrollment}] =
    useAddBoardingEnrollmentMutation();
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
    data: fetchedBoardingHouses,
    isLoading: isLoadingBoardingHouses,
    isSuccess: isSuccesBoardingHouses,
  } = useFetchBoardingHousesQuery({} as IBoardingHouseRequest);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('onSubmit', enrollmentInfo);
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

      boarding_house: boardingHouses?.find(
        boarding_house =>
          boarding_house.name === (enrollmentInfo.boarding_house as any)
      )?._id as any,
    };
    console.log('_enrollmentinfo', _enrollmentInfo);
    await addEnrollment(_enrollmentInfo);
  };

  useEffect(() => {
    if (isSuccesStudents)
      setStudents((fetchedStudents as IResult<IStudent>).data as IStudent[]);
    if (isSuccesBoardingHouses)
      setBoardingHouses(
        (fetchedBoardingHouses as IResult<IBoardingHouse>)
          .data as IBoardingHouse[]
      );
    if (isSuccesSessions)
      setSessions((fetchedSessions as IResult<ISession>).data as ISession[]);
  }, [fetchedStudents, fetchedBoardingHouses, fetchedSessions]);

  if (isLoadingStudents || isLoadingBoardingHouses || isLoadingSessions) {
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
        label="Boarding House"
        value={enrollmentInfo.boarding_house}
        onChange={e =>
          setEnrollmentInfo({...enrollmentInfo, boarding_house: e.target.value})
        }
        selectionList={
          fetchedBoardingHouses?.data
            ? (fetchedBoardingHouses?.data as IBoardingHouse[]).map(
                boarding_house => boarding_house.name
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
