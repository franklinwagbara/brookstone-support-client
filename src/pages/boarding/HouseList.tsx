import {Button} from '@mui/material';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {EditBoardingHouseModal, InputSelect, Loading} from '../../components';
import {useFetchBoardingHouseQuery} from '../../features/boardingHouse/boardingHouse_api_slice';
import {
  useFetchBoardingEnrollmentsQuery,
  useUpdateBoardingEnrollmentMutation,
} from '../../features/boardingEnrollment/boardingEnrollment_api_slice';
import {IBoardingHouse, IBoardingEnrollment} from '../../interfaces';
import {AlertType, WEEKS, WEEKS_MAPPER} from '../../globals/constants';
import {setAlert} from '../../features/alert/alert-slice';

export const HouseList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [boardingHouse, setBoardingHouse] = useState<IBoardingHouse | null>(
    null
  );
  const [enrollments, setEnrollments] = useState<IBoardingEnrollment[] | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<IBoardingEnrollment | null>(null);

  const {house_id} = useParams();
  const {
    data: fetchedBoardingHouse,
    isLoading: isLoadingBoardingHouse,
    isSuccess: isSuccessBoardingHouse,
  } = useFetchBoardingHouseQuery({_id: house_id});
  const {
    data: fetchedBoardingEnrollments,
    refetch: refetchBoardingEnrollments,
    isLoading: isLoadingBoardingEnrollments,
    isSuccess: isSuccessBoardingEnrollments,
  } = useFetchBoardingEnrollmentsQuery({boarding_house: house_id});

  const [
    updateBoardingEnrollment,
    {isLoading: isLoadingBE, isSuccess: isSuccessBE},
  ] = useUpdateBoardingEnrollmentMutation();

  const handleAssessment = (enrollment: IBoardingEnrollment) => {
    setSelectedEnrollment({...enrollment});
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  const handleSubmit = async (boardingHouseInfo: IBoardingEnrollment) => {
    await updateBoardingEnrollment({
      ...(boardingHouseInfo as any),
      _id: boardingHouseInfo._id as string,
      student: boardingHouseInfo.student._id as string,
      session: currentSession?._id as string,
      boarding_house: boardingHouseInfo.boarding_house._id as string,
    })
      .unwrap()
      .then(() => {
        refetchBoardingEnrollments();
        dispatch(
          setAlert({
            message: 'Assessment was successfully updated!',
            show: true,
            type: AlertType.SUCCESS,
          })
        );
      })
      .catch(error => {
        dispatch(
          setAlert({
            message:
              'Something went wrong while trying to save Behaviour assessment!',
            show: true,
            type: AlertType.ERROR,
          })
        );
      });
  };

  useEffect(() => {
    if (isSuccessBoardingHouse) {
      setBoardingHouse(fetchedBoardingHouse.data as IBoardingHouse);
    }
    if (isSuccessBoardingEnrollments) {
      setEnrollments(fetchedBoardingEnrollments.data as IBoardingEnrollment[]);
    }
  }, [fetchedBoardingHouse, fetchedBoardingEnrollments]);

  if (isLoadingBoardingHouse || isLoadingBoardingEnrollments) {
    return <Loading loading={true} />;
  }
  return (
    <div>
      <div id="basic_info" className="basic_info">
        <h3>
          <span className="font-bold tracking-wider">Boarding House: </span>
          {enrollments && enrollments[0].boarding_house.name}
        </h3>
        <h3>
          <span className="font-bold tracking-wider">Boarding Parent: </span>
          {boardingHouse &&
            boardingHouse.boarding_parent.lastname +
              ', ' +
              boardingHouse.boarding_parent.firstname}
        </h3>
        <h3>
          <span className="font-bold tracking-wider">Population: </span>
          {enrollments && enrollments.length}
        </h3>
      </div>
      {enrollments && boardingHouse && (
        <EnrollmentTable
          enrollments={enrollments}
          formRoom={boardingHouse}
          onAssessment={handleAssessment}
        />
      )}
      {selectedEnrollment && (
        <EditBoardingHouseModal
          open={openModal}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          enrollment={selectedEnrollment}
        />
      )}
    </div>
  );
};

interface IBoardingEnrollmentTableProps {
  enrollments: IBoardingEnrollment[];
  formRoom: IBoardingHouse;
  onAssessment: (enrollment: IBoardingEnrollment) => void;
}
const EnrollmentTable = ({
  enrollments,
  formRoom,
  onAssessment,
}: IBoardingEnrollmentTableProps): JSX.Element => {
  const [week, setWeek] = useState<string>('1');

  return (
    <>
      <div className="my-4 mt-8 w-64">
        <InputSelect
          label="Week"
          value={week}
          onChange={e => setWeek(e.target.value as string)}
          selectionList={WEEKS}
          size="small"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">STUDENT NAME</th>
            <th className="bg-gray-500 px-3 text-center py-2">
              FORM TUTOR COMMENT
            </th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {enrollments &&
            enrollments.map(
              (enrollment: IBoardingEnrollment, index: number) => (
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
                    {enrollment &&
                      (enrollment[
                        WEEKS_MAPPER[week] as unknown as string
                      ] as string)}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    <Button
                      onClick={() => onAssessment(enrollment)}
                      variant="contained"
                      color="primary"
                    >
                      Assessment
                    </Button>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </>
  );
};
