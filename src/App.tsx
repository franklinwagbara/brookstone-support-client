import {Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import {useAppSelector} from './app/hooks';
import {Assessment, AssignedClasses, Header, Login} from './components';
import {NavItem, NavItems} from './components/Header';
import {AdminDashboard, Dashboard} from './pages';
import {ManageEnrollments} from './pages/admin/ManageEnrollments';
import {ManageStudents} from './pages/admin/ManageStudents';
import {ManageUsers} from './pages/admin/ManageUsers';
import {ManageSubjects} from './pages/admin/ManageSubjects';
import {ManageReports} from './pages/reports/ManageReports';
import {AssignedFormRooms} from './pages/form-rooms/AssignedFormRooms';
import {ManageClassroomEnrollments} from './pages/admin/ManageClassroomEnrollments';
import {ManageClassrooms} from './pages/admin/ManageClassrooms';
import {FormAssessment} from './pages/form-rooms/FormAssessment';
import {FormList} from './pages/form-rooms/FormList';
import {ManageBoardingHouses} from './pages/admin/ManageBoardingHouses';
import {ManageBoardingEnrollments} from './pages/admin/ManageBoardingEnrollments';
import {AssignedBoardingHouses} from './pages/boarding/AssignedBoardingHouses';
import {HouseList} from './pages/boarding/HouseList';
import {ManageYearGroups} from './pages/admin/ManageYearGroups';

function App() {
  const currentUser = useAppSelector(state => state.auth.currentUser);
  return (
    <div className="w-full min-w-fit h-full min-h-screen">
      <Header>
        <NavItems>
          {currentUser && (
            <NavItem>
              Welcome, {currentUser.lastname + ', ' + currentUser.firstname}!
            </NavItem>
          )}
        </NavItems>
      </Header>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route path="assignedclasses" element={<AssignedClasses />} />
          <Route path="assignedformrooms" element={<AssignedFormRooms />} />
          <Route
            path="assignedboardinghouses"
            element={<AssignedBoardingHouses />}
          />
          <Route
            path="assessment/:class_id/:subject_id"
            element={<Assessment />}
          />
          <Route
            path="assessment/:formroom_id"
            element={<AssignedFormRooms />}
          />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="enrollments" element={<ManageEnrollments />} />
          <Route
            path="classroomEnrollments"
            element={<ManageClassroomEnrollments />}
          />
          <Route path="subjects" element={<ManageSubjects />} />
          <Route path="reports" element={<ManageReports />} />
          <Route path="classrooms" element={<ManageClassrooms />} />
          <Route path="boardinghouses" element={<ManageBoardingHouses />} />
          <Route path="yeargroups" element={<ManageYearGroups />} />
          <Route
            path="boardingenrollments"
            element={<ManageBoardingEnrollments />}
          />
          <Route path="formlist/:formroom_id" element={<FormList />} />
          <Route path="houselist/:house_id" element={<HouseList />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
