import {Button} from '@mui/material';
import {useState} from 'react';
import {IStudent} from '../interfaces';
import {EditStudentModal} from './EditStudentModal';

interface IStudentTableProps {
  students: IStudent[];
  onDelete: (id: string) => void;
  onEdit: (id: string, student: IStudent) => void;
}

export const StudentTable = ({
  students,
  onDelete,
  onEdit,
}: IStudentTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);

  const handleEdit = (student: IStudent) => {
    setSelectedStudent(student);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  return (
    <>
      {selectedStudent && (
        <EditStudentModal
          open={openModal}
          onClose={handleCloseModal}
          student={selectedStudent}
        />
      )}
      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">NAME</th>
            <th className="bg-gray-500 px-3 text-center py-2">GENDER</th>
            <th className="bg-gray-500 px-3 text-center py-2">YEAR GROUP</th>
            <th className="bg-gray-500 px-3 text-center py-2">DATE OF BIRTH</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {students &&
            students.map((student, index) => (
              <tr key={student._id as string}>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.last_name}, {student.first_name}{' '}
                  {student.other_names}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.gender}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.year_group.year}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {student.dob}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => handleEdit(student)}
                    variant="contained"
                    color="primary"
                  >
                    Edit
                  </Button>
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => onDelete(student._id as string)}
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
