import {Modal, TextField, FormControl, Button} from '@mui/material';
import {useState, useEffect} from 'react';
import {useAppSelector} from '../app/hooks';
import {useFetchClassroomsQuery} from '../features/classroom/classroom_api_slice';
import {useUpdateStudentMutation} from '../features/student/student_api_slice';
import {useFetchYearGroupsQuery} from '../features/yearGroup/yearGroup_api_slice';
import {
  IClassroomEnrollment,
  IYearGroup,
  IResult,
  IClassroom,
  IClassroomEnrollment,
} from '../interfaces';
import {InputSelect} from './InputSelect';

interface IEditProps {
  open: boolean;
  enrollment: IClassroomEnrollment;
  onClose: () => void;
}

export const EditFormRoomModal = ({
  open: openModal,
  enrollment,
  onClose,
}: IEditProps) => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [enrollmentInfo, setEnrollmentInfo] = useState<IClassroomEnrollment>({
    ...enrollment,
    session: enrollment.session._id as any,
    year_group: enrollment.year_group.year as any,
  });
  const [yearGroups, setYearGroups] = useState<IYearGroup[] | null>(null);
  const [updateStudent, {isLoading: isLoadingUpdate}] =
    useUpdateStudentMutation();
  const {
    data: fetchedYearGroups,
    isLoading: isLoadingYearGroups,
    isSuccess: isSuccesYearGroups,
  } = useFetchYearGroupsQuery();
  const {
    data: fetchedClassrooms,
    isLoading: isLoadingClassrooms,
    isSuccess: isSuccesClassrooms,
  } = useFetchClassroomsQuery({session_id: currentSession?._id as any});

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await updateStudent({
      student_id: studentInfo._id as string,
      body: {
        ...studentInfo,
        dob: studentInfo.dob as any,
        year_group: studentInfo.year_group._id as any,
        classroom: studentInfo.classroom._id as any,
      },
    });
    onClose();
  };

  useEffect(() => {
    if (isSuccesYearGroups) {
      setYearGroups(
        (fetchedYearGroups as IResult<IYearGroup>).data as IYearGroup[]
      );
      //setEnrollmentInfo(prev => ({...prev, year_group: }));
    }
  }, [fetchedYearGroups]);

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className="flex flex-col flex-1 gap-4 m-auto w-96 h-fit p-4 bg-background translate-y-1/4">
        <TextField
          value={studentInfo.first_name}
          label="First Name"
          onChange={e =>
            setEnrollmentInfo({
              ...studentInfo,
              first_name: e.target.value as string,
            })
          }
          required
        />
        <TextField
          value={studentInfo.last_name}
          label="Last Name"
          onChange={e =>
            setEnrollmentInfo({
              ...studentInfo,
              last_name: e.target.value as string,
            })
          }
          required
        />
        <TextField
          value={studentInfo.other_names}
          label="Other Names"
          onChange={e =>
            setEnrollmentInfo({
              ...studentInfo,
              other_names: e.target.value as string,
            })
          }
        />
        <InputSelect
          label="Gender"
          value={studentInfo.gender}
          onChange={e =>
            setEnrollmentInfo({
              ...studentInfo,
              gender: (e.target as HTMLInputElement).value as string as any,
            })
          }
          selectionList={['Male', 'Female']}
        />

        <InputSelect
          label="Year Group"
          value={studentInfo.year_group}
          onChange={e =>
            setEnrollmentInfo({
              ...studentInfo,
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
        <InputSelect
          label="Form Room"
          value={studentInfo.classroom}
          onChange={e =>
            setEnrollmentInfo({
              ...studentInfo,
              classroom: (e.target as HTMLInputElement).value as string as any,
            })
          }
          selectionList={
            fetchedClassrooms?.data
              ? (fetchedClassrooms?.data as IClassroom[]).map(
                  classroom => classroom.name
                )
              : ['']
          }
        />

        <FormControl fullWidth>
          <label htmlFor="start">Role</label>
          <input
            type="date"
            id="start"
            name="trip-start"
            value={studentInfo.dob}
            onChange={e =>
              setEnrollmentInfo({
                ...studentInfo,
                dob: (e.target as HTMLInputElement).value as string as any,
              })
            }
            min="190-01-01"
            max="2018-12-31"
          />
        </FormControl>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
