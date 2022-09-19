import {Button} from '@mui/material';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {EditFormRoomModal, InputSelect, Loading} from '../../components';
import {useFetchClassroomQuery} from '../../features/classroom/classroom_api_slice';
import {
  useFetchClassroomEnrollmentsQuery,
  useUpdateClassroomEnrollmentMutation,
} from '../../features/classroomEnrollment/classroomEnrollment_api_slice';
import {IClassroom, IClassroomEnrollment} from '../../interfaces';
import {AlertType, WEEKS, WEEKS_MAPPER} from '../../globals/constants';
import {setAlert} from '../../features/alert/alert-slice';

export const FormList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [classroom, setClassroom] = useState<IClassroom | null>(null);
  const [enrollments, setEnrollments] = useState<IClassroomEnrollment[] | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<IClassroomEnrollment | null>(null);

  const {formroom_id} = useParams();
  const {
    data: fetchedClassroom,
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
  } = useFetchClassroomQuery({_id: formroom_id});
  const {
    data: fetchedClassroomEnrollments,
    refetch: refetchClassroomEnrollments,
    isLoading: isLoadingClassroomEnrollments,
    isSuccess: isSuccessClassroomEnrollments,
  } = useFetchClassroomEnrollmentsQuery({classroom: formroom_id});

  const [
    updateClassroomEnrollment,
    {isLoading: isLoadingCE, isSuccess: isSuccessCE},
  ] = useUpdateClassroomEnrollmentMutation();

  const handleAssessment = (enrollment: IClassroomEnrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  const handleSubmit = async (formRoomInfo: IClassroomEnrollment) => {
    await updateClassroomEnrollment({
      ...(formRoomInfo as any),
      _id: formRoomInfo._id as string,
      student: formRoomInfo.student._id as string,
      session: currentSession?._id as string,
      classroom: formRoomInfo.classroom._id as string,
    })
      .unwrap()
      .then(() => {
        refetchClassroomEnrollments();
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
    if (isSuccessClassroom) {
      setClassroom(fetchedClassroom.data as IClassroom);
    }
    if (isSuccessClassroomEnrollments) {
      setEnrollments(
        fetchedClassroomEnrollments.data as IClassroomEnrollment[]
      );
    }
  }, [fetchedClassroom, fetchedClassroomEnrollments]);

  if (isLoadingClassroom || isLoadingClassroomEnrollments) {
    return <Loading loading={true} />;
  }
  return (
    <div>
      <div id="basic_info" className="basic_info">
        <h3>
          <span className="font-bold tracking-wider">Class: </span>
          {enrollments && enrollments[0].classroom.name}
        </h3>
        <h3>
          <span className="font-bold tracking-wider">Teacher: </span>
          {classroom &&
            classroom.form_tutor.lastname +
              ', ' +
              classroom.form_tutor.firstname}
        </h3>
        <h3>
          <span className="font-bold tracking-wider">Population: </span>
          {enrollments && enrollments.length}
        </h3>
      </div>
      {enrollments && classroom && (
        <EnrollmentTable
          enrollments={enrollments}
          formRoom={classroom}
          onAssessment={handleAssessment}
        />
      )}
      {selectedEnrollment && (
        <EditFormRoomModal
          open={openModal}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          enrollment={selectedEnrollment}
        />
      )}
    </div>
  );
};

interface IClassroomEnrollmentTableProps {
  enrollments: IClassroomEnrollment[];
  formRoom: IClassroom;
  onAssessment: (enrollment: IClassroomEnrollment) => void;
}
const EnrollmentTable = ({
  enrollments,
  formRoom,
  onAssessment,
}: IClassroomEnrollmentTableProps): JSX.Element => {
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
              (enrollment: IClassroomEnrollment, index: number) => (
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
                      enrollment[WEEKS_MAPPER[week] as unknown as any]}
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
