import {Typography} from '@mui/material';

interface CardProps {
  title: string;
  onClick?: () => void;
}

export const AdminCard = ({title, onClick}: CardProps) => {
  return (
    <div
      className="flex items-center w-72 rounded-lg bg-secondary h-44 shadow-card_shadow text-background cursor-pointer p-3 justify-center"
      onClick={onClick}
    >
      <Typography variant="h5">{title}</Typography>
    </div>
  );
};
