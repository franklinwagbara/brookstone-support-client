import {BsPeopleFill} from 'react-icons/bs';
import {IStudent, ISubject} from '../interfaces';
import {Assessment} from './Assessment';
import './style.css';

interface CardProps {
  id: string;
  class_name: string;
  subject_name: string;
  teacher_name: string;
  total?: string;
  onClick?: () => void;
}
export const ClassCard = ({
  id,
  class_name,
  subject_name,
  teacher_name,
  total,
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
        <span>{total}</span>
      </div>
    </div>
  );
};
