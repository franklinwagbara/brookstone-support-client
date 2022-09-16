import {Alert} from '@mui/material';
import {ReactNode, useEffect} from 'react';
import {Navigate, Outlet, useNavigate} from 'react-router-dom';
import {NavItems} from '../../components/Header';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {useFetchCurrentSessionQuery} from '../../features/session/session_api_slice';
import {setCurrentSession} from '../../features/session/session_slice';
import {setEnrollments} from '../../features/enrollment/enrollment_slice';
import {useFetchEnrollmentsQuery} from '../../features/enrollment/enrollment_api_slice';
import {CircularProgress} from '@mui/material';
import {setAlert} from '../../features/alert/alert-slice';

export const Dashboard = (): JSX.Element => {
  const alert = useAppSelector(state => state.alert);
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const session = useAppSelector(state => state.session.currentSession);
  const navigate = useNavigate();
  const {data: session_data_response, isSuccess: sessionSuccess} =
    useFetchCurrentSessionQuery();
  const {
    data: enrollment_data_response,
    isLoading: isLoadingEnrollment,
    isSuccess: enrollmentSuccess,
  } = useFetchEnrollmentsQuery(
    {
      teacher: currentUser?._id as string,
      session: session?._id as string,
    },
    {skip: !sessionSuccess}
  );

  const dispatch = useAppDispatch();

  const handleShow = () => {
    dispatch(setAlert({...alert, show: !alert.show}));
  };

  useEffect(() => {
    dispatch(setCurrentSession((session_data_response as any)?.data[0]));
    dispatch(setEnrollments((enrollment_data_response as any)?.data));
    navigate('/dashboard/assignedclasses');
  }, [session_data_response, enrollment_data_response]);

  if (isLoadingEnrollment)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="flex flex-row min-h-screen">
      <div
        id="side_nav"
        className="basis-1/6 min-h-full bg-primary_accent shadow-header_shadow text-background flex justify-center pt-8"
      >
        <NavItems>
          <SideNavItem
            onClick={() => navigate('/dashboard/assignedclasses')}
            content="Home"
            home
          />
          <SideNavItem
            onClick={() => navigate('/dashboard/assignedclasses')}
            content="Classes"
          />
          <SideNavItem
            onClick={() => navigate('/dashboard/assignedformrooms')}
            content="Form Rooms"
          />
          <SideNavItem
            onClick={() => navigate('/dashboard/assessment')}
            content="Assessment"
          />
          <SideNavItem
            onClick={() => navigate('/dashboard/admin')}
            content="Admin"
          />
          <SideNavItem
            onClick={() => navigate('/dashboard/reports')}
            content="Reports"
          />
        </NavItems>
      </div>
      <div id="main" className="px-6 py-8 flex flex-col flex-1">
        {alert.show && (
          <Alert severity={alert.type} color={alert.type} onClose={handleShow}>
            {alert.message}
          </Alert>
        )}

        {currentUser ? <Outlet /> : <Navigate to="/" />}
      </div>
    </div>
  );
};

interface NavItemProps {
  children?: ReactNode;
  content: string;
  home?: boolean;
  onClick?(event: React.MouseEvent<HTMLDivElement>): void;
}

export const SideNavItem = ({
  children,
  content,
  home,
  onClick,
}: NavItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`text-lg ${
        home ? 'bg-gray-600' : ''
      } hover:bg-gray-700 border-b-2 hover:cursor-pointer px-16 py-2 my-4 rounded-full whitespace-nowrap`}
    >
      {content ?? children}
    </div>
  );
};
