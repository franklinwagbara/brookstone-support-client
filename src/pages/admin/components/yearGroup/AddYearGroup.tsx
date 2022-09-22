import {Button} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppSelector} from '../../../../app/hooks';
import {InputSelect, Loading} from '../../../../components';
import {useFetchSessionsQuery} from '../../../../features/session/session_api_slice';
import {
  IYearGroupRequest,
  useAddYearGroupMutation,
} from '../../../../features/yearGroup/yearGroup_api_slice';
import {IResult, ISession, IYearGroup} from '../../../../interfaces';

const initialYearGroupState: IYearGroupRequest = {
  yearGroup_id: '',
  body: {_id: '', year: 'Year 7', session: '' as any},
};

export const AddYearGroup = () => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [sessions, setSessions] = useState<ISession[] | null>(null);
  const [yearGroupInfo, setYearGroupInfo] = useState<IYearGroupRequest>(
    initialYearGroupState
  );

  const {
    data: fetchedSessions,
    isLoading: isLoadingSessions,
    isSuccess: isSuccesSessions,
  } = useFetchSessionsQuery();
  const [addYearGroup, {isLoading: isLoadingYearGroup}] =
    useAddYearGroupMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await addYearGroup({
      ...yearGroupInfo,
      body: {
        ...yearGroupInfo.body,
        session: sessions?.find(
          session => session.session === (yearGroupInfo.body.session as any)
        )?._id as any,
      },
    });
  };

  useEffect(() => {
    if (isSuccesSessions)
      setSessions((fetchedSessions as IResult<ISession>).data as ISession[]);
  }, [fetchedSessions]);

  if (isLoadingYearGroup || isLoadingSessions) {
    return <Loading loading={true} />;
  }

  return (
    <form className="flex flex-col flex-1 gap-4 mt-3 w-96 h-72 p-4 bg-background">
      <InputSelect
        label="Year Group"
        value={yearGroupInfo.body.year}
        onChange={e =>
          setYearGroupInfo({
            ...yearGroupInfo,
            body: {
              ...yearGroupInfo.body,
              year: (e.target as HTMLInputElement).value as string as any,
            },
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
        value={yearGroupInfo.body.session}
        onChange={e =>
          setYearGroupInfo({
            ...yearGroupInfo,
            body: {
              ...yearGroupInfo.body,
              session: (e.target as HTMLInputElement).value as string as any,
            },
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
  );
};
