import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from '.';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {setAlert} from '../features/alert/alert-slice';
import {setClasses} from '../features/classes/classes_slice';
import {AlertType} from '../globals';
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
    try {
      if (enrollments) {
        const classes_with_subjects =
          sortEnrollmentsByClassesAndSubjects(enrollments);
        dispatch(setClasses(classes_with_subjects));
      }
    } catch (error) {
      let message = '';
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = JSON.stringify(error);
      }
      dispatch(setAlert({message: message, show: true, type: AlertType.ERROR}));
      console.log(error);
    }
  }, [enrollments]);

  return (
    <div
      id="main"
      className="basis-5/6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      {classes &&
        Object.keys(classes).map(class_key => {
          return Object.keys(classes[class_key]).map(subject_key => {
            const enrollment = classes[class_key][subject_key][0];
            console.log('cllslslsls', classes[enrollment.classroom._id]);
            return (
              <Card
                key={subject_key}
                id={subject_key}
                class_name={enrollment.classroom.name}
                subject_name={enrollment.subject.name}
                teacher_name={enrollment.teacher.username}
                population={
                  classes[enrollment.classroom._id][enrollment.subject._id]
                    .length
                }
                onClick={() => handleRenderAssessment(class_key, subject_key)}
              />
            );
          });
        })}
    </div>
  );
};
