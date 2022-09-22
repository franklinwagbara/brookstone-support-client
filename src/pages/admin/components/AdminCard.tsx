import {Typography} from '@mui/material';

interface CardProps {
  title: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary';
}

export const AdminCard = ({title, onClick, color}: CardProps) => {
  return (
    <div
      className={`flex items-center w-72 rounded-lg  h-44 shadow-card_shadow text-background cursor-pointer p-3 justify-center ${
        color ? `bg-${color}` : 'bg-secondary'
      }`}
      onClick={onClick}
    >
      <Typography variant="h5">{title}</Typography>
    </div>
  );
};
