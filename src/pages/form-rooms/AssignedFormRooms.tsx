import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {Loading, RoomCard} from '../../components';
import {useFetchClassroomsQuery} from '../../features/classroom/classroom_api_slice';
import {useFetchClassroomEnrollmentsQuery} from '../../features/classroomEnrollment/classroomEnrollment_api_slice';
import {IClassroom, IClassroomEnrollment} from '../../interfaces';

export const AssignedFormRooms = () => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const [formRoom, setFormRoom] = useState<IClassroom | null>(null);
  const [classroomEnrollments, setClassroomEnrollments] = useState<
    IClassroomEnrollment[] | null
  >(null);

  const navigate = useNavigate();
  const {
    data: fetchedClassroom,
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
  } = useFetchClassroomsQuery(
    {form_tutor: currentUser?._id, session: currentSession?._id},
    {skip: !currentUser || !currentSession}
  );
  const {
    data: fetchedClassroomEnrollments,
    isLoading: isLoadingClassroomEnrollments,
    isSuccess: isSuccessClassroomEnrollments,
  } = useFetchClassroomEnrollmentsQuery(
    {session: currentSession?._id as any, classroom: formRoom?._id as any},
    {skip: !formRoom?._id || !currentSession?._id}
  );

  const handleRenderClassroom = (form_room_id: string) => {
    navigate(`/dashboard/formlist/${form_room_id}`);
  };

  useEffect(() => {
    if (
      isSuccessClassroom &&
      fetchedClassroom.data &&
      (fetchedClassroom.data as IClassroom[])[0]
    ) {
      setFormRoom((fetchedClassroom.data as IClassroom[])[0]);
    }

    if (isSuccessClassroomEnrollments) {
      setClassroomEnrollments(
        fetchedClassroomEnrollments.data as IClassroomEnrollment[]
      );
    }
  }, [fetchedClassroom, fetchedClassroomEnrollments]);

  if (isLoadingClassroom || isLoadingClassroomEnrollments) {
    return <Loading loading={true} />;
  }
  return (
    <div
      id="main"
      className="basis-5/6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      {formRoom && classroomEnrollments && classroomEnrollments.length > 0 && (
        <RoomCard
          id={formRoom._id as string}
          class_name={formRoom.name}
          form_tutor={
            formRoom?.form_tutor?.lastname +
            ', ' +
            formRoom?.form_tutor?.firstname
          }
          population={classroomEnrollments?.length}
          onClick={() => handleRenderClassroom(formRoom._id)}
          color="secondary"
        />
      )}
    </div>
  );
};
