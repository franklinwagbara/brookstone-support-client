import {Navigate} from 'react-router-dom';
import {Outlet} from 'react-router-dom';
import {useAppSelector} from '../app/hooks';

export const ProtectedRoutes = (): JSX.Element => {
  const currentUser = useAppSelector(state => state.auth.currentUser);

  return <>{currentUser ? <Outlet /> : <Navigate to="/" />}</>;
};
