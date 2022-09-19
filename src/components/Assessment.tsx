import './style.css';
import {Button, CircularProgress, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../app/hooks';
import {useParams} from 'react-router-dom';
import {IClasses, IEnrollment, ITranscript} from '../interfaces';
import {
  ITranscriptRequest,
  useUpdateTranscriptMutation,
} from '../features/transcript/transcript_api_slice';
import {useFetchEnrollmentsQuery} from '../features/enrollment/enrollment_api_slice';
import {
  calculateCA1,
  calculateCA2,
  calculateCCM,
  calculateTotal,
  calculateGPA,
  calculateGrade,
} from '../utils';

interface IClassInfo {
  teacher: string;
  teacher_id: string;
  subject: string;
  subject_id: string;
  session: string;
  session_id: string;
  classroom: string;
  classroom_id: string;
  term: string;
  total: number;
}

const initialTranscripts = [] as ITranscript[];

for (let i = 0; i < 50; i++) {
  initialTranscripts.push({
    _id: '' as string,
    teacher: '' as any,
    student: '' as any,
    subject: '' as any,
    session: '' as any,
    classroom: '' as any,
    week_1: '' as unknown as any,
    week_2: '' as unknown as any,
    week_3: '' as unknown as any,
    week_4: '' as unknown as any,
    ca_1: '' as unknown as any,
    half_term_exam: '' as unknown as any,
    ccm: '' as unknown as any,
    week_5: '' as unknown as any,
    week_6: '' as unknown as any,
    week_7: '' as unknown as any,
    week_8: '' as unknown as any,
    week_9: '' as unknown as any,
    ca_2: '' as unknown as any,
    final_exam: '' as unknown as any,
    total: '' as unknown as any,
    grade: '' as any,
    gpa: '' as unknown as any,
    comment: '' as any,
  });
}

export const Assessment = () => {
  const classes = useAppSelector(state => state.classes.classes);
  const {class_id, subject_id} = useParams();
  const [classInfo, setClassInfo] = useState<IClassInfo>({} as IClassInfo);
  const [enrollments, setEnrollments] = useState<IEnrollment[] | null>(null);
  const [transcripts, setTranscripts] = useState<ITranscript[]>(
    [] as ITranscript[]
  );
  const [
    updateTranscript,
    {
      isLoading: isLoadingUpdateTranscript,
      isSuccess: isSuccessUpdateTranscript,
    },
  ] = useUpdateTranscriptMutation();

  const {
    data: fetchedEnrollments,
    isError: isErrorEnrollments,
    isSuccess: isSuccessEnrollments,
    refetch: refetchEnrollments,
  } = useFetchEnrollmentsQuery(
    {
      session: classInfo.session_id,
      teacher: classInfo.teacher_id,
      classroom: classInfo.classroom_id,
      subject: classInfo.subject_id,
    },
    {
      skip:
        !classInfo?.session_id ||
        !classInfo.teacher_id ||
        !classInfo.classroom_id ||
        !classInfo.subject_id,
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    input: string
  ) => {
    if (!transcripts) return;

    const transcript = {...transcripts[index]};
    transcript[input] = e.target.value;
    transcript.ca_1 = calculateCA1(
      transcript.week_1 as any,
      transcript.week_2 as any,
      transcript.week_3 as any,
      transcript.week_4 as any
    );
    transcript.ca_2 = calculateCA2(
      transcript.week_5 as any,
      transcript.week_6 as any,
      transcript.week_7 as any,
      transcript.week_8 as any,
      transcript.week_9 as any
    );
    transcript.ccm = calculateCCM(
      transcript.ca_1 as any,
      transcript.half_term_exam as any
    );

    transcript.total = calculateTotal(
      transcript.ccm as any,
      transcript.ca_2 as any,
      transcript.final_exam as any,
      parseInt(classInfo.classroom)
    );

    transcript.grade = calculateGrade(transcript.total as any);

    transcript.gpa = calculateGPA(transcript.total as any);

    transcripts[index] = transcript;
    setTranscripts([...transcripts]);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    transcripts?.forEach(
      async transcript =>
        await updateTranscript({
          _id: transcript._id as string,
          teacher: transcript.teacher as any,
          student: transcript.student as any,
          subject: transcript.subject as any,
          session: transcript.session as any,
          classroom: transcript.classroom as any,
          week_1: transcript.week_1 ? (transcript.week_1 as any) : ('' as any),
          week_2: transcript.week_2 ? (transcript.week_2 as any) : ('' as any),
          week_3: transcript.week_3 ? (transcript.week_3 as any) : ('' as any),
          week_4: transcript.week_4 ? (transcript.week_4 as any) : ('' as any),
          ca_1: transcript.ca_1 ? (transcript.ca_1 as any) : ('' as any),
          half_term_exam: transcript.half_term_exam
            ? (transcript.half_term_exam as any)
            : ('' as any),
          ccm: transcript.ccm ? (transcript.ccm as any) : ('' as any),
          week_5: transcript.week_5 ? (transcript.week_5 as any) : ('' as any),
          week_6: transcript.week_6 ? (transcript.week_6 as any) : ('' as any),
          week_7: transcript.week_7 ? (transcript.week_7 as any) : ('' as any),
          week_8: transcript.week_8 ? (transcript.week_8 as any) : ('' as any),
          week_9: transcript.week_9 ? (transcript.week_9 as any) : ('' as any),
          ca_2: transcript.ca_2 ? (transcript.ca_2 as any) : ('' as any),
          final_exam: transcript.final_exam
            ? (transcript.final_exam as any)
            : ('' as any),
          total: transcript.total ? (transcript.total as any) : ('' as any),
          grade: transcript.grade ? (transcript.grade as string) : '',
          gpa: transcript.gpa ? (transcript.gpa as any) : ('' as any),
          comment: transcript.comment
            ? (transcript.comment as any)
            : ('' as any),
        } as ITranscriptRequest)
    );
  };

  useEffect(() => {
    refetchEnrollments();
    if (class_id && subject_id) {
      const classInfo: IClassInfo = {
        teacher:
          classes[class_id as string][subject_id as string][0].teacher.username,
        teacher_id: classes[class_id as string][subject_id as string][0].teacher
          ._id as string,
        subject:
          classes[class_id as string][subject_id as string][0].subject.name,
        subject_id: classes[class_id as string][subject_id as string][0].subject
          ._id as string,
        session:
          classes[class_id as string][subject_id as string][0].session.session,
        session_id: classes[class_id as string][subject_id as string][0].session
          ._id as string,
        term: classes[class_id as string][subject_id as string][0].session.term,
        classroom:
          classes[class_id as string][subject_id as string][0].classroom.name,
        classroom_id: classes[class_id as string][subject_id as string][0]
          .classroom._id as string,
        total: classes[class_id as string][subject_id as string].length,
      };
      setEnrollments(classes[class_id as string][subject_id as string]);
      setClassInfo(classInfo);

      if (isSuccessEnrollments) {
        const _transcripts = (fetchedEnrollments?.data as IEnrollment[]).map(
          enrollment => enrollment.transcript
        );
        setTranscripts(_transcripts);
      }
    }
  }, [
    classes,
    isSuccessEnrollments,
    isSuccessUpdateTranscript,
    fetchedEnrollments,
  ]);

  if (isLoadingUpdateTranscript)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="relative w-full">
      <div id="basic_info" className="basic_info ">
        <h3>
          <span className="font-bold tracking-wider">Class: </span>
          {classInfo && classInfo.classroom}
        </h3>
        <h3>
          <span className="font-bold tracking-wider">Subject: </span>
          {classInfo && classInfo.subject}
        </h3>
        <h3>
          <span className="font-bold tracking-wider">Teacher: </span>
          {classInfo && classInfo.teacher}
        </h3>
      </div>
      <form className="">
        <table className="divide-y divide-gray-200 border-separate p-3 shadow-card_shadow">
          <thead className="sticky top-0 bg-gray-50">
            <tr className=" bg-gray-200">
              <th scope="col" className="table-th-sticky">
                S/N
              </th>
              <th scope="col" className="table-th-sticky">
                Student Name
              </th>
              <th scope="col" className="table-th">
                Gender
              </th>
              <th scope="col" className="table-th">
                Week 1
              </th>
              <th scope="col" className="table-th">
                Week 2
              </th>
              <th scope="col" className="table-th">
                Week 3
              </th>
              <th scope="col" className="table-th">
                Week 4
              </th>
              <th scope="col" className="table-th">
                CA 1
              </th>
              <th scope="col" className="table-th">
                Half Term
              </th>
              <th scope="col" className="table-th">
                CCM
              </th>
              <th scope="col" className="table-th">
                Week 5
              </th>
              <th scope="col" className="table-th">
                Week 6
              </th>
              <th scope="col" className="table-th">
                Week 7
              </th>
              <th scope="col" className="table-th">
                Week 8
              </th>
              <th scope="col" className="table-th">
                Week 9
              </th>
              <th scope="col" className="table-th">
                CA 2
              </th>
              <th scope="col" className="table-th">
                Final Exam
              </th>
              <th scope="col" className="table-th">
                Total
              </th>
              <th scope="col" className="table-th">
                Grade
              </th>
              <th scope="col" className="table-th">
                GPA
              </th>
              <th scope="col" className="table-th">
                Comment
              </th>
            </tr>
          </thead>
          <tbody>
            {enrollments &&
              transcripts &&
              transcripts.length > 0 &&
              enrollments.map((enrollment, index) => {
                return (
                  <tr key={index} className="">
                    <td className="table-td-sticky">{index + 1}</td>
                    <td className="table-td-sticky">
                      {enrollment?.student.last_name},{' '}
                      {enrollment?.student.first_name}{' '}
                      {enrollment?.student.other_names}
                    </td>
                    <td className="table-td">M</td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['week_1'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'week_1')}
                      />
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['week_2'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'week_2')}
                      />
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['week_3'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'week_3')}
                      />
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['week_4'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'week_4')}
                      />
                    </td>
                    <td className="table-td font-bold">
                      {transcripts[index]['ca_1'] || ''}
                    </td>
                    <td className="table-td font-bold">
                      <TextField
                        value={transcripts[index]['half_term_exam'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e =>
                          handleInputChange(e, index, 'half_term_exam')
                        }
                      />
                    </td>
                    <td className="table-td font-bold">
                      {transcripts[index]['ccm'] || ''}
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['week_5'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'week_5')}
                      />
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['week_6'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'week_6')}
                      />
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['week_7'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'week_7')}
                      />
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['week_8'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'week_8')}
                      />
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['week_9'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'week_9')}
                      />
                    </td>
                    <td className="table-td font-bold">
                      {transcripts[index]['ca_2'] || ''}
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['final_exam'] || ''}
                        size="small"
                        style={{width: '4em', height: '2.5em'}}
                        onChange={e =>
                          handleInputChange(e, index, 'final_exam')
                        }
                      />
                    </td>
                    <td className="table-td font-bold">
                      {transcripts[index]['total'] || ''}
                    </td>
                    <td className="table-td font-bold">
                      {transcripts[index]['grade'] || ''}
                    </td>
                    <td className="table-td font-bold">
                      {transcripts[index]['gpa'] || ''}
                    </td>
                    <td className="table-td">
                      <TextField
                        value={transcripts[index]['comment'] || ''}
                        size="small"
                        style={{width: '20em', height: '2.5em'}}
                        onChange={e => handleInputChange(e, index, 'comment')}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <Button
          onClick={handleSubmit}
          sx={{marginTop: 1}}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
