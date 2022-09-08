import {Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import {useAppSelector} from './app/hooks';
import {Assessment, AssignedClasses, Header, Login} from './components';
import {NavItem, NavItems} from './components/Header';
import {AdminDashboard, Dashboard} from './pages';
import {ManageUsers} from './pages/admin/ManageUsers';

function App() {
  const currentUser = useAppSelector(state => state.auth.currentUser);
  return (
    <div className="w-full min-w-fit h-full min-h-screen">
      <Header>
        <NavItems>
          {currentUser && <NavItem>Welcome, {currentUser.username}!</NavItem>}
        </NavItems>
      </Header>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route path="assignedclasses" element={<AssignedClasses />} />
          <Route
            path="assessment/:class_id/:subject_id"
            element={<Assessment />}
          />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
