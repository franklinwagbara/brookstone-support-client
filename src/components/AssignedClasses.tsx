import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from '.';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {setClasses} from '../features/classes/classes_slice';
import {sortEnrollmentsByClassesAndSubjects} from '../utils';

export const AssignedClasses = () => {
  const enrollments = useAppSelector(state => state.enrollment.enrollments);
  const classes = useAppSelector(state => state.classes.classes);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRenderAssessment = (class_id: string, subject_id: string) => {
    navigate(`/dashboard/assessment/${class_id}/${subject_id}`);
  };

  useEffect(() => {
    if (enrollments) {
      const classes_with_subjects =
        sortEnrollmentsByClassesAndSubjects(enrollments);
      dispatch(setClasses(classes_with_subjects));
    }
  }, [enrollments]);

  return (
    <div
      id="main"
      className="basis-5/6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      {/* {classes &&
        Object.keys(classes).map(key => {
          const enrollment = classes[key][0];
          return (
            <Card
              key={key}
              id={key}
              class_name={enrollment.classroom.name}
              subject_name={enrollment.subject.name}
              teacher_name={enrollment.teacher.username}
              onClick={() => handleRenderAssessment(key)}
            />
          );
        })} */}

      {classes &&
        Object.keys(classes).map(class_key => {
          return Object.keys(classes[class_key]).map(subject_key => {
            console.log(
              'testing',
              classes
              //classes[class_key][subject_key][0]
            );
            const enrollment = classes[class_key][subject_key][0];
            return (
              <Card
                key={subject_key}
                id={subject_key}
                class_name={enrollment.classroom.name}
                subject_name={enrollment.subject.name}
                teacher_name={enrollment.teacher.username}
                onClick={() => handleRenderAssessment(class_key, subject_key)}
              />
            );
          });
        })}
    </div>
  );
};
