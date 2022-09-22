import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {RoomCard} from '../../components';
import {useFetchBoardingHousesQuery} from '../../features/boardingHouse/boardingHouse_api_slice';
import {useFetchBoardingEnrollmentsQuery} from '../../features/boardingEnrollment/boardingEnrollment_api_slice';
import {IBoardingHouse, IBoardingEnrollment} from '../../interfaces';

export const AssignedBoardingHouses = () => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const [boardingHouse, setBoardingHouse] = useState<IBoardingHouse | null>(
    null
  );
  const [boardingEnrollments, setBoardingEnrollments] = useState<
    IBoardingEnrollment[] | null
  >(null);

  const navigate = useNavigate();
  const {
    data: fetchedBoardingHouse,
    isLoading: isLoadingBoardingHouse,
    isSuccess: isSuccessBoardingHouse,
  } = useFetchBoardingHousesQuery(
    {boarding_parent: currentUser?._id, session: currentSession?._id},
    {skip: !currentUser || !currentSession}
  );
  const {
    data: fetchedBoardingHouseEnrollments,
    isLoading: isLoadingBoardingHouseEnrollments,
    isSuccess: isSuccessBoardingHouseEnrollments,
  } = useFetchBoardingEnrollmentsQuery(
    {
      session: currentSession?._id as any,
      boarding_house: boardingHouse?._id as any,
    },
    {skip: !boardingHouse?._id || !currentSession?._id}
  );

  const handleRenderBoardingHouse = (boarding_house_id: string) => {
    navigate(`/dashboard/houselist/${boarding_house_id}`);
  };

  useEffect(() => {
    if (
      isSuccessBoardingHouse &&
      fetchedBoardingHouse.data &&
      (fetchedBoardingHouse.data as IBoardingHouse[])[0]
    ) {
      setBoardingHouse((fetchedBoardingHouse.data as IBoardingHouse[])[0]);
    }

    if (isSuccessBoardingHouseEnrollments) {
      setBoardingEnrollments(
        fetchedBoardingHouseEnrollments.data as IBoardingEnrollment[]
      );
    }
  }, [fetchedBoardingHouse, fetchedBoardingHouseEnrollments]);

  return (
    <div
      id="main"
      className="basis-5/6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      {boardingHouse &&
        boardingEnrollments &&
        boardingEnrollments?.length > 0 && (
          <RoomCard
            id={boardingHouse._id as string}
            class_name={boardingHouse.name}
            form_tutor={
              boardingHouse?.boarding_parent?.lastname +
              ', ' +
              boardingHouse?.boarding_parent?.firstname
            }
            population={boardingEnrollments?.length}
            onClick={() => handleRenderBoardingHouse(boardingHouse._id)}
          />
        )}
    </div>
  );
};
