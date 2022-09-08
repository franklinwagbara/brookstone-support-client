import './style.css';
import {Button, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../app/hooks';
import {useParams} from 'react-router-dom';
import {IClasses, IEnrollment, ITranscript} from '../interfaces';
import {
  useFetchTranscriptQuery,
  useUpdateTranscriptMutation,
} from '../features/transcript/transcript_api_slice';
import {useFetchEnrollmentsQuery} from '../features/enrollment/enrollment_api_slice';

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

interface Props {}

export const Assessment = () => {
  const classes = useAppSelector(state => state.classes.classes);
  const {class_id, subject_id} = useParams();
  const [classInfo, setClassInfo] = useState<IClassInfo>({} as IClassInfo);
  const [enrollments, setEnrollments] = useState<IEnrollment[] | null>(null);
  const [transcripts, setTranscripts] = useState<ITranscript[] | null>(null);
  const [updateTranscript, {isLoading: isLoadingUpdateTranscript}] =
    useUpdateTranscriptMutation();
  const {data, isError: isFetchTranscriptError} = useFetchTranscriptQuery(
    {
      session: classInfo.session_id,
      teacher: classInfo.teacher_id,
      classroom: classInfo.classroom_id,
      subject: classInfo.subject_id,
    },
    {skip: !classInfo}
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    input: string
  ) => {
    if (!transcripts) return;

    const transcript = {...transcripts[index]};
    transcript[input] = e.target.value;
    transcripts[index] = transcript;
    setTranscripts([...transcripts]);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    transcripts?.forEach(
      async transcript => await updateTranscript(transcript)
    );
  };

  useEffect(() => {
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

      if (!isFetchTranscriptError) {
        if (data?.data) setTranscripts([...(data?.data as ITranscript[])]);
      }
      console.log('transcript in assessment', classes, transcripts, data);
      //const transcripts = classes[id].map(c => c.transcript);
    }
  }, [classes, data]);

  if (isLoadingUpdateTranscript) return <div>Submitting form...</div>;

  return (
    <>
      <div id="basic_info" className="basic_info">
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
      <form>
        <table className="table-auto border-separate p-3  w-full shadow-card_shadow">
          <thead>
            <tr className=" bg-gray-200">
              <th className="table-th">S/N</th>
              <th className="table-th whitespace-nowrap">Student Name</th>
              <th className="table-th">Gender</th>
              <th className="table-th">Week 1</th>
              <th className="table-th">Week 2</th>
              <th className="table-th">Week 3</th>
              <th className="table-th">Week 4</th>
              <th className="table-th">CA 1</th>
              <th className="table-th">Half Term</th>
              <th className="table-th">CCM</th>
              <th className="table-th">Week 5</th>
              <th className="table-th">Week 6</th>
              <th className="table-th">Week 7</th>
              <th className="table-th">Week 8</th>
              <th className="table-th">CA 2</th>
              <th className="table-th">Final Exam</th>
              <th className="table-th">Total</th>
              <th className="table-th">Grade</th>
              <th className="table-th">GPA</th>
              <th className="table-th">Comment</th>
            </tr>
          </thead>
          <tbody>
            {enrollments &&
              transcripts &&
              transcripts.length > 0 &&
              enrollments.map((enrollment, index) => (
                <tr key={index} className="">
                  <td className="table-td">{index + 1}</td>
                  <td className="table-td">
                    {enrollment?.student.last_name},{' '}
                    {enrollment?.student.first_name}{' '}
                    {enrollment?.student.other_names}
                  </td>
                  <td className="table-td">M</td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['week_1']}
                      onChange={e => handleInputChange(e, index, 'week_1')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['week_2']}
                      onChange={e => handleInputChange(e, index, 'week_2')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['week_3']}
                      onChange={e => handleInputChange(e, index, 'week_3')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['week_4']}
                      onChange={e => handleInputChange(e, index, 'week_4')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['ca_1']}
                      onChange={e => handleInputChange(e, index, 'ca_1')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['half_term_exam']}
                      onChange={e =>
                        handleInputChange(e, index, 'half_term_exam')
                      }
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['ccm']}
                      onChange={e => handleInputChange(e, index, 'ccm')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['week_5']}
                      onChange={e => handleInputChange(e, index, 'week_5')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['week_6']}
                      onChange={e => handleInputChange(e, index, 'week_6')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['week_7']}
                      onChange={e => handleInputChange(e, index, 'week_7')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['week_8']}
                      onChange={e => handleInputChange(e, index, 'week_8')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['ca_2']}
                      onChange={e => handleInputChange(e, index, 'ca_2')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['final_exam']}
                      onChange={e => handleInputChange(e, index, 'final_exam')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['total']}
                      onChange={e => handleInputChange(e, index, 'total')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['grade']}
                      onChange={e => handleInputChange(e, index, 'grade')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['gpa']}
                      onChange={e => handleInputChange(e, index, 'gpa')}
                    />
                  </td>
                  <td className="table-td">
                    <TextField
                      value={transcripts[index]['comment']}
                      onChange={e => handleInputChange(e, index, 'comment')}
                    />
                  </td>
                </tr>
              ))}
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
    </>
  );
};
