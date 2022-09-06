import {Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import {useAppSelector} from './app/hooks';
import {
  Assessment,
  AssignedClasses,
  Header,
  Login,
  ProtectedRoutes,
} from './components';
import {NavItem, NavItems} from './components/Header';
import {Dashboard} from './pages';

function App() {
  const currentUser = useAppSelector(state => state.auth.currentUser);
  console.log('current user in app', currentUser);
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
          <Route path="assessment/:id" element={<Assessment />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
