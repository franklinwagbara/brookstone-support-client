import {Link, Navigate, useNavigate} from 'react-router-dom';
import {Assessment, Card} from '.';
import {useAppSelector} from '../app/hooks';

export const AssignedClasses = () => {
  const enrollments = useAppSelector(state => state.enrollment.enrollments);
  const navigate = useNavigate();

  const handleRenderAssessment = (id: string) => {
    navigate(`/dashboard/assessment/${id}`);
  };
  return (
    <div
      id="main"
      className="basis-5/6 px-6 py-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {enrollments &&
        enrollments.map(enrollment => (
          <Card
            key={enrollment._id as string}
            id={enrollment._id as string}
            class_name={enrollment.classroom.name}
            subject_name={enrollment.subject.name}
            teacher_name={enrollment.teacher.username}
            onClick={() => handleRenderAssessment(enrollment._id as string)}
          />
        ))}
    </div>
  );
};
