import {CircularProgress} from '@mui/material';

interface LoadingProps {
  loading: boolean;
  size?: number;
}

export const Loading = ({loading, size}: LoadingProps): JSX.Element => {
  return (
    <>
      {loading && (
        <div className="flex items-center justify-center w-full h-screen">
          <CircularProgress size={200} color="secondary" />
        </div>
      )}
    </>
  );
};
