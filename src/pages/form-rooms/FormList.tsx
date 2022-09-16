import {Button} from '@mui/material';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {EditFormRoomModal, Loading} from '../../components';
import {useFetchClassroomQuery} from '../../features/classroom/classroom_api_slice';
import {useFetchClassroomEnrollmentsQuery} from '../../features/classroomEnrollment/classroomEnrollment_api_slice';
import {IClassroom, IClassroomEnrollment} from '../../interfaces';

export const FormList = (): JSX.Element => {
  const [classroom, setClassroom] = useState<IClassroom | null>(null);
  const [enrollments, setEnrollments] = useState<IClassroomEnrollment[] | null>(
    null
  );

  const {formroom_id} = useParams();
  const {
    data: fetchedClassroom,
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
  } = useFetchClassroomQuery({_id: formroom_id});
  const {
    data: fetchedClassroomEnrollments,
    isLoading: isLoadingClassroomEnrollments,
    isSuccess: isSuccessClassroomEnrollments,
  } = useFetchClassroomEnrollmentsQuery({classroom: formroom_id});

  const handleAssessment = (id: string) => {};

  useEffect(() => {
    if (isSuccessClassroom) {
      setClassroom(fetchedClassroom.data as IClassroom);
    }
    if (isSuccessClassroomEnrollments) {
      setEnrollments(
        fetchedClassroomEnrollments.data as IClassroomEnrollment[]
      );
    }
  }, [isSuccessClassroom, isSuccessClassroomEnrollments]);

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
    </div>
  );
};

interface IClassroomEnrollmentTableProps {
  enrollments: IClassroomEnrollment[];
  formRoom: IClassroom;
  onAssessment: (id: string) => void;
}
const EnrollmentTable = ({
  enrollments,
  formRoom,
  onAssessment,
}: IClassroomEnrollmentTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<IClassroomEnrollment | null>(null);

  const handleEdit = (enrollment: IClassroomEnrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  return (
    <>
      {selectedEnrollment && (
        <EditFormRoomModal
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
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {enrollments &&
            enrollments.map((enrollment, index) => (
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
                  <Button
                    onClick={() => onAssessment(enrollment)}
                    variant="contained"
                    color="primary"
                  >
                    Assessment
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};
