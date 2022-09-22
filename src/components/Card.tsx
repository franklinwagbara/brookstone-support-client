import {BsPeopleFill} from 'react-icons/bs';
import './style.css';

interface CardProps {
  id: string;
  class_name: string;
  subject_name: string;
  teacher_name: string;
  population?: number;
  onClick?: () => void;
  color?: 'primary' | 'secondary';
}

export const Card = ({
  id,
  class_name,
  subject_name,
  teacher_name,
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
          <span className="font-bold mr-2">Class: </span>
          {class_name}
        </h5>
        <p>
          <span className="font-bold mr-2">Subject: </span>
          {subject_name}
        </p>
        <p>
          <span className="font-bold mr-2">Teacher: </span>
          {teacher_name}
        </p>
      </div>
      <div className="flex items-baseline gap-1">
        <BsPeopleFill />
        <span>{population}</span>
      </div>
    </div>
  );
};
