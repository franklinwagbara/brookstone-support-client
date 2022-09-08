import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from '@mui/material';
import {ReactNode, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {
  IUserRequest,
  useDeleteUserMutation,
  useFetchUsersQuery,
  useUpdateUserMutation,
} from '../../../features/user/user_api_slice';
import {setUsers} from '../../../features/user/user_slice';
import {IUser} from '../../../interfaces';

export const ViewUsers = (): JSX.Element => {
  const users = useAppSelector(state => state.user.users);
  const dispatch = useAppDispatch();
  const {
    data,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
  } = useFetchUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    if (isSuccessUser && data.data) {
      dispatch(setUsers(data.data));
    }
  }, [data]);

  const handleEdit = async (id: string, user: IUser) => {};

  const handleDelete = async (id: string) => {
    try {
      await deleteUser({user_id: id} as IUserRequest);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingUser)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="mt-4">
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

interface IUserTableProps {
  users: IUser[];
  onDelete: (id: string) => void;
  onEdit: (id: string, user: IUser) => void;
}
const UserTable = ({users, onDelete, onEdit}: IUserTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  return (
    <>
      {selectedUser && (
        <EditModal
          open={openModal}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}
      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">NAME</th>
            <th className="bg-gray-500 px-3 text-center py-2">EMAIL</th>
            <th className="bg-gray-500 px-3 text-center py-2">ROLE</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {users &&
            users.map((user, index) => (
              <tr key={user._id as string}>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {user.lastname}, {user.firstname}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {user.role}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => handleEdit(user)}
                    variant="contained"
                    color="primary"
                  >
                    Edit
                  </Button>
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => onDelete(user._id as string)}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

interface IEditProps {
  open: boolean;
  user: IUser;
  onClose: () => void;
}

const EditModal = ({open: openModal, user, onClose}: IEditProps) => {
  const [userInfo, setUserInfo] = useState<IUser>({...user});
  const [updateUser, {isLoading: isLoadingUpdate}] = useUpdateUserMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await updateUser({user_id: userInfo._id as string, body: userInfo});
    onClose();
  };

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className="flex flex-col flex-1 gap-4 m-auto w-96 h-72 p-4 bg-background translate-y-1/2">
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
            <MenuItem value={'User'}>User</MenuItem>
            <MenuItem value={'Admin'}>Admin</MenuItem>
            <MenuItem value={'Teacher'}>Teacher</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
