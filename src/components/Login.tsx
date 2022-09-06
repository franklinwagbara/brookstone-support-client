import {TextField, Typography, Button} from '@mui/material';
import {useEffect, useState} from 'react';
import logo from '../assets/images/logo.png';
import {IUser} from '../interfaces';
import {
  useLoginMutation,
  useFetchCurrentUserMutation,
} from '../features/auth/auth_api_slice';
import {setCurrentUser} from '../features/auth/auth-slice';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {useNavigate} from 'react-router-dom';

const Login = () => {
  const [auth, setAuth] = useState({email: '', password: ''} as IUser);
  const currentUser = useAppSelector(state => state.auth.currentUser);

  const dispatch = useAppDispatch();
  const [login, {isLoading, error, isError, isSuccess}] = useLoginMutation();
  const [fetchCurrentUser, fcuResults] = useFetchCurrentUserMutation();
  const navigate = useNavigate();

  const requestCurrentUser = async () => {
    try {
      const result = await fetchCurrentUser(auth);
      dispatch(setCurrentUser((result as any).data?.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
      //todo: add different path depending on the currentUser's role
    } else {
      requestCurrentUser();
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const result = await login(auth).unwrap();
      dispatch(setCurrentUser(result.data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-3/4 flex items-center justify-center divide-x divide-solid gap-6">
      <img src={logo} width={'200rem'} alt="logo" />

      <div className="flex flex-col items-center gap-10 p-4">
        <Typography variant="h4">BROOKSTONE SUPPORT PLATFORM</Typography>
        <form className="flex flex-col px-6 py-10 bg-slate-100 shadow-md gap-4 w-96 max-w-3/4">
          {isError && (
            <p className="text-red-700">{(error as any)?.data?.error}</p>
          )}
          <TextField
            variant="outlined"
            label="Email"
            value={auth.email}
            onChange={e => setAuth(prev => ({...prev, email: e.target.value}))}
          />
          <TextField
            variant="outlined"
            label="password"
            type="password"
            value={auth.password}
            onChange={e =>
              setAuth(prev => ({...prev, password: e.target.value}))
            }
          />
          <Button
            variant="contained"
            className="bg-primary"
            onClick={handleSubmit}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Login;
