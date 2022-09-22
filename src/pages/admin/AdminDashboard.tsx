import {useNavigate} from 'react-router-dom';
import {AdminCard} from '../../components';

export const AdminDashboard = (): JSX.Element => {
  const naviage = useNavigate();

  const handleClick = (path: string) => {
    naviage(path);
  };
  return (
    <div className="basis-5/6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      <AdminCard
        title="Manage Students"
        onClick={() => handleClick('/dashboard/students')}
      />
      <AdminCard
        title="Manage Users"
        onClick={() => handleClick('/dashboard/users')}
      />
      <AdminCard
        title="Manage Enrollments"
        onClick={() => handleClick('/dashboard/enrollments')}
      />
      <AdminCard
        title="Manage Classroom Enrollments"
        onClick={() => handleClick('/dashboard/classroomEnrollments')}
      />
      <AdminCard
        title="Manage Classrooms"
        onClick={() => handleClick('/dashboard/classrooms')}
      />
      <AdminCard
        title="Manage Boarding Houses"
        onClick={() => handleClick('/dashboard/boardinghouses')}
      />
      <AdminCard
        title="Manage Boarding Enrollments"
        onClick={() => handleClick('/dashboard/boardingenrollments')}
      />
      <AdminCard
        title="Manage School Session"
        onClick={() => handleClick('/dashboard/sessions')}
      />
      <AdminCard
        title="Manage Subjects"
        onClick={() => handleClick('/dashboard/subjects')}
      />
      <AdminCard
        title="Manage Year Groups"
        onClick={() => handleClick('/dashboard/yeargroups')}
      />
    </div>
  );
};
