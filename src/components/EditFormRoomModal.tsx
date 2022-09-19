import {Modal, TextField, Button} from '@mui/material';
import {useState, useEffect} from 'react';
import {IBehaviour, IClassroomEnrollment} from '../interfaces';
import {InputSelect} from './InputSelect';
import {AlertType, WEEKS} from '../globals/constants';
import {WEEKS_MAPPER, RATINGS} from '../globals/constants';
import {
  IBehaviourRequest,
  useAddBehaviourMutation,
  useFetchBehavioursQuery,
  useUpdateBehaviourMutation,
} from '../features/behaviour/behaviour_api_slice';
import {useAppDispatch} from '../app/hooks';
import {setAlert} from '../features/alert/alert-slice';

interface IEditProps {
  open: boolean;
  enrollment: IClassroomEnrollment;
  onSubmit: (formRoomInfo: IClassroomEnrollment) => void;
  onClose: () => void;
}

const initialBehaviour = {
  _id: '' as any,
  student: '' as any,
  session: '' as any,
  week: '' as any,
  active_participation_and_composure_during_lessons: '' as any,
  ownership_of_learning: '' as any,
  punctuality_and_attendance_to_lessons: '' as any,
  motivation_and_value_for_academic_success: '' as any,
  self_confidence_towards_academic_work: '' as any,
  effective_use_of_study_skills: '' as any,
  Assessed_extended_learning: '' as any,
  completion_of_extended_learning: '' as any,
  organizational_skills: '' as any,
  obedience_to_pastoral_rules_and_regulations: '' as any,
  cooperation_with_boarding_parents: '' as any,
  ability_to_concentrate_during_prep: '' as any,
  punctuality: '' as any,
} as IBehaviour;

export const EditFormRoomModal = ({
  open: openModal,
  enrollment,
  onSubmit,
  onClose,
}: IEditProps) => {
  const [formRoomInfo, setFormRoomInfo] = useState<IClassroomEnrollment>({
    ...enrollment,
  });
  const [week, setWeek] = useState<string>('1');
  const [behaviour, setBehaviour] = useState<IBehaviour>(initialBehaviour);

  const dispatch = useAppDispatch();

  const {
    data: fetchedBehaviours,
    isLoading: isLoadingBehaviours,
    isSuccess: isSuccessBehavioours,
  } = useFetchBehavioursQuery(
    {
      student: enrollment.student._id as any,
      session: enrollment.session._id as any,
    },
    {skip: !enrollment.student._id}
  );

  console.log('checking', enrollment, behaviour);
  const [addBehaviour, {isLoading: isLoadingAddBehaviour}] =
    useAddBehaviourMutation();
  const [updateBehaviour, {isLoading: isLoadingUpdateBehaviour}] =
    useUpdateBehaviourMutation();

  useEffect(() => {
    if (
      fetchedBehaviours?.data &&
      (fetchedBehaviours.data as IBehaviour[]).length > 0
    ) {
      let _behaviour = (fetchedBehaviours.data as IBehaviour[]).find(
        b => b.week === week
      );

      if (!_behaviour) _behaviour = initialBehaviour;

      const tempBe = {...initialBehaviour};

      tempBe._id = _behaviour._id as any;
      tempBe.student = _behaviour.student as any;
      tempBe.session = _behaviour.session as any;
      tempBe.week = _behaviour.week as any;
      tempBe.active_participation_and_composure_during_lessons =
        _behaviour.active_participation_and_composure_during_lessons as any;
      tempBe.ownership_of_learning = _behaviour.ownership_of_learning as any;
      tempBe.punctuality_and_attendance_to_lessons =
        _behaviour.punctuality_and_attendance_to_lessons as any;
      tempBe.motivation_and_value_for_academic_success =
        _behaviour.motivation_and_value_for_academic_success as any;
      tempBe.self_confidence_towards_academic_work =
        _behaviour.self_confidence_towards_academic_work as any;
      tempBe.effective_use_of_study_skills =
        _behaviour.effective_use_of_study_skills as any;
      tempBe.Assessed_extended_learning =
        _behaviour.Assessed_extended_learning as any;
      setBehaviour(_behaviour);
    } else {
      setBehaviour({...initialBehaviour});
    }
  }, [fetchedBehaviours, enrollment, week]);

  console.log(enrollment, enrollment.student);
  const handleSubmit = async () => {
    onSubmit(formRoomInfo);
    if (behaviour.student && behaviour.session) {
      const _tempBe = {
        ...behaviour,
        week: week,
      };
      await updateBehaviour(behaviour as any)
        .unwrap()
        .catch(error => {
          dispatch(
            setAlert({
              message:
                'Something went wrong while trying to save Behaviour assessment!',
              show: true,
              type: AlertType.ERROR,
            })
          );
        });
    } else {
      const _tempBe = {
        ...behaviour,
        student: enrollment.student._id as any,
        session: enrollment.session._id as any,
        week: week,
      };
      await addBehaviour(_tempBe as any)
        .unwrap()
        .catch(error => {
          dispatch(
            setAlert({
              message:
                'Something went wrong while trying to save Behaviour assessment!',
              show: true,
              type: AlertType.ERROR,
            })
          );
        });
    }
    onClose();
  };

  return (
    <Modal open={openModal} onClose={onClose}>
      <form className=" max-h-screen overflow-auto flex flex-col flex-1 gap-4 m-auto w-150 p-4 bg-background ">
        <InputSelect
          label="Week"
          value={week}
          onChange={e => setWeek(e.target.value as string)}
          selectionList={WEEKS}
        />

        <TextField
          value={formRoomInfo[WEEKS_MAPPER[week] as unknown as any] || ''}
          label="Form Tutor's Comment"
          multiline
          minRows={5}
          onChange={e =>
            setFormRoomInfo({
              ...formRoomInfo,
              [WEEKS_MAPPER[week]]: e.target.value as string,
            })
          }
        />

        <table className="border-separate">
          <caption className=" font-extrabold py-3">
            Behavioural Assessment
          </caption>
          <thead>
            <tr>
              <th></th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">
                Active participation and composure during lessons
              </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={
                    behaviour.active_participation_and_composure_during_lessons
                  }
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      active_participation_and_composure_during_lessons: e
                        .target.value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">Ownership of learning </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.ownership_of_learning}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      ownership_of_learning: e.target.value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">
                Punctuality and attendance to lessons
              </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.punctuality_and_attendance_to_lessons}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      punctuality_and_attendance_to_lessons: e.target
                        .value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">
                Motivation and value for academic success
              </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.motivation_and_value_for_academic_success}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      motivation_and_value_for_academic_success: e.target
                        .value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">
                Self-confidence towards academic work
              </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.self_confidence_towards_academic_work}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      self_confidence_towards_academic_work: e.target
                        .value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">
                Effective use of study skills
              </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.effective_use_of_study_skills}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      effective_use_of_study_skills: e.target.value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
            <tr className="table-tr-behaviour">
              <td className="bg-gray-200 px-2">Assessed extended learning </td>
              <td>
                <InputSelect
                  label="Rating"
                  size="small"
                  value={behaviour.Assessed_extended_learning}
                  onChange={e =>
                    setBehaviour(prev => ({
                      ...prev,
                      Assessed_extended_learning: e.target.value as any,
                    }))
                  }
                  selectionList={RATINGS}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
