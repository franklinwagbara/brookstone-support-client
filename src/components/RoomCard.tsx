import {BsPeopleFill} from 'react-icons/bs';
import './style.css';

interface CardProps {
  id: string;
  class_name: string;
  form_tutor: string;
  population?: number;
  color?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const RoomCard = ({
  id,
  class_name,
  form_tutor,
  population,
  onClick,
  color,
}: CardProps) => {
  return (
    <div
      className={`card ${color ? `bg-${color}` : 'bg-primary_light'}`}
      onClick={onClick}
    >
      <div>
        <h5>
          <span className="font-bold">Class: </span>
          {class_name}
        </h5>
        <p>
          <span className="font-bold">Form Tutor: </span>
          {form_tutor}
        </p>
      </div>
      <div className="flex items-baseline gap-1">
        <BsPeopleFill />
        <span>{population}</span>
      </div>
    </div>
  );
};
