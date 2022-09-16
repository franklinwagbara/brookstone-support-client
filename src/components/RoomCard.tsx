import {BsPeopleFill} from 'react-icons/bs';
import './style.css';

interface CardProps {
  id: string;
  class_name: string;
  form_tutor: string;
  population?: number;
  onClick?: () => void;
}

export const RoomCard = ({
  id,
  class_name,
  form_tutor,
  population,
  onClick,
}: CardProps) => {
  return (
    <div className="card bg-gray-200" onClick={onClick}>
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
