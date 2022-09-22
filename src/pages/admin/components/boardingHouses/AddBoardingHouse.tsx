import {TextField, FormControl, Button} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {
  useAddBoardingHouseMutation,
  useFetchBoardingHousesQuery,
} from '../../../../features/boardingHouse/boardingHouse_api_slice';
import {useFetchUsersQuery} from '../../../../features/user/user_api_slice';
import {useFetchYearGroupsQuery} from '../../../../features/yearGroup/yearGroup_api_slice';
import {
  IResult,
  IBoardingHouse,
  IYearGroup,
  IUser,
} from '../../../../interfaces';
import {setAlert} from '../../../../features/alert/alert-slice';
import {AlertType} from '../../../../globals';

const initialBoardingHouseState: IBoardingHouse = {
  _id: '',
  name: '',
  boarding_parent: '' as any,
  session: '' as any,
  year_group: '' as any,
  section: '' as any,
  students: [],
};

export const AddBoardingHouse = () => {
  const [yearGroups, setYearGroups] = useState<IYearGroup[] | null>(null);
  const [boardingHouseInfo, setBoardingHouseInfo] = useState<IBoardingHouse>(
    initialBoardingHouseState
  );
  const [users, setUsers] = useState<IUser[] | null>(null);

  const dispatch = useAppDispatch();

  const [addBoardingHouse, {isLoading: isLoadingBoardingHouse}] =
    useAddBoardingHouseMutation();
  const [boardingHouses, setBoardingHouses] = useState<IBoardingHouse[] | null>(
    null
  );
  const currentSession = useAppSelector(state => state.session.currentSession);
  const {
    data: yearGroupsFetchRes,
    isLoading: isLoadingYG,
    isSuccess: isSuccessYearGroups,
  } = useFetchYearGroupsQuery();
  const {
    data: fetchedBoardingHouses,
    isLoading: isLoadingBoardingHouses,
    isSuccess: isSuccessBoardingHouses,
  } = useFetchBoardingHousesQuery({session_id: currentSession?._id as any});
  const {
    data: fetchedUsers,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useFetchUsersQuery();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const _boardingHouseInfo = {
      _id: '',
      name: boardingHouseInfo.name as any,
      boarding_parent: users?.find(
        user =>
          user.lastname + ', ' + user.firstname ===
          (boardingHouseInfo.boarding_parent as unknown as string)
      )?._id as any,
      session: currentSession?._id as any,
      year_group: yearGroups?.find(
        yg => yg.year === (boardingHouseInfo.year_group as unknown as string)
      )?._id as any,
      section: boardingHouseInfo.section as any,
    };
    await addBoardingHouse(_boardingHouseInfo as IBoardingHouse)
      .unwrap()
      .then(payload =>
        dispatch(
          setAlert({
            message: 'Boarding House was created successfully!',
            show: true,
            type: AlertType.SUCCESS,
          })
        )
      )
      .catch(error =>
        dispatch(
          setAlert({
            message: JSON.stringify(error),
            show: true,
            type: AlertType.ERROR,
          })
        )
      );
  };

  useEffect(() => {
    if (isSuccessYearGroups)
      setYearGroups(
        (yearGroupsFetchRes as IResult<IYearGroup>).data as IYearGroup[]
      );
    if (isSuccessBoardingHouses)
      setBoardingHouses(
        (fetchedBoardingHouses as IResult<IBoardingHouse>)
          .data as IBoardingHouse[]
      );
    if (isSuccessUsers) {
      setUsers((fetchedUsers as IResult<IUser>).data as IUser[]);
    }
  }, [yearGroupsFetchRes, fetchedBoardingHouses, fetchedUsers]);

  if (isLoadingYG) {
    return <Loading loading={isLoadingYG} />;
  }

  return (
    <form className="flex flex-col flex-1 gap-4 mt-3 w-96 h-72 p-4 bg-background">
      <TextField
        value={boardingHouseInfo.name}
        label="Boarding House"
        onChange={e =>
          setBoardingHouseInfo({
            ...boardingHouseInfo,
            name: e.target.value as string,
          })
        }
        required
      />
      <InputSelect
        label="Boarding Parent"
        value={boardingHouseInfo.boarding_parent}
        onChange={e =>
          setBoardingHouseInfo({
            ...boardingHouseInfo,
            boarding_parent: (e.target as HTMLInputElement)
              .value as string as any,
          })
        }
        selectionList={
          users ? users.map(u => u.lastname + ', ' + u.firstname) : ['']
        }
      />

      <InputSelect
        label="Year Group"
        value={boardingHouseInfo.year_group}
        onChange={e =>
          setBoardingHouseInfo({
            ...boardingHouseInfo,
            year_group: (e.target as HTMLInputElement).value as string as any,
          })
        }
        selectionList={
          yearGroups ? yearGroups.map(yg => yg.year as string) : ['']
        }
      />

      <InputSelect
        label="Section"
        value={boardingHouseInfo.section}
        onChange={e =>
          setBoardingHouseInfo({
            ...boardingHouseInfo,
            section: (e.target as HTMLInputElement).value as string as any,
          })
        }
        selectionList={['junior', 'senior', 'ify']}
      />

      <Button onClick={handleSubmit} variant="contained">
        Submit
      </Button>
    </form>
  );
};
