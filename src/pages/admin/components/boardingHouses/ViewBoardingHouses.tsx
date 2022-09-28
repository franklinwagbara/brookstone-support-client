import {Button, CircularProgress, Modal, TextField} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {InputSelect} from '../../../../components';
import {setAlert} from '../../../../features/alert/alert-slice';
import {
  IBoardingHouseRequest,
  useDeleteBoardingHouseMutation,
  useFetchBoardingHousesQuery,
  useUpdateBoardingHouseMutation,
} from '../../../../features/boardingHouse/boardingHouse_api_slice';
import {setBoardingHouses} from '../../../../features/boardingHouse/boardingHouse_slice';
import {useFetchUsersQuery} from '../../../../features/user/user_api_slice';
import {useFetchYearGroupsQuery} from '../../../../features/yearGroup/yearGroup_api_slice';
import {AlertType} from '../../../../globals';
import {
  IBoardingHouse,
  IResult,
  IUser,
  IYearGroup,
} from '../../../../interfaces';

export const ViewBoardingHouses = (): JSX.Element => {
  const boardingHouses = useAppSelector(
    state => state.boardingHouse.boardingHouses
  );
  const currentSession = useAppSelector(state => state.session.currentSession);
  const dispatch = useAppDispatch();
  const {
    data: fetchedBoardingHouses,
    isLoading: isLoadingBoardingHouses,
    isSuccess: isSuccessBoardingHouses,
  } = useFetchBoardingHousesQuery({session: currentSession?._id as any});
  const [deleteBoardingHouse] = useDeleteBoardingHouseMutation();

  useEffect(() => {
    if (isSuccessBoardingHouses && fetchedBoardingHouses.data) {
      dispatch(setBoardingHouses(fetchedBoardingHouses.data));
    }
  }, [fetchedBoardingHouses]);

  const handleEdit = () => {};

  const handleDelete = async (id: string) => {
    try {
      await deleteBoardingHouse({_id: id} as IBoardingHouseRequest);
    } catch (error) {
      let message = '';
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = JSON.stringify(error);
      }

      dispatch(setAlert({message, show: true, type: AlertType.ERROR}));
      console.error(error);
    }
  };

  if (isLoadingBoardingHouses)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="mt-4">
      <BoardingHouseTable
        boardingHouses={boardingHouses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

interface IBoardingHouseTableProps {
  boardingHouses: IBoardingHouse[];
  onDelete: (id: string) => void;
  onEdit?: (id: string, student: IBoardingHouse) => void;
}
const BoardingHouseTable = ({
  boardingHouses,
  onDelete,
  onEdit,
}: IBoardingHouseTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedBoardingHouse, setSelectedBoardingHouse] =
    useState<IBoardingHouse | null>(null);

  const handleEdit = (boardingHouse: IBoardingHouse) => {
    setSelectedBoardingHouse(boardingHouse);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  return (
    <>
      {selectedBoardingHouse && (
        <EditModal
          open={openModal}
          onClose={handleCloseModal}
          boardingHouse={selectedBoardingHouse}
        />
      )}
      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">
              BOARDING HOUSE
            </th>
            <th className="bg-gray-500 px-3 text-center py-2">
              BOARDING PARENT
            </th>
            <th className="bg-gray-500 px-3 text-center py-2">YEAR GROUP</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {boardingHouses &&
            boardingHouses.map((boardingHouse, index) => {
              console.log('inspecting', boardingHouse);
              return (
                <tr key={boardingHouse?._id as string}>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    {boardingHouse?.name}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    {boardingHouse?.boarding_parent?.lastname +
                      ', ' +
                      boardingHouse?.boarding_parent?.firstname}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    {boardingHouse?.year_group?.year}
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    <Button
                      onClick={() => handleEdit(boardingHouse)}
                      variant="contained"
                      color="primary"
                    >
                      Edit
                    </Button>
                  </td>
                  <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                    <Button
                      onClick={() => onDelete(boardingHouse?._id as string)}
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
  boardingHouse: IBoardingHouse;
  onClose: () => void;
}

const EditModal = ({open: openModal, boardingHouse, onClose}: IEditProps) => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [boardingHouseInfo, setBoardingHouseInfo] = useState<IBoardingHouse>({
    ...boardingHouse,
    name: boardingHouse?.name as string,
    boarding_parent: (boardingHouse?.boarding_parent?.lastname +
      ', ' +
      boardingHouse?.boarding_parent?.firstname) as any,
    session: currentSession?.session as any,
  });
  const [yearGroups, setYearGroups] = useState<IYearGroup[] | null>(null);
  const [boardingHouses, setBoardingHouses] = useState<IBoardingHouse[] | null>(
    null
  );
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [updateBoardingHouse, {isLoading: isLoadingBoardingHouseUpdate}] =
    useUpdateBoardingHouseMutation();
  const {
    data: fetchedYearGroups,
    isLoading: isLoadingYearGroups,
    isSuccess: isSuccesYearGroups,
  } = useFetchYearGroupsQuery();
  const {
    data: fetchedUsers,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useFetchUsersQuery();
  const {
    data: fetchedBoardingHouses,
    isLoading: isLoadingBoardingHouses,
    isSuccess: isSuccesBoardingHouses,
  } = useFetchBoardingHousesQuery({session_id: currentSession?._id as any});

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await updateBoardingHouse({
      _id: boardingHouseInfo._id as string,
      name: boardingHouseInfo?.name as string,
      boarding_parent: users?.find(
        user =>
          user.lastname + ', ' + user.firstname ===
          (boardingHouseInfo.boarding_parent as unknown as string)
      )?._id as any,
      session: currentSession?._id as any,
      year_group: yearGroups?.find(
        year =>
          year.year === (boardingHouseInfo.year_group as unknown as string)
      )?._id as any,
      section: boardingHouseInfo.section as any,
    });
    onClose();
  };

  useEffect(() => {
    if (isSuccesYearGroups) {
      setYearGroups(
        (fetchedYearGroups as IResult<IYearGroup>).data as IYearGroup[]
      );
    }
    if (isSuccesBoardingHouses) {
      setBoardingHouses(
        (fetchedBoardingHouses as IResult<IBoardingHouse>)
          .data as IBoardingHouse[]
      );
    }
    if (isSuccessUsers) {
      setUsers((fetchedUsers as IResult<IUser>).data as IUser[]);
    }
  }, [fetchedYearGroups, fetchedBoardingHouses, fetchedUsers]);

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className="flex flex-col flex-1 gap-4 m-auto w-96 h-fit p-4 bg-background translate-y-1/4">
        <TextField
          value={boardingHouseInfo.name}
          label="Boarding House"
          onChange={e =>
            setBoardingHouseInfo({
              ...boardingHouseInfo,
              name: (e.target as HTMLInputElement).value as string as any,
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
            fetchedYearGroups?.data
              ? (fetchedYearGroups?.data as IYearGroup[]).map(
                  yearGroup => yearGroup.year
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
