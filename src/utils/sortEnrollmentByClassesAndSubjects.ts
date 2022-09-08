import {IEnrollment, IClasses} from '../interfaces';
import {IClassBySubject} from '../interfaces/IClasses';

export const sortEnrollmentsByClassesAndSubjects = (
  enrollments: IEnrollment[]
) => {
  let subjects: string[] = [];
  let classrooms: string[] = [];
  const classes: IClasses = {};

  enrollments.forEach(enrollment => {
    const _subjects = new Set<string>();
    const _classrooms = new Set<string>();

    _subjects.add(enrollment.subject._id);
    _classrooms.add(enrollment.classroom._id);

    subjects = Array.from(_subjects);
    classrooms = Array.from(_classrooms);
  });

  // enrollments.forEach(enrollment => {
  //   subjects.forEach(subject => {
  //     classrooms.forEach(classroom => {
  //       if (!classes[classroom]) classes[classroom] = [enrollment];
  //       else classes[classroom].push(enrollment);
  //     });
  //   });
  // });

  enrollments.forEach(enrollment => {
    if (!classes[enrollment.classroom._id as string]) {
      const classBySubject = {} as IClassBySubject;
      classBySubject[enrollment.subject._id] = [enrollment];
      classes[enrollment.classroom._id as string] = classBySubject;
    } else {
      if (
        !classes[enrollment.classroom._id as string][
          enrollment.subject._id as string
        ]
      ) {
        classes[enrollment.classroom._id as string][
          enrollment.subject._id as string
        ] = [enrollment];
      } else {
        classes[enrollment.classroom._id as string][
          enrollment.subject._id as string
        ].push(enrollment);
      }
    }
  });

  return classes;
};
