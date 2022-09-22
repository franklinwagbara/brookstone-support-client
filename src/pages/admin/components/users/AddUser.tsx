import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {useState} from 'react';
import {useAppDispatch} from '../../../../app/hooks';
import {Loading} from '../../../../components';
import {setAlert} from '../../../../features/alert/alert-slice';
import {useAddUserMutation} from '../../../../features/user/user_api_slice';
import {AlertType} from '../../../../globals';
import {ROLES} from '../../../../globals/roles';
import {IUser} from '../../../../interfaces';

const initialUSerState: IUser = {
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  role: 'User',
  password: '',
  confirm_password: '',
};

export const AddUser = () => {
  const [userInfo, setUserInfo] = useState<IUser>(initialUSerState);
  const [addUser, {isLoading: isLoading}] = useAddUserMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await addUser(userInfo)
      .unwrap()
      .then(payload =>
        dispatch(
          setAlert({
            message: 'User was created successfully!',
            show: true,
            type: AlertType.SUCCESS,
          })
        )
      )
      .catch(error =>
        dispatch(
          setAlert({
            message: JSON.stringify(error),
            show: true,
            type: AlertType.ERROR,
          })
        )
      );
  };

  if (isLoading) {
    return <Loading loading={true} />;
  }

  return (
    <form className="flex flex-col flex-1 gap-4 mt-3 w-96 h-72 p-4 bg-background">
      <TextField
        value={userInfo.username}
        label="Username"
        onChange={e =>
          setUserInfo({...userInfo, username: e.target.value as string})
        }
      />
      <TextField
        value={userInfo.firstname}
        label="First Name"
        onChange={e =>
          setUserInfo({...userInfo, firstname: e.target.value as string})
        }
      />
      <TextField
        value={userInfo.lastname}
        label="Last Name"
        onChange={e =>
          setUserInfo({...userInfo, lastname: e.target.value as string})
        }
      />
      <TextField
        value={userInfo.email}
        label="Email"
        onChange={e =>
          setUserInfo({...userInfo, email: e.target.value as string})
        }
      />
      <TextField
        value={userInfo.password}
        label="Password"
        type="password"
        onChange={e =>
          setUserInfo({...userInfo, password: e.target.value as string})
        }
      />
      <TextField
        value={userInfo.confirm_password}
        label="Confirm Password"
        type="password"
        onChange={e =>
          setUserInfo({...userInfo, confirm_password: e.target.value as string})
        }
      />
      <FormControl fullWidth>
        <InputLabel id="select-label">Role</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={userInfo.role}
          label="Role"
          onChange={e =>
            setUserInfo({...userInfo, role: e.target.value as string})
          }
        >
          <MenuItem value={ROLES.user}>User</MenuItem>
          <MenuItem value={ROLES.admin}>Admin</MenuItem>
          <MenuItem value={ROLES.teacher}>Teacher</MenuItem>
          <MenuItem value={ROLES.form_tutor}>Form Tutor</MenuItem>
          <MenuItem value={ROLES.form_tutor_and_teacher}>
            Form Tutor / Teacher
          </MenuItem>
          <MenuItem value={ROLES.boarding_parent}>Boarding Parent</MenuItem>
          <MenuItem value={ROLES.boarding_parent_and_teacher}>
            Boarding Parent / Teacher
          </MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleSubmit} variant="contained">
        Submit
      </Button>
    </form>
  );
};
