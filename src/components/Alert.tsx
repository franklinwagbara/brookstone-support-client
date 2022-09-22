import {Alert as MUIAlert} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppDispatch} from '../app/hooks';
import {setAlert} from '../features/alert/alert-slice';
import {AlertType} from '../globals';

interface IAlertProps {
  show: boolean;
  color: AlertType;
  severity: AlertType;
  message: string;
  onClose: () => void;
}

export const Alert = ({
  show,
  color,
  severity,
  message,
  onClose,
}: IAlertProps) => {
  const [showAlert, setShowAlert] = useState<boolean>(show);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        setAlert({
          message: '',
          show: false,
          type: AlertType.SUCCESS,
        })
      );
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);
  return (
    <div className="-mt-2 mb-3">
      {show && (
        <MUIAlert severity={severity} color={color} onClose={onClose}>
          {message}
        </MUIAlert>
      )}
    </div>
  );
};
