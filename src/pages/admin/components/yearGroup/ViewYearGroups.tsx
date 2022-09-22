import {Button, CircularProgress, Modal, TextField} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {setAlert} from '../../../../features/alert/alert-slice';
import {useFetchSessionsQuery} from '../../../../features/session/session_api_slice';
import {
  IYearGroupRequest,
  useDeleteYearGroupMutation,
  useFetchYearGroupsQuery,
  useUpdateYearGroupMutation,
} from '../../../../features/yearGroup/yearGroup_api_slice';
import {AlertType} from '../../../../globals';
import {IResult, ISession, IYearGroup} from '../../../../interfaces';

export const ViewYearGroups = (): JSX.Element => {
  //const yearGroups = useAppSelector(state => state.yearGroup.yearGroups);
  const [yearGroups, setYearGroups] = useState<IYearGroup[] | null>(null);
  const dispatch = useAppDispatch();

  const {
    data: fetchedYearGroups,
    isLoading: isLoadingYearGroups,
    isSuccess: isSuccessYearGroups,
  } = useFetchYearGroupsQuery();
  const [deleteSubject] = useDeleteYearGroupMutation();

  useEffect(() => {
    if (isSuccessYearGroups && fetchedYearGroups.data) {
      setYearGroups(fetchedYearGroups.data as IYearGroup[]);
    }
  }, [fetchedYearGroups]);

  const handleEdit = async (id: string, subject: IYearGroup) => {};

  const handleDelete = async (id: string) => {
    await deleteSubject({yearGroup_id: id} as IYearGroupRequest)
      .unwrap()
      .then(() => {
        //refetchClassroomEnrollments();
        dispatch(
          setAlert({
            message: 'Deletion was successfull!',
            show: true,
            type: AlertType.SUCCESS,
          })
        );
      })
      .catch(error => {
        dispatch(
          setAlert({
            message:
              'Something went wrong while trying to delete the year group!',
            show: true,
            type: AlertType.ERROR,
          })
        );
      });
  };

  if (isLoadingYearGroups)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="mt-4">
      <YearGroupTable
        yearGroups={yearGroups as IYearGroup[]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

interface IYearGroupTableProps {
  yearGroups: IYearGroup[];
  onDelete: (id: string) => void;
  onEdit: (id: string, yearGroup: IYearGroup) => void;
}
const YearGroupTable = ({
  yearGroups,
  onDelete,
  onEdit,
}: IYearGroupTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedYearGroup, setSelectedYearGroup] = useState<IYearGroup | null>(
    null
  );

  const handleEdit = (yearGroup: IYearGroup) => {
    setSelectedYearGroup(yearGroup);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  return (
    <>
      {selectedYearGroup && (
        <EditModal
          open={openModal}
          onClose={handleCloseModal}
          yearGroup={selectedYearGroup}
          yearGroups={yearGroups}
        />
      )}
      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">Year Group</th>
            <th className="bg-gray-500 px-3 text-center py-2">
              School Session
            </th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {yearGroups &&
            yearGroups.map((yearGroup, index) => (
              <tr key={yearGroup._id as string}>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {yearGroup?.year}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {yearGroup?.session?.session}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => handleEdit(yearGroup)}
                    variant="contained"
                    color="primary"
                  >
                    Edit
                  </Button>
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => onDelete(yearGroup._id as string)}
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
  yearGroup: IYearGroup;
  yearGroups: IYearGroup[];
  onClose: () => void;
}

const EditModal = ({
  open: openModal,
  yearGroup,
  yearGroups,
  onClose,
}: IEditProps) => {
  const [sessions, setSessions] = useState<ISession[] | null>(null);
  const [yearGroupInfo, setYearGroupInfo] = useState<IYearGroup>({
    ...yearGroup,
  });

  const {
    data: fetchedSessions,
    isLoading: isLoadingSessions,
    isSuccess: isSuccesSessions,
  } = useFetchSessionsQuery();
  const [updateYearGroup, {isLoading: isLoadingUpdateYearGroup}] =
    useUpdateYearGroupMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await updateYearGroup({
      yearGroup_id: yearGroupInfo._id as string,
      body: {
        ...yearGroupInfo,
        session: yearGroups?.find(
          yg =>
            yg.session &&
            yg.session.session === (yearGroupInfo?.session as unknown as string)
        )?._id as any,
      },
    });
    onClose();
  };

  useEffect(() => {
    if (isSuccesSessions)
      setSessions((fetchedSessions as IResult<ISession>).data as ISession[]);

    if (yearGroup) {
      setYearGroupInfo({
        ...yearGroup,
        session: yearGroup.session.session as any,
      });
    }
  }, [fetchedSessions, yearGroup]);

  if (isLoadingSessions) {
    return <Loading loading={true} />;
  }

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className="flex flex-col flex-1 gap-4 m-auto w-96 h-72 p-4 bg-background translate-y-1/2">
        <InputSelect
          label="Year Group"
          value={yearGroupInfo.year}
          onChange={e =>
            setYearGroupInfo({
              ...yearGroupInfo,
              year: (e.target as HTMLInputElement).value as string as any,
            })
          }
          selectionList={[
            'Year 7',
            'Year 8',
            'Year 9',
            'Year 10',
            'Year 11',
            'Year 12',
            'IFY',
          ]}
        />

        <InputSelect
          label="Session"
          value={yearGroupInfo.session}
          onChange={e =>
            setYearGroupInfo({
              ...yearGroupInfo,
              session: (e.target as HTMLInputElement).value as string as any,
            })
          }
          selectionList={
            sessions ? sessions.map(session => session.session) : ['']
          }
        />

        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
