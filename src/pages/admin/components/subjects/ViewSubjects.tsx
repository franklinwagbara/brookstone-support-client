import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {
  ISubjectRequest,
  useDeleteSubjectMutation,
  useFetchSubjectsQuery,
  useUpdateSubjectMutation,
} from '../../../../features/subject/subject_api_slice';
import {setSubjects} from '../../../../features/subject/subject_slice';
import {ISubject} from '../../../../interfaces';

export const ViewSubjects = (): JSX.Element => {
  const subjects = useAppSelector(state => state.subject.subjects);
  const dispatch = useAppDispatch();
  const {
    data: fetchedSubjects,
    isLoading: isLoadingSubjects,
    isSuccess: isSuccessSubjects,
  } = useFetchSubjectsQuery();
  const [deleteSubject] = useDeleteSubjectMutation();

  useEffect(() => {
    if (isSuccessSubjects && fetchedSubjects.data) {
      dispatch(setSubjects(fetchedSubjects.data));
    }
  }, [fetchedSubjects]);

  const handleEdit = async (id: string, subject: ISubject) => {};

  const handleDelete = async (id: string) => {
    try {
      await deleteSubject({subject_id: id} as ISubjectRequest);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingSubjects)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress size={200} color="secondary" />
      </div>
    );

  return (
    <div className="mt-4">
      <SubjectTable
        subjects={subjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

interface ISubjectTableProps {
  subjects: ISubject[];
  onDelete: (id: string) => void;
  onEdit: (id: string, user: ISubject) => void;
}
const SubjectTable = ({
  subjects,
  onDelete,
  onEdit,
}: ISubjectTableProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<ISubject | null>(null);

  const handleEdit = (subject: ISubject) => {
    setSelectedSubject(subject);
    setOpenModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setOpenModal(prev => !prev);
  };

  return (
    <>
      {selectedSubject && (
        <EditModal
          open={openModal}
          onClose={handleCloseModal}
          subject={selectedSubject}
        />
      )}
      <table>
        <thead>
          <tr>
            <th className="bg-gray-500 px-3 text-center py-2">S/N</th>
            <th className="bg-gray-500 px-3 text-center py-2">NAME</th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
            <th className="bg-gray-500 px-3 text-center py-2"></th>
          </tr>
        </thead>

        <tbody>
          {subjects &&
            subjects.map((subject, index) => (
              <tr key={subject._id as string}>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  {subject.name}
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => handleEdit(subject)}
                    variant="contained"
                    color="primary"
                  >
                    Edit
                  </Button>
                </td>
                <td className="bg-gray-300 px-3 text-center py-2 whitespace-nowrap">
                  <Button
                    onClick={() => onDelete(subject._id as string)}
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

interface IEditProps {
  open: boolean;
  subject: ISubject;
  onClose: () => void;
}

const EditModal = ({open: openModal, subject, onClose}: IEditProps) => {
  const [subjectInfo, setSubjectInfo] = useState<ISubject>({...subject});
  const [updateSubject, {isLoading: isLoadingUpdateSubject}] =
    useUpdateSubjectMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await updateSubject({
      subject_id: subjectInfo._id as string,
      body: subjectInfo,
    });
    onClose();
  };

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className="flex flex-col flex-1 gap-4 m-auto w-96 h-72 p-4 bg-background translate-y-1/2">
        <TextField
          value={subjectInfo.name}
          label="First Name"
          onChange={e =>
            setSubjectInfo({...subjectInfo, name: e.target.value as string})
          }
        />

        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
