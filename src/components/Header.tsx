import {ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import logo from '../assets/images/logo.png';
import {useLogoutMutation} from '../features/auth/auth_api_slice';
import {setCurrentUser} from '../features/auth/auth-slice';

interface HeaderProps {
  children?: ReactNode;
}
const Header = ({children}: HeaderProps) => {
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogin = (e: React.MouseEvent<HTMLDivElement>) => {
    navigate('/login');
  };

  const handleLogout = async (e: React.MouseEvent<HTMLDivElement>) => {
    await logout();
    dispatch(setCurrentUser(null));
  };

  return (
    <div className="relative bg-primary z-50 shadow-header_shadow p-2 flex justify-between items-center md:px-20 text-background">
      <img src={logo} width={'50em'} alt="logo" />
      <div className="cursor-pointer">{}</div>
      {children}

      {currentUser ? (
        <div className="cursor-pointer" onClick={handleLogout}>
          Logout
        </div>
      ) : (
        <div className="cursor-pointer" onClick={handleLogin}>
          Login
        </div>
      )}
    </div>
  );
};
export default Header;

interface NavItemsProps {
  children?: ReactNode;
}
export const NavItems = ({children}: NavItemsProps) => {
  return <div>{children}</div>;
};

interface NavItemProps {
  content?: string;
  children?: ReactNode;
}
export const NavItem = ({content, children}: NavItemProps) => {
  return (
    <div className="cursor-pointer">
      {content}
      {children}
    </div>
  );
};
