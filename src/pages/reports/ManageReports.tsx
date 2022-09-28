import {TextField} from '@mui/material';
import {toLower} from 'lodash';
import {useEffect, useState} from 'react';
import {useAppSelector} from '../../app/hooks';
import {InputSelect, Loading} from '../../components';
import {useFetchClassroomsQuery} from '../../features/classroom/classroom_api_slice';
import {useFetchStudentsWithArgQuery} from '../../features/student/student_api_slice';
import {IClassroom, IStudent} from '../../interfaces';
import {StudentList} from './components/StudentList';

const NO_FILTER: string = 'No filter';

export const ManageReports = (): JSX.Element => {
  const [students, setStudents] = useState<IStudent[] | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>(NO_FILTER);
  const [selectedSection, setSelectedSection] = useState<string>(NO_FILTER);
  const [search, setSearch] = useState<string>('');
  const [classrooms, setClassrooms] = useState<IClassroom[] | null>(null);
  const currentSession = useAppSelector(
    state => state.session.currentSession?._id
  );
  const {
    data: fetchedStudents,
    isSuccess: isSuccessStudents,
    isLoading: isLoadingStudents,
  } = useFetchStudentsWithArgQuery({session: currentSession});

  const {
    data: fetchedClassrooms,
    isSuccess: isSuccessClassrooms,
    isLoading: isLoadingClassrooms,
  } = useFetchClassroomsQuery({session: currentSession});

  useEffect(() => {
    if (isSuccessStudents) {
      setStudents(fetchedStudents?.data as IStudent[]);
    }

    if (isSuccessClassrooms) {
      setClassrooms(fetchedClassrooms?.data as IClassroom[]);
    }

    if (students && students.length > 0) {
      let filteredStudents = students.filter(
        student =>
          (selectedClass &&
            selectedClass !== NO_FILTER &&
            student.classroom.name === selectedClass) ||
          (selectedSection &&
            selectedSection !== NO_FILTER &&
            student.classroom.section === selectedSection)
      );
      setStudents(filteredStudents);
    }
  }, [fetchedStudents, selectedClass, selectedSection, search]);

  if (isLoadingStudents) {
    return <Loading loading={true} />;
  }

  return (
    <div>
      <div className="flex flex-row mb-4">
        <TextField label="Search for student..." fullWidth />
        <InputSelect
          label="Class"
          value={selectedClass}
          onChange={e =>
            setSelectedClass(
              classrooms?.find(c => c.name === e.target.value)?.name as string
            )
          }
          selectionList={classrooms?.map(c => c.name) as string[]}
        />

        <InputSelect
          label="Section"
          value={selectedSection}
          onChange={e => setSelectedSection(e.target.value as string)}
          selectionList={[NO_FILTER, 'junior', 'senior', 'ify']}
        />
      </div>
      <div id="content_area">
        {students && <StudentList students={students} />}
      </div>
    </div>
  );
};
