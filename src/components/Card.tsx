import {BsPeopleFill} from 'react-icons/bs';
import './style.css';

interface CardProps {
  id: string;
  class_name: string;
  subject_name: string;
  teacher_name: string;
  population?: number;
  onClick?: () => void;
}

export const Card = ({
  id,
  class_name,
  subject_name,
  teacher_name,
  population,
  onClick,
}: CardProps) => {
  return (
    <div className="card" onClick={onClick}>
      <div>
        <h5>
          <span className="font-bold">Class: </span>
          {class_name}
        </h5>
        <p>
          <span className="font-bold">Subject: </span>
          {subject_name}
        </p>
        <p>
          <span className="font-bold">Teacher: </span>
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
