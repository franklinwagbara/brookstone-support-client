import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Modal,
  Typography,
  CircularProgress,
} from '@mui/material';
import {useEffect, useState} from 'react';
import {
  IBehaviour,
  IBoardingEnrollment,
  IClassroom,
  IClassroomEnrollment,
  IEnrollment,
  IResult,
  IStudent,
  IYearGroup,
} from '../../../interfaces';
import {InputSelect} from '../../../components';
import logo from '../../../assets/images/logo.png';
import {useAppSelector} from '../../../app/hooks';
import {setClassrooms} from '../../../features/classroom/classroom_slice';
import {useFetchEnrollmentsQuery} from '../../../features/enrollment/enrollment_api_slice';
import {useFetchClassroomEnrollmentsQuery} from '../../../features/classroomEnrollment/classroomEnrollment_api_slice';
import {useFetchBoardingEnrollmentsQuery} from '../../../features/boardingEnrollment/boardingEnrollment_api_slice';
import {useFetchBehavioursQuery} from '../../../features/behaviour/behaviour_api_slice';
import {GiCheckMark} from 'react-icons/gi/';

interface StudentListProps {
  students: IStudent[] | null;
}

export const StudentList = ({students}: StudentListProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);

  const handleClick = (student: IStudent) => {
    setSelectedStudent(student);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  console.log('In studentslist', students);

  return (
    <>
      {selectedStudent && (
        <ReportSheet
          open={openModal}
          onClose={handleCloseModal}
          student={selectedStudent}
        />
      )}
      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">NAME</th>
            <th className="bg-gray-500 px-3 text-center py-2">GENDER</th>
            <th className="bg-gray-500 px-3 text-center py-2">YEAR GROUP</th>
            <th className="bg-gray-500 px-3 text-center py-2">DATE OF BIRTH</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {students &&
            students.map((student, index) => (
              <tr key={student._id as string}>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.last_name}, {student.first_name}{' '}
                  {student.other_names}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.gender}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.year_group.year}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.dob}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => handleClick(student)}
                    variant="contained"
                    color="primary"
                  >
                    View Report
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

interface ReportSheetProps {
  open: boolean;
  student: IStudent;
  onClose: () => void;
}

const weeks: {
  [key: string]: string;
} = {
  'Week 1': 'week_1',
  'Week 2': 'week_2',
  'Week 3': 'week_3',
  'Week 4': 'week_4',
  'Week 5': 'week_5',
  'Week 6': 'week_6',
  'Week 7': 'week_7',
  'Week 8': 'week_8',
  'Week 9': 'week_9',
  'CA 1': 'ca_1',
  'CA 2': 'ca_2',
  CCM: 'ccm',
  'Half Term': 'half_term_exam',
  'Final Exam': 'final_exam',
  Total: 'total',
  GPA: 'gpa',
  Grade: 'grade',
};

const WEEKS_COMMENT_MAPPER: {
  [key: string]: string;
} = {
  'Week 1': 'week_1_comment',
  'Week 2': 'week_2_comment',
  'Week 3': 'week_3_comment',
  'Week 4': 'week_4_comment',
  'Week 5': 'week_5_comment',
  'Week 6': 'week_6_comment',
  'Week 7': 'week_7_comment',
  'Week 8': 'week_8_comment',
  'Week 9': 'week_9_comment',
  'CA 1': 'half_term_comment',
  'CA 2': 'half_term_comment',
  CCM: 'half_term_comment',
  'Final Exam': 'end_of_term_comment',
  Total: 'end_of_term_comment',
  GPA: 'end_of_term_comment',
  Grade: 'end_of_term_comment',
};

export const ReportSheet = ({
  open: openModal,
  student,
  onClose,
}: ReportSheetProps) => {
  const currentSession = useAppSelector(state => state.session.currentSession);
  const [week, setWeek] = useState<any>('Week 1');
  const [enrollments, setEnrollments] = useState<IEnrollment[] | null>(null);
  const [behaviours, setBehaviours] = useState<IBehaviour[] | null>(null);
  const [behaviour, setBehaviour] = useState<IBehaviour | null>(null);
  const [classroomEnrollment, setClassroomEnrollment] =
    useState<IClassroomEnrollment | null>(null);
  const [boardingEnrollment, setBoardingEnrollment] =
    useState<IBoardingEnrollment | null>(null);

  const {
    data: fetchedEnrollments,
    isLoading: isLoadingEnrollments,
    isSuccess: isSuccesEnrollments,
  } = useFetchEnrollmentsQuery({
    session: currentSession?._id as any,
    student: student._id as any,
  });
  const {
    data: fetchedClassroomEnrollments,
    isLoading: isLoadingClassroomEnrollments,
    isSuccess: isSuccessClassroomEnrollments,
  } = useFetchClassroomEnrollmentsQuery(
    {
      student: student._id as any,
      session: currentSession?._id as any,
      classroom: student.classroom?._id as any,
    },
    {skip: !student._id || !currentSession?._id || !student.classroom?._id}
  );

  const {
    data: fetchedBehaviours,
    isLoading: isLoadingBehaviours,
    isSuccess: isSuccessBehaviours,
  } = useFetchBehavioursQuery(
    {
      student: student._id as any,
      session: currentSession?._id as any,
    },
    {skip: !student._id || !currentSession?._id}
  );

  const {
    data: fetchedBoardingEnrollments,
    isLoading: isLoadingBoardingEnrollments,
    isSuccess: isSuccessBoardingEnrollments,
  } = useFetchBoardingEnrollmentsQuery(
    {
      student: student._id as any,
      session: currentSession?._id as any,
    },
    {skip: !student._id || !currentSession?._id}
  );

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose();
  };

  useEffect(() => {
    if (isSuccesEnrollments) {
      setEnrollments(
        (fetchedEnrollments as IResult<IEnrollment>).data as IEnrollment[]
      );
    }

    if (isSuccessClassroomEnrollments) {
      setClassroomEnrollment(
        (
          (fetchedClassroomEnrollments as IResult<IClassroomEnrollment>)
            .data as IClassroomEnrollment[]
        )[0]
      );
    }

    if (isSuccessBehaviours) {
      setBehaviours(
        (fetchedBehaviours as IResult<IBehaviour>).data as IBehaviour[]
      );
    }

    if (isSuccessBoardingEnrollments) {
      setBoardingEnrollment(
        (
          (fetchedBoardingEnrollments as IResult<IBoardingEnrollment>)
            .data as IBoardingEnrollment[]
        )[0]
      );
    }

    const _behaviour = behaviours?.find(b => (week as string).includes(b.week));
    if (_behaviour) setBehaviour(_behaviour);
  }, [
    fetchedEnrollments,
    fetchedClassroomEnrollments,
    fetchedBehaviours,
    week,
  ]);

  if (isLoadingEnrollments)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  console.log('boarding enrollment', boardingEnrollment, behaviour);
  return (
    <div>
      <Dialog open={openModal} onClose={onClose} maxWidth={'xl'}>
        <DialogTitle>
          <div className="flex items-center justify-between">
            <img width={90} src={logo} className="m-3" />
            <div>
              <h3 className="text-center font-bold">
                BROOKSTONE SCHOOL(SECONDARY)
                <br /> STUDENT'S SUPPORT MONITORING FORM
              </h3>
            </div>
            <div id="session-info">
              <h4 className="bg-black text-white text-sm p-1">
                ACADEMIC SESSION
              </h4>
              <p className="text-sm">
                <span className="font-bold">session :</span>{' '}
                {student.session.session}
              </p>
              <p className="text-sm">
                <span className="font-bold">term :</span> {student.session.term}
              </p>
              <p className="text-sm my-2">
                <InputSelect
                  label="Week"
                  value={week}
                  onChange={e => setWeek(e.target.value)}
                  selectionList={Object.keys(weeks)}
                  size="small"
                />
              </p>
            </div>
          </div>
          <div className="ml-2 border-2 border-black px-2 ">
            <span className="text-base font-bold">NAME OF STUDENT : </span>
            <span className="text-base font-bold ml-4">
              {student.last_name}, {student.first_name} {student.other_names}
            </span>
          </div>
          <div className="ml-2 mt-2 border-2 border-black px-2 flex ">
            <div className="flex-1">
              <span className="text-base font-bold">YEAR GROUP : </span>
              <span>{student?.year_group.year}</span>
            </div>
            <div>
              <span className="text-base font-bold">FORM ROOM : </span>
              <span className="px-4">{student?.classroom?.name}</span>
            </div>
          </div>
        </DialogTitle>
        <DialogContent sx={{width: '100%'}}>
          <div className="flex flex-col flex-1 gap-4 m-auto w-full h-fit p-4 bg-background mt-2">
            <div className="flex flex-row gap-4 w-full">
              <table className="w-full">
                <caption className="font-bold text-start">
                  SECTION A: ACADEMIC PERFORMANCE
                </caption>
                <thead>
                  <tr>
                    <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
                    <th className="bg-gray-500 px-3 text-center py-2">
                      SUBJECTS
                    </th>
                    <th className="bg-gray-500 px-3 text-center py-2">
                      SCORE (%)
                    </th>
                    <th className="bg-gray-500 px-3 text-center py-2">
                      IMPROVED BY (%)
                    </th>
                    <th className="bg-gray-500 px-3 text-center py-2">
                      TEACHERS' COMMENT
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {enrollments &&
                    enrollments?.map((enrollment, index) => (
                      <tr key={index + 1}>
                        <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                          {enrollment?.subject.name}
                        </td>
                        <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                          {enrollment?.transcript[weeks[week]] as string}
                        </td>
                        <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap"></td>
                        <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                          {enrollment?.transcript?.comment}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div
                id="side_keys"
                className="flex-auto flex-none flex flex-col gap-4 mt-6"
              >
                <div id="key_1" className="border-2 p-1 px-2">
                  <h4 className="text-center bg-black text-white p-1">
                    <Typography>Key</Typography>
                  </h4>
                  <Typography>
                    <b>91-100 (A*) :</b> Distinction
                  </Typography>
                  <Typography>
                    <b>80-90 (A*) :</b> Excellent
                  </Typography>
                  <Typography>
                    <b>70-79 (B) :</b> Very Good
                  </Typography>
                  <Typography>
                    <b>60-69 (C) :</b> Distinction
                  </Typography>
                  <Typography>
                    <b>50-59 (D) :</b> Below average
                  </Typography>
                  <Typography>
                    <b>40-49 (E) :</b> Fair
                  </Typography>
                  <Typography>
                    <b>0-39 (F) :</b> Poor
                  </Typography>
                </div>
                <div id="key_2" className="border-2 p-1 px-2">
                  <h4 className="text-center bg-black text-white p-1">
                    <Typography>Key</Typography>
                  </h4>
                  <Typography>
                    <b>5 :</b> Excellent
                  </Typography>
                  <Typography>
                    <b>4 :</b> Very good
                  </Typography>
                  <Typography>
                    <b>3 :</b> Good
                  </Typography>
                  <Typography>
                    <b>2 :</b> Fair
                  </Typography>
                  <Typography>
                    <b>1 :</b> Unsatisfactory
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 w-full">
              <table>
                <caption className="font-bold text-start">
                  SECTION B: FORM TUTOR’S ASSESSMENT OF STUDENT’S BEHAVIOUR
                </caption>
                <tr>
                  <td rowSpan={1}></td>
                  <th
                    colSpan={5}
                    scope="colgroup"
                    className="border border-black w-52"
                  >
                    <span>RATING</span>
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="border border-black text-start">
                    CRITERIA
                  </th>
                  <th scope="col" className="border border-black">
                    5
                  </th>
                  <th scope="col" className="border border-black">
                    4
                  </th>
                  <th scope="col" className="border border-black">
                    3
                  </th>
                  <th scope="col" className="border border-black">
                    2
                  </th>
                  <th scope="col" className="border border-black">
                    1
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start"
                  >
                    Active participation and composure during lessions
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.active_participation_and_composure_during_lessons as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.active_participation_and_composure_during_lessons as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.active_participation_and_composure_during_lessons as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.active_participation_and_composure_during_lessons as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.active_participation_and_composure_during_lessons as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Ownership of learning
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.ownership_of_learning as string) ===
                    5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.ownership_of_learning as string) ===
                    4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.ownership_of_learning as string) ===
                    3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.ownership_of_learning as string) ===
                    2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.ownership_of_learning as string) ===
                    1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Punctuality and attendance to lessons
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.punctuality_and_attendance_to_lessons as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.punctuality_and_attendance_to_lessons as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.punctuality_and_attendance_to_lessons as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.punctuality_and_attendance_to_lessons as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.punctuality_and_attendance_to_lessons as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Motivation and value for academic success
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.motivation_and_value_for_academic_success as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.motivation_and_value_for_academic_success as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.motivation_and_value_for_academic_success as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.motivation_and_value_for_academic_success as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.motivation_and_value_for_academic_success as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Self-confidence towards academic work
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.self_confidence_towards_academic_work as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.self_confidence_towards_academic_work as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.self_confidence_towards_academic_work as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.self_confidence_towards_academic_work as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.self_confidence_towards_academic_work as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Effective use of study skills
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.effective_use_of_study_skills as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.effective_use_of_study_skills as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.effective_use_of_study_skills as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.effective_use_of_study_skills as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.effective_use_of_study_skills as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Assessed extended learning
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.Assessed_extended_learning as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.Assessed_extended_learning as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.Assessed_extended_learning as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.Assessed_extended_learning as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.Assessed_extended_learning as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              </table>
              <div
                id="form-tutor-comment"
                className="mt-4 border border-black p-2"
              >
                <h4 className="font-bold mb-2">Form Tutor's comment:</h4>
                <p>
                  {classroomEnrollment &&
                    (classroomEnrollment[WEEKS_COMMENT_MAPPER[week]] as string)}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-4 w-full">
              <table>
                <caption className="font-bold text-start">
                  SECTION C: BOARDING PARENT’S ASSESSMENT OF STUDENT’S BEHAVIOUR
                </caption>
                <tr>
                  <td rowSpan={1}></td>
                  <th
                    colSpan={5}
                    scope="colgroup"
                    className="border border-black w-52"
                  >
                    <span>RATING</span>
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="border border-black text-start">
                    CRITERIA
                  </th>
                  <th scope="col" className="border border-black">
                    5
                  </th>
                  <th scope="col" className="border border-black">
                    4
                  </th>
                  <th scope="col" className="border border-black">
                    3
                  </th>
                  <th scope="col" className="border border-black">
                    2
                  </th>
                  <th scope="col" className="border border-black">
                    1
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Completion of extended learning
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.completion_of_extended_learning as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.completion_of_extended_learning as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.completion_of_extended_learning as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.completion_of_extended_learning as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.completion_of_extended_learning as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Organizational skills
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.organizational_skills as string) ===
                    5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.organizational_skills as string) ===
                    4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.organizational_skills as string) ===
                    3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.organizational_skills as string) ===
                    2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.organizational_skills as string) ===
                    1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Obedience to pastoral rules and regulations
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.obedience_to_pastoral_rules_and_regulations as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.obedience_to_pastoral_rules_and_regulations as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.obedience_to_pastoral_rules_and_regulations as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.obedience_to_pastoral_rules_and_regulations as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.obedience_to_pastoral_rules_and_regulations as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Cooperation with support teachers
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_support_teachers as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_support_teachers as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_support_teachers as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_support_teachers as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_support_teachers as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Cooperation with boarding parents
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_boarding_parents as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_boarding_parents as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_boarding_parents as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_boarding_parents as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.cooperation_with_boarding_parents as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Ability to concentrate during prep
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.ability_to_concentrate_during_prep as string
                    ) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.ability_to_concentrate_during_prep as string
                    ) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.ability_to_concentrate_during_prep as string
                    ) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.ability_to_concentrate_during_prep as string
                    ) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(
                      behaviour?.ability_to_concentrate_during_prep as string
                    ) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border border-black px-2 text-start w-100"
                  >
                    Punctuality
                  </th>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.punctuality as string) === 5 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.punctuality as string) === 4 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.punctuality as string) === 3 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.punctuality as string) === 2 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black text-center">
                    {parseInt(behaviour?.punctuality as string) === 1 ? (
                      <div className="w-2 mx-auto">
                        <GiCheckMark />
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              </table>
              <div
                id="form-tutor-comment"
                className="mt-4 border border-black p-2"
              >
                <h4 className="font-bold mb-2">Form Tutor's comment:</h4>
                <p>Comment Here</p>
              </div>
            </div>
            <div className="flex flex-row gap-4 w-full">
              <div id="principal-comment" className="font-bold text-black">
                <span>Principal's Comment: </span>
                <p>Comment here</p>
                <p>Date/Sign:___________________</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
