import {Button, CircularProgress, Modal} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {
  IBoardingHouseRequest,
  useFetchBoardingHousesQuery,
} from '../../../../features/boardingHouse/boardingHouse_api_slice';
import {
  IBoardingEnrollmentRequest,
  useDeleteBoardingEnrollmentMutation,
  useFetchBoardingEnrollmentsQuery,
  useUpdateBoardingEnrollmentMutation,
} from '../../../../features/boardingEnrollment/boardingEnrollment_api_slice';
import {setBoardingEnrollments} from '../../../../features/boardingEnrollment/boardingEnrollment_slice';
import {useFetchSessionsQuery} from '../../../../features/session/session_api_slice';
import {useFetchStudentsQuery} from '../../../../features/student/student_api_slice';
import {useFetchUsersQuery} from '../../../../features/user/user_api_slice';
import {
  IBoardingEnrollment,
  IBoardingHouse,
  IResult,
  ISession,
  IStudent,
  IUser,
} from '../../../../interfaces';

export const ViewBoardingEnrollments = (): JSX.Element => {
  const boardingEnrollments = useAppSelector(
    state => state.boardingEnrollment.boardingEnrollments
  );

  const [users, setUsers] = useState<IUser[] | null>(null);

  const dispatch = useAppDispatch();
  const {
    data: fetchedUsers,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useFetchUsersQuery();
  const {
    data: fetchedBoardingEnrollment,
    isLoading: isLoadingBoardingEnrollment,
    isSuccess: isSuccessBoardingEnrollment,
  } = useFetchBoardingEnrollmentsQuery({} as IBoardingEnrollmentRequest);
  const [deleteBoardingEnrollment] = useDeleteBoardingEnrollmentMutation();

  useEffect(() => {
    if (isSuccessBoardingEnrollment && fetchedBoardingEnrollment.data) {
      dispatch(setBoardingEnrollments(fetchedBoardingEnrollment.data));
    }
    if (isSuccessUsers) {
      setUsers(fetchedUsers.data as IUser[]);
    }
  }, [fetchedBoardingEnrollment]);

  const handleDelete = async (id: string) => {
    try {
      await deleteBoardingEnrollment({_id: id} as IBoardingEnrollmentRequest);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingBoardingEnrollment)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="mt-4">
      <BoardingEnrollmentTable
        boardingEnrollments={boardingEnrollments}
        users={users}
        onDelete={handleDelete}
      />
    </div>
  );
};

interface IBoardingEnrollmentTableProps {
  boardingEnrollments: IBoardingEnrollment[];
  users: IUser[] | null;
  onDelete: (id: string) => void;
}
const BoardingEnrollmentTable = ({
  boardingEnrollments,
  users,
  onDelete,
}: IBoardingEnrollmentTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<IBoardingEnrollment | null>(null);

  const handleEdit = (enrollment: IBoardingEnrollment) => {
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
            <th className="bg-gray-500 px-3 text-center py-2">FORM ROOM</th>
            <th className="bg-gray-500 px-3 text-center py-2">FORM TUTOR</th>
            <th className="bg-gray-500 px-3 text-center py-2">SESSION</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {boardingEnrollments &&
            boardingEnrollments.map(
              (enrollment: IBoardingEnrollment, index) => {
                const boarding_parent = users?.find(
                  user =>
                    (user._id as string) ===
                    (enrollment.boarding_house.boarding_parent as any)
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
                      {enrollment?.boarding_house?.name}
                    </td>
                    <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                      {boarding_parent?.lastname +
                        ', ' +
                        boarding_parent?.firstname}
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
              }
            )}
        </tbody>
      </table>
    </>
  );
};

interface IEditProps {
  open: boolean;
  enrollment: IBoardingEnrollment;
  onClose: () => void;
}

const EditModal = ({open: openModal, enrollment, onClose}: IEditProps) => {
  const [students, setStudents] = useState<IStudent[] | null>(null);
  const [boardingHouses, setBoardingHouses] = useState<IBoardingHouse[] | null>(
    null
  );
  const [sessions, setSessions] = useState<ISession[] | null>(null);
  const [enrollmentInfo, setEnrollmentInfo] = useState<IBoardingEnrollment>({
    _id: enrollment?._id,
    student: (enrollment?.student?.last_name +
      ', ' +
      enrollment?.student?.first_name) as any,

    boarding_house: enrollment?.boarding_house?.name as any,
    session: !enrollment.session
      ? ('' as any)
      : (enrollment.session.session as any),
  });

  const [
    updateBoardingEnrollment,
    {isLoading: isLoadingBoardingEnrollmentUpdate},
  ] = useUpdateBoardingEnrollmentMutation();
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
    const enrollmentQuery: IBoardingEnrollmentRequest = {
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
    await updateBoardingEnrollment(enrollmentQuery);
    onClose();
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

    setEnrollmentInfo({
      _id: enrollment?._id,
      student: (enrollment?.student?.last_name +
        ', ' +
        enrollment?.student?.first_name) as any,

      boarding_house: enrollment?.boarding_house?.name as any,
      session: !enrollment.session
        ? ('' as any)
        : (enrollment.session.session as any),
    });
  }, [fetchedStudents, fetchedBoardingHouses, fetchedSessions, enrollment]);

  if (isLoadingStudents || isLoadingBoardingHouses || isLoadingSessions) {
    return <Loading loading={true} />;
  }

  console.log('EnrollmentInfo=++++', enrollmentInfo);
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
          label="Boarding House"
          value={enrollmentInfo.boarding_house}
          onChange={e =>
            setEnrollmentInfo({
              ...enrollmentInfo,
              boarding_house: e.target.value,
            })
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

        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
